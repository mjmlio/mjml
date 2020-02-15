## mjml-text

Most important, this element places text in your email.

Also important, this element supports placement of raw HTML tags
  and their attributes anywhere within.
Sometimes, developers put _only_ HTML within a given `<mj-text>` tag set.

Inside this tag, there's no need to surround each paragraph with HTML `<p>` tags.
The HTML `<br/>` tag is convenient for creating  line breaks.



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

<aside class="notice">
Don't forget to encode special characters to avoid unexpected
  behaviour from MJML's parser.
</aside>

 attribute                    | unit                    | description                                 | default value
------------------------------|-------------------------|---------------------------------------------|-------------------------------------
align      | in ["center", "justify", "left", "right"]      | horizontal text alignment <!--- not CSS "align" because different shape -->      | left
color      | in [#RRGGBB, &lt;named-color&gt, rgb(), rgba()] <!--- see color.js in mjml-core -->      | text color; <!--- not CSS "color" because different shape -->  | #000000
container-background-color    | in [#RRGGBB, &lt;named-color&gt, rgb(), rgba()] <!--- see color.js in mjml-core -->      | "mj-text" background color <!--- not CSS "color" because different shape -->      | n/a
css-class      | string       | creates HTML classes and attributes, added to the root HTML element created; see "css-class" in [mj-style](#../mjml-head-style/mjml-style) for code example      | n/a
font-family                   | string; font or generic family name(s)      | same as CSS "font-family"       | Ubuntu, Helvetica, Arial, sans-serif
font-size      | px: not negative      | text size <!--- not CSS "font-size" because different shape -->      | 13px
font-style        | often "normal", "italic", or "oblique &lt;angle&gt;"      | same as CSS "font-style"      | n/a
font-weight                   | string            | font weight (or boldness); same as CSS "font-weight"      | n/a
height      | px, %      | height of the "mj-text" element; % is relative to the containing block's height. <!--- not CSS "height" because different shape -->      | n/a
letter-spacing       | px: pos, zero, or neg      | letter spacing within the line <!--- not CSS "letter-spacing" because different shape -->      | n/a
line-height          | px, %       | space between lines; % is relative to the block's font <!--- not CSS "line-height" because different shape -->      | 100%
padding              | px, % {1,4}      | sets "padding-bottom", "-left", "-right", and "-top"; % is relative to "width" of containing block <!--- not CSS "padding" because different shape -->      | 10px 25px
padding-bottom       | px, %                            | sets bottom padding; % same as above        | 10px
padding-left         | px, %                            | sets left padding; % same as above          | 25px
padding-right        | px, %                            | sets right padding; % same as above         | 25px
padding-top          | px, %                            | sets top padding; % same as above           | 10px
text-decoration      | string (often "underline", "overline", "line-through", or "none")      | same as CSS "text-decoration"      | n/a
text-transform       | often "uppercase", "lowercase", "capitalize", or "none"      |  same as CSS "text-transform"      | n/a
vertical-align      | in ["bottom", "middle", "top"]      | vertical text alignment <!--- not CSS "vertical-align" because different shape --> | n/a

