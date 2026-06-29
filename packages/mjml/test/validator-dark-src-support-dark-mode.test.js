const chai = require('chai')
const mjml = require('../lib')

describe('validator - dark-src support-dark-mode', function () {
  // NOTE: The validator rule is designed to support multiple dark-mode attributes
  // Currently checking for: dark-src, dark-color, dark-background-color,
  // dark-container-background-color, dark-border-color, dark-thumbnails-src
  // New attributes can be added to DARK_MODE_ATTRIBUTES in
  // mjml-validator/src/rules/requireSupportDarkModeForDarkSrc.js
  //
  // When multiple attributes are present on the same element,
  // the error message will format them with proper grammar:
  // - 1 attribute: "Attribute dark-src requires..."
  // - 2 attributes: "Attribute(s) dark-src and dark-color require..."
  // - 3+ attributes: "Attribute(s) dark-src, dark-color and dark-background-color require..."

  it('warns when mj-image uses dark-src and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image src="https://example.com/light.png" dark-src="https://example.com/dark.png" width="100px" />
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
            'Attribute dark-src requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-src on mj-image',
      )
      .to.equal(true)
  })

  it('warns when mj-image uses dark-border-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-image src="https://example.com/light.png" dark-border-color="#ffffff" width="100px" />
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
            'Attribute dark-border-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-border-color on mj-image',
      )
      .to.equal(true)
  })

  it('warns when mj-social-element uses dark-src and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-social>
                <mj-social-element
                  name="facebook"
                  href="https://example.com"
                  dark-src="https://example.com/dark-social.png"
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
            'Attribute dark-src requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-src on mj-social-element',
      )
      .to.equal(true)
  })

  it('warns when mj-carousel-image uses dark-thumbnails-src and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-carousel>
                <mj-carousel-image
                  src="https://example.com/light.png"
                  thumbnails-src="https://example.com/light-thumb.png"
                  dark-thumbnails-src="https://example.com/dark-thumb.png"
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
            'Attribute dark-thumbnails-src requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-thumbnails-src on mj-carousel-image',
      )
      .to.equal(true)
  })

  it('warns when mj-carousel uses dark-container-background-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-carousel dark-container-background-color="#111111">
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
            'Attribute dark-container-background-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-container-background-color on mj-carousel',
      )
      .to.equal(true)
  })

  it('warns when mj-carousel uses dark-tb-border-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-carousel dark-tb-border-color="#aaaaaa">
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
            'Attribute dark-tb-border-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-tb-border-color on mj-carousel',
      )
      .to.equal(true)
  })

  it('warns when mj-carousel uses dark-tb-hover-border-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-carousel dark-tb-hover-border-color="#00ff00">
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
            'Attribute dark-tb-hover-border-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-tb-hover-border-color on mj-carousel',
      )
      .to.equal(true)
  })

  it('warns when mj-carousel uses dark-tb-selected-border-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-carousel dark-tb-selected-border-color="#ff00ff">
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
            'Attribute dark-tb-selected-border-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-tb-selected-border-color on mj-carousel',
      )
      .to.equal(true)
  })

  it('warns when mj-carousel-image uses dark-tb-border-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-carousel>
                <mj-carousel-image
                  src="https://example.com/light.png"
                  dark-tb-border-color="#aaaaaa"
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
            'Attribute dark-tb-border-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-tb-border-color on mj-carousel-image',
      )
      .to.equal(true)
  })

  it('warns when mj-navbar uses dark-ico-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-navbar dark-ico-color="#00ff00">
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
            'Attribute dark-ico-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-ico-color on mj-navbar',
      )
      .to.equal(true)
  })

  it('warns when mj-divider uses dark-border-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-divider border-color="#000000" dark-border-color="#ffffff" />
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
            'Attribute dark-border-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-border-color on mj-divider',
      )
      .to.equal(true)
  })

  it('warns when mj-accordion uses dark-border-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-accordion dark-border-color="#ffffff">
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
            'Attribute dark-border-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-border-color on mj-accordion',
      )
      .to.equal(true)
  })

  it('warns when mj-accordion uses dark-container-background-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-accordion dark-container-background-color="#111111">
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
            'Attribute dark-container-background-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-container-background-color on mj-accordion',
      )
      .to.equal(true)
  })

  it('warns when mj-accordion-element uses dark-background-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-accordion>
                <mj-accordion-element dark-background-color="#111111">
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
            'Attribute dark-background-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-background-color on mj-accordion-element',
      )
      .to.equal(true)
  })

  it('warns when mj-accordion-element uses dark-border-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-accordion>
                <mj-accordion-element border="1px solid #333333" dark-border-color="#ffffff">
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
            'Attribute dark-border-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-border-color on mj-accordion-element',
      )
      .to.equal(true)
  })

  it('warns when mj-accordion-title uses dark-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-accordion>
                <mj-accordion-element>
                  <mj-accordion-title dark-color="#ffffff">Title</mj-accordion-title>
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
            'Attribute dark-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-color on mj-accordion-title',
      )
      .to.equal(true)
  })

  it('warns when mj-accordion-text uses dark-background-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-accordion>
                <mj-accordion-element>
                  <mj-accordion-title>Title</mj-accordion-title>
                  <mj-accordion-text dark-background-color="#111111">Text</mj-accordion-text>
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
            'Attribute dark-background-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-background-color on mj-accordion-text',
      )
      .to.equal(true)
  })

  it('warns when mj-column uses dark-background-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column dark-background-color="#111111">
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
            'Attribute dark-background-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-background-color on mj-column',
      )
      .to.equal(true)
  })

  it('warns when mj-column uses dark-border-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column border="2px solid #333333" dark-border-color="#ffffff">
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
            'Attribute dark-border-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-border-color on mj-column',
      )
      .to.equal(true)
  })

  it('warns when mj-button uses dark-background-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-button dark-background-color="#111111">Test</mj-button>
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
            'Attribute dark-background-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-background-color on mj-button',
      )
      .to.equal(true)
  })

  it('warns when mj-button uses dark-border-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-button border="2px solid #333333" dark-border-color="#ffffff">Test</mj-button>
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
            'Attribute dark-border-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-border-color on mj-button',
      )
      .to.equal(true)
  })

  it('warns when mj-table uses dark-border-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-table border="1px solid #000000" dark-border-color="#ffffff">
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
            'Attribute dark-border-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-border-color on mj-table',
      )
      .to.equal(true)
  })

  it('warns when mj-section uses dark-border-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section border="1px solid #000000" dark-border-color="#ffffff">
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
            'Attribute dark-border-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-border-color on mj-section',
      )
      .to.equal(true)
  })

  it('warns when mj-section uses dark-border-top-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section border-top="1px solid #000000" dark-border-top-color="#ffffff">
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
            'Attribute dark-border-top-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-border-top-color on mj-section',
      )
      .to.equal(true)
  })

  it('warns when mj-section uses dark-background-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section background-color="#cccccc" dark-background-color="#111111">
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
            'Attribute dark-background-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-background-color on mj-section',
      )
      .to.equal(true)
  })

  it('warns when mj-section uses dark-background-url and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section
            background-url="https://example.com/section-light.jpg"
            dark-background-url="https://example.com/section-dark.jpg"
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
            'Attribute dark-background-url requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-background-url on mj-section',
      )
      .to.equal(true)
  })

  it('warns when mj-hero uses dark-background-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-hero
            mode="fixed-height"
            height="200px"
            background-width="600px"
            background-height="300px"
            background-color="#cccccc"
            dark-background-color="#111111"
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
            'Attribute dark-background-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-background-color on mj-hero',
      )
      .to.equal(true)
  })

  it('warns when mj-hero uses dark-background-url and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-hero
            mode="fixed-height"
            height="200px"
            background-width="600px"
            background-height="300px"
            background-url="https://example.com/hero-light.jpg"
            dark-background-url="https://example.com/hero-dark.jpg"
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
            'Attribute dark-background-url requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-background-url on mj-hero',
      )
      .to.equal(true)
  })

  it('warns when mj-hero uses dark-inner-background-color and root support-dark-mode is missing', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-hero
            mode="fixed-height"
            height="200px"
            background-width="600px"
            background-height="300px"
            inner-background-color="#cccccc"
            dark-inner-background-color="#111111"
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
            'Attribute dark-inner-background-color requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'includes warning for missing root support-dark-mode when using dark-inner-background-color on mj-hero',
      )
      .to.equal(true)
  })

  it('combines two dark attributes on the same element into a single pluralized warning', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-button dark-border-color="#ffffff" dark-color="#00ff00">Test</mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')

    const matchingErrors = errors.filter((e) =>
      (e.message || '').includes(
        'Attributes dark-border-color and dark-color require support-dark-mode="true" on the root <mjml> element',
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
                dark-background-color="#111111"
                dark-border-color="#ffffff"
                dark-color="#00ff00"
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
        'Attributes dark-background-color, dark-border-color and dark-color require support-dark-mode="true" on the root <mjml> element',
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
                dark-src="https://example.com/dark.png"
                width="100px"
              />
              <mj-button dark-background-color="#111111">Test</mj-button>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `

    const { errors } = await mjml(input)

    chai.expect(errors, 'errors should be returned').to.be.an('array')

    const imageWarningCount = errors.filter((e) =>
      (e.message || '').includes(
        'Attribute dark-src requires support-dark-mode="true" on the root <mjml> element',
      ),
    ).length

    const buttonWarningCount = errors.filter((e) =>
      (e.message || '').includes(
        'Attribute dark-background-color requires support-dark-mode="true" on the root <mjml> element',
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
              <mj-image src="https://example.com/light.png" dark-src="https://example.com/dark.png" width="100px" />
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
            'Attribute dark-src requires support-dark-mode="true" on the root <mjml> element',
          ),
        ),
        'does not include warning when root support-dark-mode is true',
      )
      .to.equal(false)
  })
})
