import { mjml2html } from './src/index'


console.log(mjml2html(`
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-raw><td><% if (undefined) {} %></td></mj-raw>
      </mj-column>
    </mj-section>
  </mj-body>
`))
