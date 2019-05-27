## mj-text

This tag allows you to display text in your email.

 ```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          <h1>
            Hey Title!
          </h1>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
 ```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/text">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>

<aside class="notice">
  `MjText` can contain any HTML tag with any attributes. Don't forget to encode special characters to avoid unexpected behaviour from MJML's parser
</aside>

 attribute                    | unit          | description                                 | default value
------------------------------|---------------|---------------------------------------------|-------------------------------------
 color                        | color         | text color                                  | #000000
 font-family                  | string        | font                                        | Ubuntu, Helvetica, Arial, sans-serif
 font-size                    | px            | text size                                   | 13px
 font-style                   | string        | normal/italic/oblique                       | n/a
 font-weight                  | number        | text thickness                              | n/a
 line-height                  | px            | space between the lines                     | 1
 letter-spacing               | px            | letter spacing                              | none
 height                       | px            | The height of the element                   | n/a
 text-decoration              | string        | underline/overline/line-through/none        | n/a
 text-transform               | string        | uppercase/lowercase/capitalize              | n/a
 align                        | string        | left/right/center/justify                   | left
 container-background-color   | color         | inner element background color              | n/a
 padding                      | px            | supports up to 4 parameters                 | 10px 25px
 padding-top                  | px            | top offset                                  | n/a
 padding-bottom               | px            | bottom offset                               | n/a
 padding-left                 | px            | left offset                                 | n/a
 padding-right                | px            | right offset                                | n/a
 css-class                    | string        | class name, added to the root HTML element created | n/a
