## mj-column

Columns are key to MJML's easy responsiveness.

Columns contain vertically-structured content.
They must be inside `mj-section` elements to be considered by MJML.
An `mj-column` with widths expressed in percentages is responsive.
An `mj-column` with fixed width (pixels) is not responsive.

When an `mj-section` has more than one `mj-column`,
    the columns appear side-to-side (like a newspaper) on wide enough screens.
Columns stack vertically on narrow screens.

An `mj-column` can contain any standard element
    or other element that you have defined and registered
    &mdash; except `mj-column` or `mj-section` elements.
An element within an `mj-column` has the same width as the column.

```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <!-- Your first column -->
      </mj-column>
      <mj-column>
        <!-- Your second column -->
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/column">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg"
        alt="try it live" />
  </a>
</p>

<aside class="notice">
  Columns were designed for use as a container for content.
  They are not suitable for use as a horizontal offset because
      of their vertically stacked mobile display.
</aside>

<aside class="warning">
  An `mj-column` cannot contain either an `mj-column` or an `mj-section`.
</aside>

attribute        | unit        | description                   | default attributes
-----------------|-------------|-------------------------------|-------------------
background-color | string      | background color for a column | n/a
border           | string      | css border format             | n/a
border-bottom    | string      | css border format             | n/a
border-left      | string      | css border format             | n/a
border-right     | string      | css border format             | n/a
border-top       | string      | css border format             | n/a
border-radius    | %/px {1,4}  | border radius                 | n/a
css-class     | string     | class name, added to the root HTML element created     | n/a
direction        | string      | ltr/rtl                       | ltr
padding          | %/px {1,4}  | supports up to 4 parameters   | n/a
padding-bottom   | %/px        | section bottom offset         | n/a
padding-left     | %/px        | section left offset           | n/a
padding-right    | %/px        | section right offset          | n/a
padding-top      | %/px        | section top offset            | n/a
vertical-align   | string      | bottom/middle/top             | top
width     | %/px     | column width     | (100 / number of non-raw elements in section)%

