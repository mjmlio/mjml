## mjml-column

Columns enable you to horizontally organize the content within your sections. They must be located under `mj-section` tags in order to be considered by the engine.
To be responsive, columns are expressed in terms of percentage.

Every single column has to contain something because they are responsive containers, and will be vertically stacked on a mobile view.

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <!-- Your first column -->
        </mj-column>
        <mj-column>
          <!-- Your second column -->
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/component/column">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

<aside class="notice">
  Columns are meant to be used as a container for your content. They must not be used as offset. Any mj-element included in a column will have a width equivalent to 100% of this column's width.
</aside>

attribute           | unit        | description                    | default attributes
--------------------|-------------|--------------------------------|--------------------------------------
background-color    | string      | background color for a column  | n/a
border              | string      | css border format              | none
border-bottom       | string      | css border format              | n/a
border-left         | string      | css border format              | n/a
border-right        | string      | css border format              | n/a
border-top          | string      | css border format              | n/a
border-radius       | px          | border radius                  | n/a
width               | percent/px  | column width                   | (100 / number of columns in section)%
vertical-align      | string      | middle/top/bottom              | top
