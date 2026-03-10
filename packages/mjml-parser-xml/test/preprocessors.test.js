const chai = require('chai')
const { template } = require('lodash')
const MJMLParser = require('../lib')
const mjml2html = require('mjml')
const { components } = require('mjml-core')

describe('mjml-parser-xml preprocessors', () => {
  it('applies preprocessors before parsing', async () => {
    const parse = (mjml) =>
      MJMLParser(mjml, {
        keepComments: true,
        components,
        filePath: '.',
        ignoreIncludes: false,
        preprocessors: [
          (data) =>
            template(data, {
              evaluate: /{{([\s\S]+?)}}/g,
              interpolate: /{{=([\s\S]+?)}}/g,
              escape: /{{-([\s\S]+?)}}/g,
            })({
              buttons: [{ title: 'Title' }, { title: 'Title2' }],
            }),
        ],
      })

    const xml = `<mjml>
<mj-body>
  <mj-section mj-class="content">
    <mj-column>
      {{ buttons.forEach(function(button) { }}
      <mj-text>{{=button.title}}</mj-text>
      {{ }); }}
    </mj-column>
  </mj-section>
</mj-body>
</mjml>
`

    const json = parse(xml)
    const { html, errors } = await mjml2html(json, { minify: false })

    chai.expect(errors, 'mjml compilation errors').to.have.length(0)
    chai.expect(html, 'preprocessor should expand both titles').to.include('Title')
    chai.expect(html, 'preprocessor should expand both titles').to.include('Title2')
  })
})
