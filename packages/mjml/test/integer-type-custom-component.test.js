const chai = require('chai')
const mjml = require('../lib')
const {
  BodyComponent,
  components,
  registerComponent,
} = require('../../mjml-core/lib/index')
const { dependencies } = require('../../mjml-validator/lib/index')

class MjDummyInteger extends BodyComponent {
  render() {
    return `<div data-count="${this.getAttribute('count')}"></div>`
  }
}
MjDummyInteger.componentName = 'mj-dummy-integer'
MjDummyInteger.allowedAttributes = {
  count: 'integer',
}
MjDummyInteger.dependencies = {
  'mj-column': ['mj-dummy-integer'],
  'mj-dummy-integer': [],
}

const buildInput = (attrs) => `
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-dummy-integer ${attrs} />
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`

const validate = async (attrs, validationLevel = 'soft') => {
  const { errors } = await mjml(buildInput(attrs), { validationLevel })
  return errors.filter((e) => e.tagName === 'mj-dummy-integer')
}

describe('integer type (custom component)', function () {
  let columnDependencies

  before(function () {
    columnDependencies = dependencies['mj-column']
    registerComponent(MjDummyInteger, { registerDependencies: true })
  })

  after(function () {
    delete components['mj-dummy-integer']
    delete dependencies['mj-dummy-integer']
    dependencies['mj-column'] = columnDependencies
  })

  // integer(px) is covered end-to-end by mj-table in table-cellspacing.test.js
  it('should accept a valid value', async function () {
    chai.expect(await validate('count="6"')).to.have.length(0)
  })

  it('should report an invalid value', async function () {
    const errors = await validate('count="6px"')

    chai.expect(errors).to.have.length(1)
    chai.expect(errors[0].message).to.contain('Attribute count')
    chai.expect(errors[0].message).to.contain('only accepts integers')
    chai.expect(errors[0].message).not.to.contain('(px)')
  })

  it('should not strip px from plain integer attributes', async function () {
    const { html } = await mjml(buildInput('count="6px"'), {
      validationLevel: 'skip',
    })

    chai.expect(html).to.contain('data-count="6px"')
  })

  it('should not report an error when the attribute is absent', async function () {
    chai.expect(await validate('')).to.have.length(0)
  })

  it('should skip validation and render the value unchanged', async function () {
    const { html, errors } = await mjml(buildInput('count="abc5"'), {
      validationLevel: 'skip',
    })

    chai.expect(errors).to.have.length(0)
    chai.expect(html).to.contain('data-count="abc5"')
  })
})
