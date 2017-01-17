const mjml2html = require('./packages/mjml/lib/index')

const xml = `
<mjml>
  <mj-body>
    <mj-container background-color="#d6dde5">
      <mj-section full-width="full-width" padding-bottom="20">

      </mj-section>
      <mj-section background-color="#fff" padding-bottom="10" padding-top="10">
        <mj-column>
          <mj-image href="https://mjml.io" src="http://191n.mj.am/img/191n/3s/x4u.png" alt="Racoon logo" align="center" padding-bottom="10" padding-top="10">
          </mj-image>
        </mj-column>
        <mj-column>
          <mj-text font-size="15px">
            <p><a href="https://mjml.io" style="text-decoration: none; color: inherit;">home</a> &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0;
              <a href="https://mjml.io" style="text-decoration: none; color: inherit;">blog</a> &#xA0; &#xA0; &#xA0; &#xA0; &#xA0; &#xA0;
              <a href="https://mjml.io" style="text-decoration: none; color: inherit;">visit store</a></p>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#fa8739" padding-bottom="0" padding-top="0">
        <mj-column width="200">
          <mj-text align="left" color="#fff" font-size="40" padding-left="25" padding-right="25" padding-bottom="10" padding-top="10">
            <p style="font-size: 17px;">SPRING PROMO</p>
            <p>50%</p>
            <p>OFFER</p>
            <p style="font-size: 13px">Lorem ipsum dolor sit amet, consectetur adipiscing elit<br></p>
          </mj-text>
          <mj-button background-color="#fff" color="#fa8739" font-size="16px" align="center" padding="15px 30px" border-radius="3px" href="https://mjml.io" padding-left="25" padding-right="25" padding-bottom="10" padding-top="10">
            SHOP NOW
          </mj-button>
        </mj-column>
        <mj-column width="400">
          <mj-image src="http://191n.mj.am/img/191n/3s/xjg.jpg" alt="Clothes set" align="center" border="none" width="400" padding-left="0" padding-right="0" padding-bottom="0" padding-top="0">

          </mj-image>
        </mj-column>
      </mj-section>
      <mj-section background-color="#2f323b" padding-bottom="0" padding-top="0">
        <mj-column width="25%">
          <mj-image src="http://191n.mj.am/img/191n/3s/x4t.png" alt="Box free shipping" align="center" border="none" width="42" padding-left="0" padding-right="0" padding-bottom="10" padding-top="10">

          </mj-image>
        </mj-column>
        <mj-column width="75%">
          <mj-text align="left" color="#fff" font-size="18" padding-left="25" padding-right="25" padding-bottom="10" padding-top="10">
            <p>FREE SHIPPING ON ORDER <span style="font-weight: bold;color: rgb(250, 135, 57);">OVER 55&#x20AC;</span></p>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#fff" padding-bottom="20" padding-top="10">
        <mj-column vertical-align="bottom">
          <mj-image src="http://191n.mj.am/img/191n/3s/x4v.jpg" alt="Chesterk tank" align="center" border="none" width="209" padding-left="0" padding-right="0" padding-bottom="20" padding-top="30">

          </mj-image>
          <mj-text font-weight="bold" align="center" color="#000" font-size="15" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p>CHESTERK TANK</p>
            <p style="color: rgb(250, 135, 57);">15&#x20AC;</p>
          </mj-text>
          <mj-button background-color="#fa8739" color="#fff" font-size="13" align="center" padding="15px 30px" border-radius="3px" href="https://mjml.io" padding-bottom="10" padding-top="0">
            BUY NOW
          </mj-button>
        </mj-column>
        <mj-column vertical-align="bottom">
          <mj-image src="http://191n.mj.am/img/191n/3s/x4g.jpg" alt="Beyond backpack" align="center" border="none" width="178" padding-left="0" padding-right="0" padding-bottom="20" padding-top="30">

          </mj-image>
          <mj-text font-weight="bold" align="center" color="#000" font-size="15" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p>BEYOND BACKPACK</p>
            <p style="color: rgb(250, 135, 57);">20&#x20AC;</p>
          </mj-text>

          <mj-button background-color="#fa8739" color="#fff" font-size="13" align="center" padding="15px 30px" border-radius="3px" href="https://mjml.io" padding-bottom="10" padding-top="0">
            BUY NOW
          </mj-button>
        </mj-column>
        <mj-column vertical-align="bottom">
          <mj-image src="http://191n.mj.am/img/191n/3s/x46.jpg" alt="Jensen shorts" align="center" border="none" width="182" padding-left="0" padding-right="0" padding-bottom="20" padding-top="30">

          </mj-image>
          <mj-text font-weight="bold" align="center" color="#000" font-size="15" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p>JENSEN SHORTS</p>
            <p style="color: rgb(250, 135, 57);">28&#x20AC;</p>
          </mj-text>
          <mj-button background-color="#fa8739" color="#fff" font-size="13" align="center" padding="15px 30px" border-radius="3px" href="https://mjml.io" padding-bottom="10" padding-top="0">
            BUY NOW
          </mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#fff" padding-bottom="20" padding-top="10">
        <mj-column vertical-align="bottom">
          <mj-image src="http://191n.mj.am/img/191n/3s/x4h.jpg" alt="Verdant cap" align="center" border="none" width="129" padding-left="0" padding-right="0" padding-bottom="20" padding-top="20">

          </mj-image>
          <mj-text font-weight="bold" align="center" color="#000" font-size="15" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p>VERDANT CAP</p>
            <p style="color: rgb(250, 135, 57);">20&#x20AC;</p>
          </mj-text>
          <mj-button background-color="#fa8739" color="#fff" font-size="13" align="center" border="none" padding="15px 30px" border-radius="3px" href="https://mjml.io" padding-left="25" padding-right="25" padding-bottom="10" padding-top="0">
            BUY NOW
          </mj-button>
        </mj-column>
        <mj-column vertical-align="bottom">
          <mj-image src="http://191n.mj.am/img/191n/3s/x4i.jpg" alt="Blake polo shirt" align="center" border="none" width="208" padding-left="0" padding-right="0" padding-bottom="20" padding-top="20">

          </mj-image>
          <mj-text font-weight="bold" align="center" color="#000" font-size="15" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p>BLAKE POLO SHIRT</p>
            <p style="color: rgb(250, 135, 57);">25&#x20AC;</p>
          </mj-text>
          <mj-button background-color="#fa8739" color="#fff" font-size="13" align="center" padding="15px 30px" border-radius="3px" href="https://mjml.io" padding-bottom="10" padding-top="0">
            BUY NOW
          </mj-button>
        </mj-column>
        <mj-column vertical-align="bottom">
          <mj-image src="http://191n.mj.am/img/191n/3s/x4j.jpg" alt="Sketch floral" align="center" border="none" width="72" padding-left="0" padding-right="0" padding-bottom="20" padding-top="20">

          </mj-image>
          <mj-text font-weight="bold" align="center" color="#000" font-size="15" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p>SKETCH FLORAL</p>
            <p style="color: rgb(250, 135, 57);">23&#x20AC;</p>
          </mj-text>
          <mj-button background-color="#fa8739" color="#fff" font-size="13" align="center" padding="15px 30px" border-radius="3px" href="https://mjml.io" padding-bottom="10" padding-top="0">
            BUY NOW
          </mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#fa8739" padding-bottom="0" padding-top="0">
        <mj-column>
          <mj-image src="http://191n.mj.am/img/191n/3s/x4k.jpg" alt="Man 1" width="301" padding-left="0" padding-right="0" padding-bottom="0" padding-top="0">
          </mj-image>
        </mj-column>
        <mj-column width="50%">
          <mj-text align="left" color="#fff" font-size="13" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p style="font-size: 19px;">ANDERSON SWEATER</p>
            <p style="font-size: 36px;">75&#x20AC;</p>
            <p>The Anderson Sweater features a floral all-over print with contrast colour.</p>
          </mj-text>
          <mj-button background-color="#fff" color="#fa8739" padding="15px 30px" border-radius="3px" href="https://mjml.io" padding-bottom="10" padding-top="0">
            BUY NOW
          </mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#2f323b" padding-bottom="0" padding-top="0">
        <mj-column>
          <mj-text align="left" color="#fff" font-size="13" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p style="font-size: 19px;">ALDER TWO JONES JACKET</p>
            <p style="font-size: 36px;">100&#x20AC;</p>
            <p>Colour-block design, zip entry, oxford hood lining, side pockets &amp; TC lining.</p>
          </mj-text>
          <mj-button background-color="#fa8739" color="#fff" padding="15px 30px" border-radius="3px" href="https://mjml.io" padding-bottom="10" padding-top="0">
            BUY NOW
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-image src="http://191n.mj.am/img/191n/3s/xj6.jpg" alt="Man 2" align="center" border="none" width="302" padding-left="0" padding-right="0" padding-bottom="0" padding-top="0">

          </mj-image>
        </mj-column>
      </mj-section>
      <mj-section background-color="#fa8739" padding-bottom="0" padding-top="0">
        <mj-column>
          <mj-text align="center" color="#fff" font-size="13" padding-left="25" padding-right="25" padding-bottom="10" padding-top="10">
            <p style="font-size: 14px;">DISCOVER OUR</p>
            <p style="font-size: 27px;">SUMMER COLLECTION</p>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#fff" padding-bottom="20" padding-top="20">
        <mj-column>
          <mj-image src="http://191n.mj.am/img/191n/3s/x4q.jpg" alt="Topaz C3 shoes" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
          </mj-image>
          <mj-text align="center" color="#000" font-size="15" font-weight="bold" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p>TOPAZ C3 SHOES</p>
            <p style="color: rgb(250, 135, 57);">70&#x20AC;</p>
          </mj-text>
          <mj-button background-color="#fa8739" color="#fff" font-size="13" align="center" padding="15px 30px" border-radius="3px" href="https://mjml.io" padding-bottom="10" padding-top="0">
            BUY NOW
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-image src="http://191n.mj.am/img/191n/3s/x4r.jpg" alt="Camden backpack" align="center" border="none" width="199" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">

          </mj-image>
          <mj-text align="center" color="#000" font-size="15" font-weight="bold" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p>CAMDEN BACKPACK</p>
            <p style="color: rgb(250, 135, 57);">50&#x20AC;</p>
          </mj-text>
          <mj-button background-color="#fa8739" color="#fff" padding="15px 30px" border-radius="3px" href="https://mjml.io" padding-bottom="10" padding-top="0">
            BUY NOW
          </mj-button>
        </mj-column>
      </mj-section>
      <mj-section background-color="#2f323b" padding-bottom="20" padding-top="20">
        <mj-column>
          <mj-image src="http://191n.mj.am/img/191n/3s/x47.png" alt="Cards" width="72">
          </mj-image>
          <mj-text align="center" color="#fff" font-size="13" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p style="font-size: 15px;font-weight: bold;">PAYMENT METHODS</p>
            <p>We accept all majors payments options</p>
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-image src="http://191n.mj.am/img/191n/3s/x48.png" alt="Currencies" align="center" border="none" width="70" padding-left="25" padding-right="25" padding-bottom="0" padding-top="10">

          </mj-image>
          <mj-text align="center" color="#fff" font-size="13" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p style="font-size: 15px;font-weight: bold;">CURRENCIES CHOICE</p>
            <p>You have the choice to pay with your own currencies</p>
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-image src="http://191n.mj.am/img/191n/3s/x4y.png" alt="Express" align="center" border="none" width="82" padding-left="25" padding-right="25" padding-bottom="8" padding-top="10">

          </mj-image>
          <mj-text align="center" color="#fff" font-size="13" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p style="font-size: 15px;font-weight: bold;">EXPRESS SHIPPING</p>
            <p>Delivered tomorrow before noon</p>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section background-color="#fa8739" padding-bottom="0" padding-top="0">
        <mj-column>
          <mj-image src="http://191n.mj.am/img/191n/3s/x49.png" alt="Racoon logo" align="center" border="none" width="180" padding-left="0" padding-right="0" padding-bottom="0" padding-top="10">
          </mj-image>
        </mj-column>
        <mj-column>
          <mj-text align="center" color="#fff" font-size="13" padding-left="25" padding-right="25" padding-bottom="0" padding-top="0">
            <p><a href="https://mjml.io" style="text-decoration: none; color: inherit;">Privacy policy</a></p>
          </mj-text>
        </mj-column>
        <mj-column>
          <mj-social font-size="13" text-mode="false" facebook-href="[[SHORT_PERMALINK]]" twitter-href="[[SHORT_PERMALINK]]" google-href="[[SHORT_PERMALINK]]" mode="horizontal" display="facebook twitter google" padding-left="25" padding-right="25" padding-bottom="10"
            padding-top="10">
          </mj-social>
        </mj-column>
      </mj-section>
      <mj-section padding-bottom="20" padding-top="20">
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`

console.time('mjml2html')

const html = mjml2html(xml)

if (process.argv.includes('--output')) {
  console.log(html)
}

console.timeEnd('mjml2html')
