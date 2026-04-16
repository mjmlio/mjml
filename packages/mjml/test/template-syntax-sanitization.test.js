const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

/**
 * Template syntax sanitization tests
 * - CSS value variables inside style attributes and <style> blocks
 * - CSS property-name variables
 * - Block variables inside style contexts
 * - Mixed syntax detection (default disallows) and allowMixedSyntax
 * - Multiline tokens
 * - Broken delimiters pre-check error
 */

describe('Template syntax sanitization', function () {
  this.timeout(10000)

  const syntaxes = [
    { prefix: '{{', suffix: '}}' },
    { prefix: '[[', suffix: ']]' },
    { prefix: '{%', suffix: '%}' },
  ]

  it('preserves CSS value variables in style attribute', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-raw>
                <div style="color: {{primaryColor}}; font-weight: [[ fontWeight ]];">Token</div>
              </mj-raw>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml(input, {
      sanitizeStyles: true,
      minify: true,
      templateSyntax: syntaxes,
    })
    const $ = load(html)
    const doc = $.html()
    chai.expect(doc).to.include('color:{{primaryColor}};')
    chai.expect(doc).to.include('font-weight:[[ fontWeight ]]')
  })

  it('preserves CSS value variables inside <style> block', async function () {
    const input = `
      <mjml>
        <mj-head>
          <mj-style>
            .title { color: {{headlineColor}}; }
          </mj-style>
        </mj-head>
        <mj-body>
          <mj-section><mj-column><mj-text>Token</mj-text></mj-column></mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml(input, {
      sanitizeStyles: true,
      minify: true,
      templateSyntax: syntaxes,
    })
    const $ = load(html)
    const styleText = $('style')
      .map(function () { return $(this).text() })
      .get()
      .find((t) => t.includes('.title')) || ''
    chai.expect(styleText).to.include('.title')
    chai.expect(styleText).to.include('color:{{headlineColor}}')
  })

  it('preserves CSS property-name variables', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-raw>
                <div style="[[ fontTag ]]: [[ fontWeight ]];">Token</div>
              </mj-raw>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml(input, {
      sanitizeStyles: true,
      minify: true,
      templateSyntax: syntaxes,
    })
    const $ = load(html)
    const allStyles = $('[style]')
      .map(function () { return $(this).attr('style') || '' })
      .get()
      .join(' ')
    chai.expect(allStyles).to.include('[[ fontTag ]]:')
    chai.expect(allStyles).to.include('[[ fontWeight ]]')
  })

  it('disallows mixed syntax by default (block + CSS)', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-raw>
                <div style="{% block %}; color: {{primaryColor}};">Token</div>
              </mj-raw>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    let thrown = null
    try {
      await mjml(input, {
        sanitizeStyles: true,
        minify: true,
        templateSyntax: syntaxes,
      })
    } catch (e) {
      thrown = e
    }
    chai.expect(thrown).to.be.an('error')
    chai.expect(thrown.message).to.include('Mixed variable syntax detected')
  })

  it('allows mixed syntax when allowMixedSyntax=true', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-raw>
                <div style="{% block %}; color: {{primaryColor}};">Token</div>
              </mj-raw>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml(input, {
      sanitizeStyles: true,
      minify: true,
      templateSyntax: syntaxes,
      allowMixedSyntax: true,
    })
    const $ = load(html)
    const doc = $.html()
    chai.expect(doc).to.include('color:{{primaryColor}}')
    chai.expect(doc).to.include('{%block%}')
  })

  it('handles multiline tokens in style attributes and blocks', async function () {
    const input = `
      <mjml>
        <mj-head>
          <mj-style>
            .title { color: {{\nheadlineColor\n}}; }
          </mj-style>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-raw>
                <div style="font-weight: [[\n fontWeight \n]];">Token</div>
              </mj-raw>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml(input, {
      sanitizeStyles: true,
      minify: true,
      templateSyntax: syntaxes,
    })
    const $ = load(html)
    const styleText = $('style')
      .map(function () { return $(this).text() })
      .get()
      .find((t) => t.includes('.title')) || ''
    chai.expect(styleText).to.include('color:{{\nheadlineColor\n}}')
    const doc = $.html()
    chai.expect(doc).to.include('font-weight:[[\n fontWeight \n]]')
  })

  it('throws clear error on broken delimiters inside CSS (pre-check)', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-raw>
                <div style="{{ fontTag: {{ fontWeight }};">Token</div>
              </mj-raw>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    let thrown = null
    try {
      await mjml(input, {
        sanitizeStyles: true,
        minify: true,
        templateSyntax: [{ prefix: '{{', suffix: '}}' }],
      })
    } catch (e) {
      thrown = e
    }
    chai.expect(thrown).to.be.an('error')
    chai.expect(thrown.message).to.include('Unbalanced template delimiters found in CSS')
  })

  it('renders with broken delimiters when CSS minify disabled', async function () {
    const input = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-raw>
                <div style="{{ fontTag: {{ fontWeight }};">Token</div>
              </mj-raw>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `
    const { html } = await mjml(input, {
      sanitizeStyles: true,
      minify: true,
      templateSyntax: [{ prefix: '{{', suffix: '}}' }],
      minifyOptions: { minifyCss: false },
    })
    const $ = load(html)
    const allStyles = $('[style]')
      .map(function () { return $(this).attr('style') || '' })
      .get()
      .join(' ')
    chai.expect(allStyles).to.include('{{ fontTag: {{ fontWeight }};')
  })
})
