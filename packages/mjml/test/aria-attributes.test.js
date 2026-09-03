const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

describe('ARIA attributes pass-through', function () {
  describe('mj-section', function () {
    it('should pass through aria-label, aria-roledescription, and role attributes', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section aria-label="Main content" aria-roledescription="section" role="region">
      <mj-column>
        <mj-text>Content</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      // Find the section container div
      const sectionDiv = $('[role="region"]')
      chai.expect(sectionDiv.attr('aria-label')).to.equal('Main content')
      chai.expect(sectionDiv.attr('aria-roledescription')).to.equal('section')
      chai.expect(sectionDiv.attr('role')).to.equal('region')
    })

    it('should pass through aria attributes with beautify enabled', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section aria-label="Test section" role="main">
      <mj-column>
        <mj-text>Content</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input, { beautify: true })
      const $ = load(html)

      const sectionDiv = $('[role="main"]')
      chai.expect(sectionDiv.attr('aria-label')).to.equal('Test section')
      chai.expect(sectionDiv.attr('role')).to.equal('main')
    })
  })

  describe('mj-column', function () {
    it('should pass through aria-label, aria-roledescription, and role attributes', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column aria-label="Left column" aria-roledescription="column" role="region">
        <mj-text>Content</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const columnTable = $('table[role="region"][aria-label="Left column"]')
      chai.expect(columnTable.attr('aria-label')).to.equal('Left column')
      chai.expect(columnTable.attr('aria-roledescription')).to.equal('column')
      chai.expect(columnTable.attr('role')).to.equal('region')
    })

    it('should pass through aria attributes on multiple columns', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column aria-label="Column 1" role="region">
        <mj-text>Col 1</mj-text>
      </mj-column>
      <mj-column aria-label="Column 2" role="region">
        <mj-text>Col 2</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const columnTables = $('table[role="region"][aria-label]')
      chai.expect(columnTables.length).to.equal(2)
      chai.expect(columnTables.eq(0).attr('aria-label')).to.equal('Column 1')
      chai.expect(columnTables.eq(1).attr('aria-label')).to.equal('Column 2')
    })
  })

  describe('mj-hero', function () {
    it('should pass through aria-label, aria-roledescription, and role attributes', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-hero height="400px" aria-label="Hero banner" aria-roledescription="hero" role="img">
      <mj-text>Hero content</mj-text>
    </mj-hero>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      // Hero attributes should be on the outer div
      const heroDiv = $('[role="img"]')
      chai.expect(heroDiv.attr('aria-label')).to.equal('Hero banner')
      chai.expect(heroDiv.attr('aria-roledescription')).to.equal('hero')
      chai.expect(heroDiv.attr('role')).to.equal('img')
    })
  })

  describe('mj-group', function () {
    it('should pass through aria-label, aria-roledescription, and role attributes', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-group aria-label="Content group" aria-roledescription="group" role="group">
        <mj-column>
          <mj-text>Col 1</mj-text>
        </mj-column>
        <mj-column>
          <mj-text>Col 2</mj-text>
        </mj-column>
      </mj-group>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const groupDiv = $('[role="group"]')
      chai.expect(groupDiv.length).to.be.greaterThan(0)
      chai.expect(groupDiv.first().attr('aria-label')).to.equal('Content group')
    })
  })

  describe('mj-table', function () {
    it('should pass through aria-label, aria-roledescription, and role attributes', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-table aria-label="Data table" aria-roledescription="table" role="table">
          <tr>
            <td>Cell 1</td>
          </tr>
        </mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const tableElement = $('table[role="table"]')
      chai.expect(tableElement.attr('aria-label')).to.equal('Data table')
      chai.expect(tableElement.attr('aria-roledescription')).to.equal('table')
      chai.expect(tableElement.attr('role')).to.equal('table')
    })
  })

  describe('mj-navbar', function () {
    it('should pass through aria-label, aria-roledescription, and role attributes', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-navbar aria-label="Navigation bar" aria-roledescription="navigation" role="navigation">
      <mj-navbar-link href="https://example.com">Home</mj-navbar-link>
    </mj-navbar>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      // Navbar attributes should be on the nav container
      const navElement = $('[role="navigation"]')
      chai.expect(navElement.length).to.be.greaterThan(0)
      chai.expect(navElement.first().attr('aria-label')).to.equal('Navigation bar')
    })
  })

  describe('mj-carousel-image', function () {
    it('should pass through aria-label, aria-roledescription, and role attributes', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel>
          <mj-carousel-image src="https://example.com/image.jpg" aria-label="Slide 1" aria-roledescription="slide" role="tabpanel" />
          <mj-carousel-image src="https://example.com/image2.jpg" aria-label="Slide 2" />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const firstImageDiv = $('[role="tabpanel"]')
      chai.expect(firstImageDiv.attr('aria-label')).to.equal('Slide 1')
      chai.expect(firstImageDiv.attr('aria-roledescription')).to.equal('slide')
      chai.expect(firstImageDiv.attr('role')).to.equal('tabpanel')
    })

    it('should use default aria attributes when not explicitly set', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel>
          <mj-carousel-image src="https://example.com/image.jpg" />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      // Default aria-label includes "of X", default aria-roledescription is "slide", default role is "group"
      const imageDiv = $('.mj-carousel-image')
      chai.expect(imageDiv.attr('role')).to.equal('group')
      chai.expect(imageDiv.attr('aria-roledescription')).to.equal('slide')
      chai.expect(imageDiv.attr('aria-label')).to.include('of')
    })

    it('should default the first slide\'s dynamic aria-label to start with "1 of"', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel>
          <mj-carousel-image src="https://example.com/image.jpg" />
          <mj-carousel-image src="https://example.com/image2.jpg" />
          <mj-carousel-image src="https://example.com/image3.jpg" />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const firstImageDiv = $('.mj-carousel-image').eq(0)
      chai.expect(firstImageDiv.attr('aria-label')).to.equal('1 of 3')
    })

    it('should omit aria-label on the Outlook fallback image when it is the dynamic default', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel>
          <mj-carousel-image src="https://example.com/image.jpg" />
          <mj-carousel-image src="https://example.com/image2.jpg" />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const fallbackBlocks = [...html.matchAll(/<!--\[if mso\]>([\s\S]*?)<!\[endif\]-->/g)]
      const fallbackBlock = fallbackBlocks.map((m) => m[1]).find((block) => block.includes('<img'))
      chai.expect(fallbackBlock).to.not.equal(undefined)
      chai.expect(fallbackBlock).to.not.include('aria-label')
    })

    it('should keep an explicit aria-label on the Outlook fallback image', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel>
          <mj-carousel-image src="https://example.com/image.jpg" aria-label="Custom label" />
          <mj-carousel-image src="https://example.com/image2.jpg" />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const fallbackBlocks = [...html.matchAll(/<!--\[if mso\]>([\s\S]*?)<!\[endif\]-->/g)]
      const fallbackBlock = fallbackBlocks.map((m) => m[1]).find((block) => block.includes('<img'))
      chai.expect(fallbackBlock).to.not.equal(undefined)
      chai.expect(fallbackBlock).to.include('aria-label="Custom label"')
    })
  })

  describe('mj-divider', function () {

    it('should omit aria-hidden when explicitly set to false', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-divider aria-hidden="false" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      // Find divider's table element - aria-hidden should be omitted when false
      const dividerTable = $('table[aria-hidden]')
      chai.expect(dividerTable.length).to.equal(0)
    })
  })

  describe('mj-spacer', function () {
    it('should default aria-hidden to true', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-spacer height="20px" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)

      chai.expect(html).to.include('aria-hidden="true"')
    })

    it('should omit aria-hidden when explicitly set to false', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-spacer height="20px" aria-hidden="false" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      // aria-hidden should be omitted entirely when set to false
      const spacerDiv = $('div[aria-hidden]')
      chai.expect(spacerDiv.length).to.equal(0)
    })
  })

  describe('mj-image', function () {
    it('should pass through aria-hidden attribute', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image src="https://example.com/image.jpg" aria-hidden="true" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const img = $('img[src="https://example.com/image.jpg"]')
      chai.expect(img.attr('aria-hidden')).to.equal('true')
    })

    it('should omit aria-hidden for images set to false', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image src="https://example.com/image.jpg" aria-hidden="false" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const img = $('img[src="https://example.com/image.jpg"]')
      chai.expect(img.attr('aria-hidden')).to.equal(undefined)
    })
  })

  describe('Special characters in ARIA attributes', function () {
    it('should preserve special characters in aria-label', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section aria-label="Section with &quot;quotes&quot; and &lt;special&gt; chars">
      <mj-column>
        <mj-text>Content</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const sectionDiv = $('[aria-label*="quotes"]')
      chai.expect(sectionDiv.length).to.be.greaterThan(0)
    })

    it('should handle aria-label with ampersands', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section aria-label="Section 1 &amp; Section 2">
      <mj-column>
        <mj-text>Content</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const sectionDiv = $('[aria-label*="&"]')
      chai.expect(sectionDiv.length).to.be.greaterThan(0)
    })
  })

  describe('ARIA attributes with other attributes', function () {
    it('should preserve ARIA attributes alongside styling attributes', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section aria-label="Styled section" role="region" background-color="#f0f0f0" padding="20px">
      <mj-column>
        <mj-text>Content</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const sectionTable = $('table[role="region"][aria-label="Styled section"]')
      chai.expect(sectionTable.attr('aria-label')).to.equal('Styled section')
      chai.expect(sectionTable.attr('style')).to.include('background')
    })

    it('should preserve ARIA attributes with dark-mode attributes', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section aria-label="Dark section" role="region" background-color="#ffffff" dark-background-color="#1a1a1a">
      <mj-column>
        <mj-text>Content</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const sectionDiv = $('[role="region"]')
      chai.expect(sectionDiv.attr('aria-label')).to.equal('Dark section')
    })
  })

  describe('Empty ARIA attribute values', function () {
    it('should handle empty aria-label', async function () {
      const input = `
<mjml>
  <mj-body>
    <mj-section aria-label="" role="region">
      <mj-column>
        <mj-text>Content</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`
      const { html } = await mjml(input)
      const $ = load(html)

      const sectionDiv = $('[role="region"]')
      chai.expect(sectionDiv.attr('aria-label')).to.equal('')
    })
  })
})
