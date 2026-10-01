const chai = require('chai')
const mjml = require('../lib')

describe('validator - src--dark support-dark-mode', function () {
  // NOTE: The validator rule is designed to support multiple dark-mode attributes
  // Currently checking for: src--dark, color--dark, background-color--dark,
  // container-background-color--dark, border-color--dark, thumbnails-src--dark
  // New attributes can be added to DARK_MODE_ATTRIBUTES in
  // mjml-validator/src/rules/requireSupportDarkModeForDarkSrc.js
  //
  // When multiple attributes are present on the same element,
  // the error message will format them with proper grammar:
  // - 1 attribute: "Attribute src--dark requires..."
  // - 2 attributes: "Attribute(s) src--dark and color--dark require..."
  // - 3+ attributes: "Attribute(s) src--dark, color--dark and background-color--dark require..."

  it('warns when mj-image uses src--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image src="https://example.com/light.png" src--dark="https://example.com/dark.png" width="100px" />
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute src--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using src--dark on mj-image',
      )
      .to.equal(true)
  })

  it('warns when mj-image uses border-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image src="https://example.com/light.png" border-color--dark="#ffffff" width="100px" />
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute border-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using border-color--dark on mj-image',
      )
      .to.equal(true)
  })

  it('warns when mj-social-element uses src--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-social>
                <mj-social-element
                  name="facebook"
                  href="https://example.com"
                  src--dark="https://example.com/dark-social.png"
                  support-dark-mode-image="outlook"
                >
                  Facebook
                </mj-social-element>
              </mj-social>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute src--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using src--dark on mj-social-element',
      )
      .to.equal(true)
  })

  it('warns when mj-carousel-image uses thumbnails-src--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-carousel>
                <mj-carousel-image
                  src="https://example.com/light.png"
                  thumbnails-src="https://example.com/light-thumb.png"
                  thumbnails-src--dark="https://example.com/dark-thumb.png"
                />
              </mj-carousel>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute thumbnails-src--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using thumbnails-src--dark on mj-carousel-image',
      )
      .to.equal(true)
  })

  it('warns when mj-carousel uses container-background-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-carousel container-background-color--dark="#111111">
                <mj-carousel-image src="https://example.com/light.png" />
              </mj-carousel>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute container-background-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using container-background-color--dark on mj-carousel',
      )
      .to.equal(true)
  })

  it('warns when mj-carousel uses tb-border-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-carousel tb-border-color--dark="#aaaaaa">
                <mj-carousel-image src="https://example.com/light.png" />
              </mj-carousel>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute tb-border-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using tb-border-color--dark on mj-carousel',
      )
      .to.equal(true)
  })

  it('warns when mj-carousel uses tb-hover-border-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-carousel tb-hover-border-color--dark="#00ff00">
                <mj-carousel-image src="https://example.com/light.png" />
              </mj-carousel>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute tb-hover-border-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using tb-hover-border-color--dark on mj-carousel',
      )
      .to.equal(true)
  })

  it('warns when mj-carousel uses tb-selected-border-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-carousel tb-selected-border-color--dark="#ff00ff">
                <mj-carousel-image src="https://example.com/light.png" />
              </mj-carousel>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute tb-selected-border-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using tb-selected-border-color--dark on mj-carousel',
      )
      .to.equal(true)
  })

  it('warns when mj-carousel-image uses tb-border-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-carousel>
                <mj-carousel-image
                  src="https://example.com/light.png"
                  tb-border-color--dark="#aaaaaa"
                />
              </mj-carousel>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute tb-border-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using tb-border-color--dark on mj-carousel-image',
      )
      .to.equal(true)
  })

  it('warns when mj-navbar uses ico-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-navbar ico-color--dark="#00ff00">
                <mj-navbar-link href="https://example.com">Test</mj-navbar-link>
              </mj-navbar>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute ico-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using ico-color--dark on mj-navbar',
      )
      .to.equal(true)
  })

  it('warns when mj-divider uses border-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-divider border-color="#000000" border-color--dark="#ffffff" />
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute border-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using border-color--dark on mj-divider',
      )
      .to.equal(true)
  })

  it('warns when mj-accordion uses border-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-accordion border-color--dark="#ffffff">
                <mj-accordion-element>
                  <mj-accordion-title>Title</mj-accordion-title>
                  <mj-accordion-text>Text</mj-accordion-text>
                </mj-accordion-element>
              </mj-accordion>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute border-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using border-color--dark on mj-accordion',
      )
      .to.equal(true)
  })

  it('warns when mj-accordion uses container-background-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-accordion container-background-color--dark="#111111">
                <mj-accordion-element>
                  <mj-accordion-title>Title</mj-accordion-title>
                  <mj-accordion-text>Text</mj-accordion-text>
                </mj-accordion-element>
              </mj-accordion>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute container-background-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using container-background-color--dark on mj-accordion',
      )
      .to.equal(true)
  })

  it('warns when mj-accordion-element uses background-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-accordion>
                <mj-accordion-element background-color--dark="#111111">
                  <mj-accordion-title>Title</mj-accordion-title>
                  <mj-accordion-text>Text</mj-accordion-text>
                </mj-accordion-element>
              </mj-accordion>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute background-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using background-color--dark on mj-accordion-element',
      )
      .to.equal(true)
  })

  it('warns when mj-accordion-element uses border-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-accordion>
                <mj-accordion-element border="1px solid #333333" border-color--dark="#ffffff">
                  <mj-accordion-title>Title</mj-accordion-title>
                  <mj-accordion-text>Text</mj-accordion-text>
                </mj-accordion-element>
              </mj-accordion>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute border-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using border-color--dark on mj-accordion-element',
      )
      .to.equal(true)
  })

  it('warns when mj-accordion-title uses color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-accordion>
                <mj-accordion-element>
                  <mj-accordion-title color--dark="#ffffff">Title</mj-accordion-title>
                  <mj-accordion-text>Text</mj-accordion-text>
                </mj-accordion-element>
              </mj-accordion>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using color--dark on mj-accordion-title',
      )
      .to.equal(true)
  })

  it('warns when mj-accordion-text uses background-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-accordion>
                <mj-accordion-element>
                  <mj-accordion-title>Title</mj-accordion-title>
                  <mj-accordion-text background-color--dark="#111111">Text</mj-accordion-text>
                </mj-accordion-element>
              </mj-accordion>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute background-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using background-color--dark on mj-accordion-text',
      )
      .to.equal(true)
  })

  it('warns when mj-column uses background-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column background-color--dark="#111111">
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute background-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using background-color--dark on mj-column',
      )
      .to.equal(true)
  })

  it('warns when mj-column uses border-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column border="2px solid #333333" border-color--dark="#ffffff">
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute border-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using border-color--dark on mj-column',
      )
      .to.equal(true)
  })

  it('warns when mj-button uses background-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-button background-color--dark="#111111">Test</mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute background-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using background-color--dark on mj-button',
      )
      .to.equal(true)
  })

  it('warns when mj-button uses border-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-button border="2px solid #333333" border-color--dark="#ffffff">Test</mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute border-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using border-color--dark on mj-button',
      )
      .to.equal(true)
  })

  it('warns when mj-table uses border-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-table border="1px solid #000000" border-color--dark="#ffffff">
                <tr><td>Cell</td></tr>
              </mj-table>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute border-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using border-color--dark on mj-table',
      )
      .to.equal(true)
  })

  it('warns when mj-section uses border-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section border="1px solid #000000" border-color--dark="#ffffff">
            <mj-column>
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute border-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using border-color--dark on mj-section',
      )
      .to.equal(true)
  })

  it('warns when mj-section uses border-top-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section border-top="1px solid #000000" border-top-color--dark="#ffffff">
            <mj-column>
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute border-top-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using border-top-color--dark on mj-section',
      )
      .to.equal(true)
  })

  it('warns when mj-section uses background-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section background-color="#cccccc" background-color--dark="#111111">
            <mj-column>
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute background-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using background-color--dark on mj-section',
      )
      .to.equal(true)
  })

  it('warns when mj-section uses background-url--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section
            background-url="https://example.com/section-light.jpg"
            background-url--dark="https://example.com/section-dark.jpg"
          >
            <mj-column>
              <mj-text>Test</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute background-url--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using background-url--dark on mj-section',
      )
      .to.equal(true)
  })

  it('warns when mj-hero uses background-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-hero
            mode="fixed-height"
            height="200px"
            background-width="600px"
            background-height="300px"
            background-color="#cccccc"
            background-color--dark="#111111"
          >
            <mj-text>Test</mj-text>
          </mj-hero>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute background-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using background-color--dark on mj-hero',
      )
      .to.equal(true)
  })

  it('warns when mj-hero uses background-url--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-hero
            mode="fixed-height"
            height="200px"
            background-width="600px"
            background-height="300px"
            background-url="https://example.com/hero-light.jpg"
            background-url--dark="https://example.com/hero-dark.jpg"
          >
            <mj-text>Test</mj-text>
          </mj-hero>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute background-url--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using background-url--dark on mj-hero',
      )
      .to.equal(true)
  })

  it('warns when mj-hero uses inner-background-color--dark and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-hero
            mode="fixed-height"
            height="200px"
            background-width="600px"
            background-height="300px"
            inner-background-color="#cccccc"
            inner-background-color--dark="#111111"
          >
            <mj-text>Test</mj-text>
          </mj-hero>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute inner-background-color--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using inner-background-color--dark on mj-hero',
      )
      .to.equal(true)
  })

  it('combines two dark attributes on the same element into a single pluralized warning', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-button border-color--dark="#ffffff" color--dark="#00ff00">Test</mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')

    const matchingErrors = errors.filter((e) =>
      (e.message || '').includes(
        'Attributes border-color--dark and color--dark require support-dark-mode="true" on the root <mjml> element',
      ),
    )

    chai.expect(matchingErrors.length).to.equal(1)
  })

  it('uses Oxford comma formatting for three dark attributes on one element', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-button
                background-color--dark="#111111"
                border-color--dark="#ffffff"
                color--dark="#00ff00"
              >
                Test
              </mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')

    const matchingErrors = errors.filter((e) =>
      (e.message || '').includes(
        'Attributes background-color--dark, border-color--dark and color--dark require support-dark-mode="true" on the root <mjml> element',
      ),
    )

    chai.expect(matchingErrors.length).to.equal(1)
  })

  it('returns one warning per element when multiple elements use dark attributes', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image
                src="https://example.com/light.png"
                src--dark="https://example.com/dark.png"
                width="100px"
              />
              <mj-button background-color--dark="#111111">Test</mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')

    const imageWarningCount = errors.filter((e) =>
      (e.message || '').includes(
        'Attribute src--dark requires support-dark-mode="true" on the root <mjml> element',
      ),
    ).length

    const buttonWarningCount = errors.filter((e) =>
      (e.message || '').includes(
        'Attribute background-color--dark requires support-dark-mode="true" on the root <mjml> element',
      ),
    ).length

    chai.expect(imageWarningCount).to.equal(1)
    chai.expect(buttonWarningCount).to.equal(1)
  })

  it('does not warn when root support-dark-mode is true', async function () {
    const input = `
      <mjml support-dark-mode="true">
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image src="https://example.com/light.png" src--dark="https://example.com/dark.png" width="100px" />
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')
    chai
      .expect(
        errors.some((e) =>
          (e.message || '').includes(
            'Attribute src--dark requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'does not include warning when root support-dark-mode is true',
      )
      .to.equal(false)
  })
})
