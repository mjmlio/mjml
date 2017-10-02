## mjml-divider

Displays a horizontal divider that can be customized like a HTML border.

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-divider border-width="1px" border-style="dashed" border-color="lightgrey" />
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/divider">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="try it live button" />
  </a>
</p>

attribute                   | unit        | description                    | default value
----------------------------|-------------|--------------------------------|------------------------------
border-color                | color       | divider color                  | #000000
border-style                | string      | dashed/dotted/solid            | solid
border-width                | px          | divider's border width         | 4px
width                       | px/percent  | divider width                  | 100%
container-background-color  | color       | inner element background color | n/a
padding                     | px          | supports up to 4 parameters    | 10px 25px
padding-top                 | px          | top offset                     | n/a
padding-bottom              | px          | bottom offset                  | n/a
padding-left                | px          | left offset                    | n/a
padding-right               | px          | right offset                   | n/a
css-class                   | string      | class name, added to the root HTML element created | n/a
