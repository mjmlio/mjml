const mjml2html = require('./packages/mjml/lib/index')
const map = require('lodash/map')

const xml = `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text co lor="blue" />
      <mj-class name="try" color="violet" />
    </mj-attributes>
  </mj-head>
  <mj-body>
 <mj-section>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="white" background-color="#f45e43" font-style="italic">
            Background-color & font-size
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="white" background-color="#f45e43" border-radius="50px">
            border-radius
          </mj-button>
        </mj-column>
      </mj-section>

      <mj-section>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" font-size="18px" color="black" background-color="#FFFFFF" align="right">
            align right
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" font-size="18px" color="black" background-color="#FFFFFF" align="left">
            align left
          </mj-button>
        </mj-column>
      </mj-section>

      <mj-section>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="white" background-color="#f45e43" border="2px solid #FFF" vertical-align="top">
            2px solid #FFF
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="white" background-color="#f45e43" border="2px dashed #FFF" vertical-align="bottom">
            2px dashed #FFF
          </mj-button>
        </mj-column>
      </mj-section>

      <mj-section>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="#4d4d4d" background-color="#f45e43" container-background-color="#FFF" padding="35px 10px">
            container-background-color & padding
          </mj-button>
        </mj-column>
      </mj-section>

      <mj-section>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="#333" border="solid 2px #f45e43" border-radius="20px" background-color="transparent" inner-padding="15px 30px">
            Ghost button
          </mj-button>
        </mj-column>
      </mj-section>

      <mj-section>
          <mj-column>
            <mj-button href="https://mjml.io/" font-family="Helvetica" color="#333" border-top="solid 2px #f45e43" border-bottom="solid 2px #f45e43" background-color="transparent" inner-padding="15px 30px">
              Border-top, border-bottom, transparent
            </mj-button>
          </mj-column>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="#333" border-left="solid 2px #f45e43" border-right="solid 2px #f45e43" border-radius="20px" background-color="#ddddd">
            Border-left, border-right & radius
          </mj-button>
        </mj-column>
      </mj-section>

      <mj-section>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="#333" border="solid 2px #f45e43" border-radius="20px" background-color="transparent" width="200px">
            Width 200px
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="#333" border="solid 2px #f45e43" border-radius="20px" background-color="transparent" height="80px">
            Height 80px
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-button href="https://mjml.io/" font-family="Helvetica" color="#ffffff" border="solid 2px #111" border-radius="20px" background-color="#f45e43" width="200px" height="80px">
            Height 80px & Width 200px
          </mj-button>
        </mj-column>
      </mj-section>
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
