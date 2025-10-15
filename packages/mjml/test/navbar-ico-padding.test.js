const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

describe('mj-navbar ico-padding-X', function () {
  it('should render correct padding in CSS style values on navbar hamburger icon', function () {
    const input = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-navbar hamburger="hamburger" ico-padding="20px" ico-padding-bottom="20px" ico-padding-left="30px" ico-padding-right="40px"  ico-padding-top="50px" >
                <mj-navbar-link href="/gettings-started-onboard" color="#ffffff">Getting started</mj-navbar-link>
                <mj-navbar-link href="/try-it-live" color="#ffffff">Try it live</mj-navbar-link>
            </mj-navbar>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
    `

    const { html } = mjml(input)
    const $ = load(html)

    function extractPadding(style, prop) {
      const start = style.indexOf(`${prop}:`) + prop.length + 1
      const end = style.indexOf(';', start)
      return style.substring(start, end).trim()
    }

    const paddings = [
      'padding-bottom',
      'padding-left',
      'padding-right',
      'padding-top',
    ]

    const results = paddings.map((padding) =>
      $('.mj-menu-label')
        .map(function () {
          const style = $(this).attr('style')
          return extractPadding(style, padding)
        })
        .get(),
    )

    // Padding should be ['20px', '30px', '40px', '50px']
    const expected = {
      'padding-bottom': ['20px'],
      'padding-left': ['30px'],
      'padding-right': ['40px'],
      'padding-top': ['50px'],
    }

    paddings.forEach((padding, idx) => {
      chai
        .expect(results[idx], `${padding} in CSS style values on navbar icon`)
        .to.eql(expected[padding])
    })
  })
})
