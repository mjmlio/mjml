## mjml-spacer

Displays a blank space.

```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>A first line of text</mj-text>
        <mj-spacer height="50px" />
        <mj-text>A second line of text</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/spacer">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>

attribute                   | unit        | description                    | default value
----------------------------|-------------|--------------------------------|------------------------------
height                      | px          | spacer height                  | 20px
width                       | px          | spacer width                   | n/a
border                      | string      | css border format              | none
border-bottom               | string      | css border format              | n/a
border-left                 | string      | css border format              | n/a
border-right                | string      | css border format              | n/a
border-top                  | string      | css border format              | n/a
container-background-color   | color         | inner element background color  | n/a
padding                      | px            | supports up to 4 parameters     | none
padding-top                  | px            | top offset                      | n/a
padding-bottom               | px            | bottom offset                   | n/a
padding-left                 | px            | left offset                     | n/a
padding-right                | px            | right offset                    | n/a
vertical-align              | string      | vertical alignment                 | middle
css-class                   | string      | class name, added to the root HTML element created | n/a
