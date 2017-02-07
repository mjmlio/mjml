const mjml2html = require('./packages/mjml/lib/index')

const xml = `
<mjml>
  <mj-head>
    <!-- blblbl -->
    <mj-title>
      <!-- blou ? -->
      Mon titre
    </mj-title>
    <!-- /o\ -->
  </mj-head>
  <mj-body>
    <mj-container>
      <!-- container ~~ -->
      <!-- my first section <% %> -->
      <mj-section>
        <mj-column>
          <!-- column ! -->
          <mj-text>
            Hey !
          </mj-text>
        </mj-column>
      </mj-section>
      <!-- my second section \o/ -->
      <mj-section>
        <!-- inner my second section ô ô -->
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`

console.time('mjml2html')

const html = mjml2html(xml, {
  beautify: true,
})

if (process.argv.includes('--output')) {
  console.log(html)
}

console.timeEnd('mjml2html')
