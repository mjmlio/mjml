## mjml-column

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

Columns enable you to horizontally organize the content within your sections. They must be located under `mj-section` tags in order to be considered by the engine.
To be responsive, columns are expressed in terms of percentage.

Every single column has to contain something because they are responsive containers, and will be vertically stacked on a mobile view.

<aside class="notice">
Columns are meant to be used as a container for your content. They must not be used as offset. Any mj-element included in a column will have a width equivalent to 100% of this column's width.
</aside>

<p align="center">
  <a href="/try-it-live/column"><img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" /></a>
</p>

attribute           | unit        | description                    | default attributes
--------------------|-------------|--------------------------------|--------------------------------------
width               | percent/px  | column width                   | (100 / number of columns in section)%
vertical-align      | string      | middle/top/bottom              | top
background-color    | string      | background color for a column  | n/a
