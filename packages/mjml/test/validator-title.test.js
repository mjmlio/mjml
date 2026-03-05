const chai = require('chai')
const mjml = require('../lib')

describe('validator - mj-title', function () {
  it('warns when mj-title is empty', async function () {
    const input = `
      <mjml>
        <mj-head>
          <mj-title>   </mj-title>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Hello</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) => (e.message || '').includes('Empty mj-title.')),
        'includes empty mj-title warning',
      )
      .to.equal(true)
  })

  it('warns when mj-title is missing', async function () {
    const input = `
      <mjml>
        <mj-head>
          <!-- no mj-title here -->
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Hello</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) => (e.message || '').includes('Missing mj-title.')),
        'includes missing mj-title warning',
      )
      .to.equal(true)
  })

  it('warns when mj-head is omitted (and no mj-title)', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Hello</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) => (e.message || '').includes('Missing mj-title.')),
        'includes missing mj-title warning when no mj-head',
      )
      .to.equal(true)
  })
})
