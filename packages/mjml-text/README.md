## mjml-text

 ```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-text>
            <h1>
              Hey Title!
            </h1>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
          <mj-text>
            Hey There!
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
 ```

This tag allows you to display text in your email.

<aside class="notice">
`MjText` can contain any HTML tag with any attributes. Don't forget to encode special characters to avoid unexpected behaviour from MJML's parser
</aside>

<p align="center">
  <a href="/try-it-live/text"><img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" /></a>
</p>

 attribute        | unit          | description                    | default value
------------------|---------------|--------------------------------|-------------------------------------
 color            | color         | text color                     | #000000
 font-family      | string        | font                           | Ubuntu, Helvetica, Arial, sans-serif
 font-size        | px            | text size                      | 13px
 font-style       | string        | normal/italic/oblique          | n/a
 font-weight      | number        | text thickness                 | n/a
 line-height      | px            | space between the lines        | 22px
 text-decoration  | string        | underline/overline/none        | n/a
 align            | string        | left/right/center              | left
 padding          | px            | supports up to 4 parameters    | 10px 25px
 padding-top      | px            | top offset                     | n/a
 padding-bottom   | px            | bottom offset                  | n/a
 padding-left     | px            | left offset                    | n/a
 padding-right    | px            | right offset                   | n/a
