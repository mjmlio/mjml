require('babel-register')

const mjml2html = require('./packages/mjml/src/index')

const xml = `
<mjml>
<mj-head>
    <mj-title>aezaze</mj-title>
    <mj-attributes>
        <mj-text     color="#FFF"
                    align="center"
                    line-height="110%" />
        <mj-image    align="center" />
        <mj-section vertical-align="top"
                    text-align="center"
                    padding="0" />
        <mj-all font-family="Lato, Verdana, Helvetica, Arial, sans-serif" />
    </mj-attributes>
    <!-- <mj-style inline='inline'>
        .mj-mw {
            max-width: 600px !important;
            margin: 0 auto !important;
        }
    </mj-style> -->
</mj-head>
<mj-body background-color="#4a6477">

            <!-- CIRCLE / LINKS -->
            <mj-section padding-right="15%"
                        padding-left="15%">
                <mj-group>
                    <mj-column>
                        <mj-image    width="80px"
                                    padding="2px"
                                    href="https://www.webmd.com/dna/retirement-health-guide#10WAYSTOBEYOU"
                                    src="https://joystick.cachefly.net/webmd/mailer/ensure/i_circle1.gif">
                        </mj-image>
                    </mj-column>
                    <mj-column>
                        <mj-image    width="80px"
                                    padding="2px"
                                    href="https://www.webmd.com/dna/retirement-health-guide#NUTRIENTSYOUNEED"
                                    src="https://joystick.cachefly.net/webmd/mailer/ensure/i_circle2.gif">
                        </mj-image>
                    </mj-column>
                    <mj-column>
                        <mj-image    width="80px"
                                    padding="2px"
                                    href="https://www.webmd.com/dna/retirement-health-guide#PROTEINCALCULATOR"
                                    src="https://joystick.cachefly.net/webmd/mailer/ensure/i_circle3.gif">
                        </mj-image>
                    </mj-column>
                    <mj-column>
                        <mj-image    width="80px"
                                    padding="2px"
                                    href="https://www.webmd.com/dna/retirement-health-guide#EXERCISECHALLENGES"
                                    src="https://joystick.cachefly.net/webmd/mailer/ensure/i_circle4.gif">
                        </mj-image>
                    </mj-column>
                </mj-group>
            </mj-section>

</mj-body>
</mjml>
`

console.time('mjml2html')

const { html } = mjml2html(xml, {
  beautify: true,
  filePath: './test.mjml',
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
