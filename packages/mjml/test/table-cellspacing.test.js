const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')
const { extractStyle } = require('./utils')

describe('mj-table cellspacing', function () {
  it('should render correct cellspacing (and border-collapse) in HTML tag / CSS style values on mj-table', async function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-table border="1px solid #000" width="auto" cellpadding="20" cellspacing="10" css-class="my-table">
              <tr style="border-bottom:1px solid #000;text-align:left;">
                <th style="background:#ddd;">Year</th>
                <th style="background:#ddd;">Language</th>
                <th style="background:#ddd;">Inspired from</th>
              </tr>
              <tr>
                <td style="background:#ddd;">1995</td>
                <td style="background:#ddd;">PHP</td>
                <td style="background:#ddd;">C, Shell Unix</td>
              </tr>
            </mj-table>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `

    const { html } = await mjml(input)

    const $ = load(html)

    // border radius values should be correct
    chai
      .expect(
        $('.my-table > table')
          .map(function getAttr() {
            return $(this).attr('cellspacing')
          })
          .get(),
        'cellspacing values on table elements',
      )
      .to.eql(['10'])

    // border collapse values should be correct
    chai
      .expect(
        $('.my-table > table')
          .map(function getAttr() {
            const style = $(this).attr('style')
            return extractStyle(style, 'border-collapse')
          })
          .get(),
        'Border-collapse in CSS style values on mj-table',
      )
      .to.eql(['separate'])
  })
})

describe('mj-table cellpadding / cellspacing px values and validation', function () {
  const buildInput = (attrs) => `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-table ${attrs} css-class="my-table">
              <tr><td>1995</td></tr>
            </mj-table>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `

  const getTableAttrs = (html) => {
    const $ = load(html)
    const table = $('.my-table > table')
    return {
      cellpadding: table.attr('cellpadding'),
      cellspacing: table.attr('cellspacing'),
      borderCollapse: extractStyle(table.attr('style'), 'border-collapse'),
    }
  }

  const getTableErrors = (errors) =>
    errors.filter((e) => e.tagName === 'mj-table')

  it('should strip px from cellpadding and cellspacing in the HTML output', async function () {
    const { html, errors } = await mjml(
      buildInput('cellpadding="6px" cellspacing="4px"'),
    )

    chai.expect(getTableErrors(errors)).to.have.length(0)
    chai.expect(getTableAttrs(html)).to.eql({
      cellpadding: '6',
      cellspacing: '4',
      borderCollapse: 'separate',
    })
  })

  it('should keep unitless integer values as-is', async function () {
    const { html, errors } = await mjml(
      buildInput('cellpadding="6" cellspacing="4"'),
    )

    chai.expect(getTableErrors(errors)).to.have.length(0)
    chai.expect(getTableAttrs(html)).to.include({
      cellpadding: '6',
      cellspacing: '4',
    })
  })

  it('should not set border-collapse: separate when cellspacing is 0px', async function () {
    const { html, errors } = await mjml(buildInput('cellspacing="0px"'))

    chai.expect(getTableErrors(errors)).to.have.length(0)
    chai.expect(getTableAttrs(html)).to.include({
      cellpadding: '0',
      cellspacing: '0',
    })
    // extractStyle can't express an absent property, so check the raw style
    chai
      .expect(load(html)('.my-table > table').attr('style'))
      .not.to.contain('border-collapse')
  })

  const invalidValues = ['abc5', '5abc', '10%', '6em', '1.5', '-6', '6PX', ' 6']

  invalidValues.forEach((value) => {
    it(`should report a validation error for "${value}"`, async function () {
      const { html, errors } = await mjml(
        buildInput(`cellpadding="${value}" cellspacing="${value}"`),
        { validationLevel: 'soft' },
      )

      const tableErrors = getTableErrors(errors)
      chai.expect(tableErrors).to.have.length(2)
      tableErrors.forEach((e) =>
        chai
          .expect(e.message)
          .to.contain('only accepts integers or px values (e.g. 6 or 6px)'),
      )

      // invalid values are rendered unchanged
      chai.expect(getTableAttrs(html)).to.include({
        cellpadding: value,
        cellspacing: value,
      })
    })
  })
  ;['cellpadding', 'cellspacing'].forEach((attr) => {
    it(`should throw in strict mode with an invalid ${attr}`, async function () {
      try {
        await mjml(buildInput(`${attr}="10%"`), {
          validationLevel: 'strict',
        })
      } catch (err) {
        chai.expect(err.errors).to.have.length(1)
        chai.expect(err.errors[0].message).to.contain(`Attribute ${attr}`)
        return
      }

      throw new Error('Expected a ValidationError to be thrown')
    })
  })
})
