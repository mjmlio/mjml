const mjml2html = require('./packages/mjml/lib/index')
const map = require('lodash/map')

const toTest = [
  {},
  {
    'background-color': '#dd8800'
  }, {
    'background-url': 'https://i.imgur.com/YJOX1PC.png'
  }, {
    'background-url': 'https://total-error-background-with-fallback.com',
    'background-color': '#dd88ee'
  }
]

const generateTags = (attrs) => `
  <mj-section ${map(attrs, ((v, i) => `${i}="${v}"`)).join(' ')}>
    <mj-column>
      <mj-text>
        <h1>Case: ${JSON.stringify(attrs)}</h1>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      </mj-text>
    </mj-column>
  </mj-section>
  <mj-section full-width="full-width" ${map(attrs, ((v, i) => `${i}="${v}"`)).join(' ')}>
    <mj-column>
      <mj-text>
        <h1>Case: ${JSON.stringify(attrs)}</h1>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      </mj-text>
    </mj-column>
  </mj-section>
`

const xml = `<mjml>
  <mj-body>
    <mj-container>
      ${toTest.map(generateTags).join('\n')}
    </mj-container>
  </mj-body>
</mjml>
`

console.time('mjml2html')

const { html } = mjml2html(xml, {
  beautify: true
})

if (process.argv.includes('--output')) {
  console.log(html)
}

console.timeEnd('mjml2html')
