require('babel-register')

const mjml2html = require('./packages/mjml/src/index')

const xml = `
<mjml>

  <mj-head>
    <mj-title>Say hello to card</mj-title>
    <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500" />
    <mj-attributes>
      <mj-all font-family="Montserrat, Helvetica, Arial, sans-serif" />
      <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" />
      <mj-section padding="0" />
    </mj-attributes>
  </mj-head>

  <mj-body background-color="#F2F2F2">

      <mj-section padding="10px 0 20px 0">
        <mj-column>
          <mj-text align="center" color="#9B9B9B" font-size="11px">Writing A Good Headline For Your Advertisement</mj-text>
        </mj-column>
      </mj-section>

      <mj-section padding="20px 20px 0 20px" background-color="#FFFFFF">
        <mj-column width="35%">
          <mj-text align="left" font-size="20px" font-weight="500">
            // BR&amp;AND
          </mj-text>
        </mj-column>
        <mj-column width="65%">
          <mj-text align="right" font-size="11px">
            <a href="#" style="color: #000000; text-decoration: none;">HOME</a>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;<a href="#" style="color: #000000; text-decoration: none;">SERVICE</a>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;<a href="#" style="color: #000000; text-decoration: none;">THIRD</a>
          </mj-text>
        </mj-column>
      </mj-section>

      <mj-section padding="20px 20px 0 20px" background-color="#FFFFFF">
        <mj-column>
          <mj-text align="center" font-weight="300" padding="30px 40px 10px 40px" font-size="32px" line-height="40x" color="#5FA91D">
            Free Advertising For Your Online Business.
          </mj-text>
        </mj-column>
      </mj-section>

      <mj-section padding="10px 20px" background-color="#FFFFFF">
        <mj-column>
          <mj-divider width="30px" border-width="3px" border-color="#9B9B9B" />
        </mj-column>
      </mj-section>

      <mj-section padding="0 20px 20px 20px" background-color="#FFFFFF">
        <mj-column width="80%">
          <mj-text align="center" padding-top="10px" font-weight="500" padding="0">
            A Right Media Mix Can Make The Difference.
          </mj-text>
        </mj-column>
      </mj-section>


      <mj-section background-url="http://nimus.de/share/tpl-card/bg.jpg" vertical-align="middle" background-size="cover" background-repeat="no-repeat">
        <mj-column width="100%">
          <mj-image src="http://nimus.de/share/tpl-card/lineshadow.png" alt="" align="center" border="none" padding="0"></mj-image>
          <mj-text align="center" padding="50px 40px 0 40px" font-weight="300" padding="0">
            Marketers/advertisers usually focus their efforts on the people responsible for making the purchase. In many cases, this is an effective approach but in other cases it can make for a totally useless marketing campaign.
          </mj-text>
          <mj-button align="center" background-color="#5FA91D" color="#FFFFFF" border-radius="2px" href="#" inner-padding="15px 30px" padding-bottom="100px" padding-top="20px">
            CALL TO ACTION
          </mj-button>
        </mj-column>
      </mj-section>

      <mj-section padding="50px 0 0 0" background-color="#FFFFFF">
        <mj-column>
          <mj-image src="http://nimus.de/share/tpl-card/bottom.png" alt="bottom border" align="center" border="none" padding="0"></mj-image>
        </mj-column>
      </mj-section>

      <mj-section padding="10px 0 20px 0">
        <mj-column>
          <mj-text align="center" color="#9B9B9B" font-size="11px"><a href="#" style="color: #9B9B9B;">Unsubscribe</a> from this newsletter<br>52 Edison Court Suite 259 / East Aidabury / Cambodi<br>
            <a href="#" style="color: #9B9B9B; text-decoration:none;">Made by svenhaustein.de</a>
          </mj-text>
        </mj-column>
      </mj-section>


  </mj-body>
</mjml>`

console.time('mjml2html')

const { html } = mjml2html(xml, {
  beautify: true,
  filePath: './test.mjml'
})

console.timeEnd('mjml2html')

if (process.argv.includes('--output')) {
  console.log(html)
}

if (process.argv.includes('--open')) {
  const opn = require('opn')
  const path = require('path')
  const fs = require('fs')

  const testFile = path.resolve(__dirname, './test.html')

  fs.writeFileSync(testFile, html)

  opn(testFile, {
    wait: false,
  })
}
