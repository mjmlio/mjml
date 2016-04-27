var mjml = require('./lib/index')

console.log(mjml.mjml2html(`
<mjml>
 <mj-body>
   <mj-container>
      <mj-section>
        <mj-column>
          <mj-table>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
              <th style="padding: 0 15px 0 0;">Year</th>
              <th style="padding: 0 15px;">Language</th>
              <th style="padding: 0 0 0 15px;">Inspired from</th>
            </tr>
            <tr>
              <td style="padding: 0 15px 0 0;">1995</td>
              <td style="padding: 0 15px;">PHP</td>
              <td style="padding: 0 0 0 15px;">C, Shell Unix</td>
            </tr>
            <tr>
              <td style="padding: 0 15px 0 0;">1995</td>
              <td style="padding: 0 15px;">JavaScript</td>
              <td style="padding: 0 0 0 15px;">Scheme, Self</td>
            </tr>
          </mj-table>
          <mj-invoice format="0,00.00€" intl="name:Product Name">
            <mj-invoice-item name="TV" price="549€" quantity="1" />
            <mj-invoice-item name="DVD - Iron Man II" price="22.99€" quantity="2" />
          </mj-invoice>
          <mj-social />
          <mj-button>
            My button
          </mj-button>
          <mj-text>
            My text
          </mj-text>
          <mj-image src="https://mjml.io/assets/img/logo-picto-small.png" />
          <mj-html>
            <table>
              <tr>
                <td>
                  My Html
                </td>
              </tr>
            </table>
          </mj-html>
          <mj-divider />
          <mj-raw>
            <% if (undefined) {} %>
          </mj-raw>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`, { beautify: true }))
