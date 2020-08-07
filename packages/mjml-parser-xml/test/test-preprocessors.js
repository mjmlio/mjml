const { template } = require('lodash')
const MJMLParser = require('../lib')
const mjml2html = require('../../mjml/lib')
const { components } = require('../../mjml-core/lib')

const parse = mjml =>
  MJMLParser(mjml, {
    keepComments: true,
    components,
    preprocessors: [
      data =>
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
    {{ buttons.forEach(function(button) { }}
    <mj-text>{{=button.title}}</mj-text>
    {{ }); }}
  </mj-section>
</mj-body>
</mjml>
`

const json = parse(xml)
const { html } = mjml2html(json)

console.log(html) // eslint-disable-line no-console
