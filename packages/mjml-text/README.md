## mj-text

Most important, this element places text in your email.

Also important, this element supports use of raw HTML tags
  and their attributes anywhere within.

```
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          <h1>Lorem ipsum</h1>
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

 attribute                 | unit             | description                                     | default value
---------------------------|------------------|-------------------------------------------------|--------------
align                      | string           | left/right/center/justify                       | left
background-color           | color            | TBD                                             | n/a
color                      | color            | text color                                      | #000000
container-background-color | color            | element background color                        | n/a
css-class                  | string        | class name, added to the root HTML element created | n/a
font-family                | string           | font                                            | Ubuntu, Helvetica, Arial, sans-serif
font-size                  | px: not negative | text size                                       | 13px
font-style                 | string           | normal/italic/oblique                           | n/a
font-weight                | string           | text thickness                                  | n/a
height                     | px, %            | element height                                  | n/a
letter-spacing             | px               | letter spacing                                  | n/a
line-height                | px, %         | each line's vertical space; includes space between | 100%
padding                    | px, % {1,4}      | supports up to 4 parameters                     | 10px 25px
padding-bottom             | px, %            | bottom padding                                  | 10px
padding-left               | px, %            | left padding                                    | 25px
padding-right              | px, %            | right padding                                   | 25px
padding-top                | px, %            | top padding                                     | 10px
text-decoration            | string           | underline/overline/line-through/none            | n/a
text-transform             | string           | uppercase/lowercase/capitalize                  | n/a
vertical-align             | string           | bottom/middle/top                               | n/a
