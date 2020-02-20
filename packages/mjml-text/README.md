## mj-text

Most important, this element places text in your email.

Also important, this element supports placement of raw HTML tags
  and their attributes anywhere within.

 ```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          <h1>
            Lorem ipsum
          </h1>
          dolor sit amet<br/>
          consectetaur adipisicing
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
 ```

<p align="center">
  <a href="https://mjml.io/try-it-live/elements/text">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg"
         alt="try the code live" />
  </a>
</p> 

 attribute                    | unit                    | description                                 | default value
------------------------------|-------------------------|---------------------------------------------|--------
align      | in ["center", "justify", "left", "right"]      | horizontal text alignment               | left
color      | in [#RRGGBB, &lt;named-color&gt;, rgb(), rgba()]      | text color                       | #000000
container-background-color     | in [#RRGGBB, &lt;named-color&gt;, rgb(), rgba()]      | "mj-text" background color     | n/a
css-class                     | string              | see "css-class" in [mj-style](#mjml-style)      | n/a
font-family      | string; font or generic family name(s)      | same as CSS                          | Ubuntu, Helvetica, Arial, sans-serif
font-size      | px: not negative                       | text size                                   | 13px
font-style      | often "normal", "italic", or "oblique &lt;angle&gt;"      | same as CSS             | n/a
font-weight     | string                                | boldness                                    | n/a
height         | px, %                                  | height of the "mj-text" element             | n/a
letter-spacing       | px: pos, zero, or neg            | letter spacing on the line                  | n/a
line-height      | px, %                                | space between lines                         | 100%
padding      | px, % {1,4}                 | sets "padding-bottom", "-left", "-right", and "-top"     | 10px 25px
padding-bottom      | px, %                             | bottom padding                              | 10px
padding-left      | px, %                               | left padding                                | 25px
padding-right      | px, %                              | right padding                               | 25px
padding-top      | px, %                                | top padding                                 | 10px
text-decoration      | string (often "underline", "overline", "line-through", or "none")      | same as CSS      | n/a
text-transform       | often "uppercase", "lowercase", "capitalize", or "none"      | same as CSS     | n/a
vertical-align      | in ["bottom", "middle", "top"]      | vertical text alignment                   | n/a
