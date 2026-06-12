const chai = require('chai')
const mjml = require('../lib')

function getVmlButtonStyleBlocks(html) {
  const styleContents = [
    ...html.matchAll(/<style>([\s\S]*?)<\/style>/g),
  ].map((match) => match[1])

  return styleContents.filter((block) => block.includes('.vml .vml-button-'))
}

describe('mj-section + mj-button outlook margin integration', function () {
  it('should emit gutter mso margin + matching vml-button rule when section has background-url', async function () {
    // Positive-path assertions force Outlook-classic on to avoid cross-test state effects.
    const input = `
      <mjml support-outlook-classic="true">
        <mj-body>
          <mj-section background-url="https://example.com/bg.png">
            <mj-column background-color="black" padding="20px">
              <mj-button padding="10px 25px">A</mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml(input)

    const classMatch = html.match(/<tr class="(vml-button-[a-f0-9]{6})">/)

    chai.expect(classMatch).to.not.equal(null)

    const buttonClassName = classMatch[1]

    chai.expect(html).to.match(
      /<td[^>]*style="[^"]*background-color:black;[^"]*padding:20px;[^"]*mso-para-margin-left:20px;[^"]*"/,
    )

    chai
      .expect(html)
      .to.include(`.vml .${buttonClassName} td { mso-para-margin-left:25px; }`)

    chai
      .expect(html)
      .to.include(`.vml .${buttonClassName} td td { mso-para-margin-left:0; }`)
  })

  it('should not emit vml-button classes or mso margin styles without section background-url', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column background-color="black" padding="20px">
              <mj-button padding="10px 25px">A</mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml(input)

    chai.expect(html).to.not.match(/<tr class="vml-button-[a-f0-9]{6}">/)
    chai.expect(html).to.not.include('mso-para-margin-left')
  })

  it('should not emit vml-button classes or mso margin styles when support-outlook-classic is false', async function () {
    const input = `
      <mjml support-outlook-classic="false">
        <mj-body>
          <mj-section background-url="https://example.com/bg.png">
            <mj-column background-color="black" padding="20px">
              <mj-button padding="10px 25px">A</mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml(input)

    chai.expect(html).to.not.match(/<tr class="vml-button-[a-f0-9]{6}">/)
    chai.expect(html).to.not.include('mso-para-margin-left')
  })

  it('should consolidate multiple vml-button rules into a single mso style block', async function () {
    // Positive-path assertions force Outlook-classic on to avoid cross-test state effects.
    const input = `
      <mjml support-outlook-classic="true">
        <mj-body>
          <mj-section background-url="https://example.com/bg.png">
            <mj-column background-color="black" padding="20px">
              <mj-button padding="10px 25px">A</mj-button>
              <mj-button padding="10px 30px">B</mj-button>
              <mj-button padding="10px 40px">C</mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { html } = await mjml(input)

    const classMatches = [
      ...html.matchAll(/<tr class="(vml-button-[a-f0-9]{6})">/g),
    ]

    const uniqueClasses = [...new Set(classMatches.map((match) => match[1]))]

    chai.expect(uniqueClasses).to.have.length(3)

    const vmlButtonStyleBlocks = getVmlButtonStyleBlocks(html)

    chai.expect(vmlButtonStyleBlocks).to.have.length(1)

    const vmlButtonStyleBlock = vmlButtonStyleBlocks[0]

    const primaryRules =
      vmlButtonStyleBlock.match(/\.vml \.vml-button-[a-f0-9]{6} td \{ mso-para-margin-left:\d+px; \}/g) || []

    chai.expect(primaryRules).to.have.length(3)
    chai.expect(vmlButtonStyleBlock).to.include('mso-para-margin-left:25px;')
    chai.expect(vmlButtonStyleBlock).to.include('mso-para-margin-left:30px;')
    chai.expect(vmlButtonStyleBlock).to.include('mso-para-margin-left:40px;')

    uniqueClasses.forEach((className) => {
      chai
        .expect(vmlButtonStyleBlock)
        .to.include(`.vml .${className} td td { mso-para-margin-left:0; }`)
    })
  })
})
