## mjml-style

This tag allows you to set CSS styles that will be applied to the <b>HTML</b> in your MJML document as well as the HTML outputted. The CSS styles will be added to the head of the rendered HTML by default, but can also be inlined by using the `inline="inline"` attribute.

  ```xml
  <mjml>
    <mj-head>
      <mj-style>
        @media all and (max-width: 480px) {
          div[style*="color:#F45e46;"] {
            text-align: center !important
          }
        }
      </mj-style>
      <mj-style inline="inline">
        .link-nostyle {
          color: inherit;
          text-decoration: none
        }
      </mj-style>
    </mj-head>
    <mj-body>
      <mj-container>
        <mj-section >
          <mj-column>

            <mj-image width="100" src="/assets/img/logo-small.png"></mj-image>

            <mj-divider border-color="#F45E43"></mj-divider>

            <mj-text font-size="20px" color="#F45e46" font-family="helvetica">
              Hello <a href="https://mjml.io" class="link-nostyle">World</a>
            </mj-text>

          </mj-column>
        </mj-section>
      </mj-container>
    </mj-body>
  </mjml>
   ```

  <p align="center">
    <a href="https://mjml.io/try-it-live/components/head-style">
      <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
    </a>
  </p>
  
  attribute            | unit          | description                         | default value
  ---------------------|---------------|-------------------------------------|---------------
  inline               | string        | set to "inline" to inline styles    | n/a
