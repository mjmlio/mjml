require('babel-register')

const mjml2html = require('./packages/mjml/src/index')

const xml = `
<mjml owa_desktop="true">
<mj-body>
<mj-section>
<mj-column>
  <mj-social mode="horizontal">
    <mj-social-element href="https://mjml.io/" name="facebook"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="google"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="instagram"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="pinterest"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="linkedin"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="twitter"></mj-social-element>
  </mj-social>
</mj-column>
</mj-section>
<mj-section>
<mj-column>
  <mj-social font-size="15px" icon-size="30px" mode="horizontal">
    <mj-social-element content="Facebook" href="https://mjml.io/" icon-color="#4d4d4d" name="facebook">
      Facebook
    </mj-social-element>
    <mj-social-element content="Google" href="https://mjml.io/" icon-color="#4d4d4d" name="google">
      Google
    </mj-social-element>
    <mj-social-element content="Instagram" href="https://mjml.io/" icon-color="#4d4d4d" name="instagram">
      Instagram
    </mj-social-element>
  </mj-social>
</mj-column>
</mj-section>
<mj-section>
<mj-column>
  <mj-social font-size="11px" icon-size="15px" mode="horizontal">
    <mj-social-element content="Pinterest" href="https://mjml.io/" icon-color="#4d4d4d" name="pinterest">
      Pinterest
    </mj-social-element>
    <mj-social-element content="Linkedin" href="https://mjml.io/" icon-color="#4d4d4d" name="linkedin">
      Linkedin
    </mj-social-element>
    <mj-social-element content="Twitter" href="https://mjml.io/" icon-color="#4d4d4d" name="twitter">
      Twitter
    </mj-social-element>
  </mj-social>
</mj-column>
</mj-section>
<mj-section>
<mj-column>
  <mj-social align="right" container-background-color="#AAA" mode="vertical" text-mode="false">
    <mj-social-element href="https://mjml.io/" name="facebook"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="google"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="instagram"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="pinterest"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="linkedin"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="twitter"></mj-social-element>
  </mj-social>
</mj-column>
<mj-column>
  <mj-social color="#f45e43" container-background-color="#CCC" line-height="25px" mode="vertical" text-decoration="underline">
    <mj-social-element href="https://mjml.io/" name="facebook"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="google"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="instagram"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="pinterest"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="linkedin"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="twitter"></mj-social-element>
  </mj-social>
</mj-column>
<mj-column>
  <mj-social align="left" color="#f45e43" container-background-color="#AAA" line-height="30px" mode="vertical" text-decoration="overline">
    <mj-social-element href="https://mjml.io/" name="facebook"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="google"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="instagram"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="pinterest"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="linkedin"></mj-social-element>
    <mj-social-element href="https://mjml.io/" name="twitter"></mj-social-element>
  </mj-social>
</mj-column>
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
