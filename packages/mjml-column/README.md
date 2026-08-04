### mj-column

Columns enable you to organize the content of your sections into distinct columns which stack when viewed on a mobile device.

They must be located within `mj-section` tags in order to be considered by the engine.

<div class="alert alert-caution" role="alert">
  <p>Caution</p>
  <p>The sum of columns in a section cannot be greater than
      the width of the parent <code>mj-section</code> (or 100%).</p>
</div>

Every single column has to contain something because they are responsive containers, and will be vertically stacked on a mobile view. Any standard component, or component that you have defined and registered, can be placed within a column – except `mj-column` or `mj-section` elements.

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

<div class="alert alert-caution" role="alert">
  <p>Caution</p>
  <p>Columns are used as a container for your content and should not be used to offset. Any MJML component included in a column will have a width equivalent to 100% of this column's width.</p>
</div>

<div class="alert alert-caution" role="alert">
  <p>Caution</p>
  <p>Neither the <code>mj-column</code> or <code>mj-section</code> tags can be nested in an <code>mj-column</code> tag</p>
</div>

#### Attributes

| attribute              | accepts                 | description                                                                              | default attributes                             |
| ---------------------- | ----------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------- |
| aria-label             | string                  | adds an `aria-label` attribute to the column container                                   |                                                |
| aria-roledescription   | string                  | adds an `aria-roledescription` attribute to the column container                         |                                                |
| background-color       | CSS color formats       | background color for a column                                                            |                                                |
| border                 | string                  | CSS border format                                                                        |                                                |
| border-bottom          | string                  | CSS border format                                                                        |                                                |
| border-left            | string                  | CSS border format                                                                        |                                                |
| border-radius          | string                  | border radius                                                                            |                                                |
| border-right           | string                  | CSS border format                                                                        |                                                |
| border-top             | string                  | CSS border format                                                                        |                                                |
| css-class              | string                  | class name, added to the root HTML element created                                       |                                                |
| direction              | `ltr` `rtl`             | set the display order of direct children                                                 |                                                |
| inner-background-color | CSS color formats       | inner background color for column; requires a padding                                    |                                                |
| inner-border           | string                  | CSS border; requires a padding format                                                    |                                                |
| inner-border-bottom    | string                  | CSS border format; requires a padding                                                    |                                                |
| inner-border-left      | string                  | CSS border format; requires a padding                                                    |                                                |
| inner-border-radius    | string                  | border radius ; requires a padding                                                       |                                                |
| inner-border-right     | string                  | CSS border format; requires a padding                                                    |                                                |
| inner-border-top       | string                  | CSS border format; requires a padding                                                    |                                                |
| padding                | `px` `%`                | column padding, supports up to 4 parameters                                              |                                                |
| padding-bottom         | `px` `%`                | column bottom padding                                                                    |                                                |
| padding-left           | `px` `%`                | column left padding                                                                      |                                                |
| padding-right          | `px` `%`                | column right padding                                                                     |                                                |
| padding-top            | `px` `%`                | column top padding                                                                       |                                                |
| role                   | string                  | adds a `role` attribute to the column container                                          |                                                |
| vertical-align         | `top` `middle` `bottom` | vertical alignment.<br>Note: `middle` only applies when all `mj-column` instances use it | `top`                                          |
| width                  | `px` `%`                | column width                                                                             | (100 / number of non-raw elements in section)% |

<p class="cta-container"><a class="cta" href="https://mjml.io/try-it-live/components/column">Try it live</a></p>

##### Modifiers

###### Dark-mode

| attribute                       | accepts           | description                                                       | default value |
| ------------------------------- | ----------------- | ----------------------------------------------------------------- | ------------- |
| background-color--dark          | CSS color formats | column background color in dark mode                              |               |
| border-color--dark              | CSS color formats | column border color in dark mode                                  |               |
| border-bottom-color--dark       | CSS color formats | column bottom border color in dark mode                           |               |
| border-left-color--dark         | CSS color formats | column left border color in dark mode                             |               |
| border-right-color--dark        | CSS color formats | column right border color in dark mode                            |               |
| border-top-color--dark          | CSS color formats | column top border color in dark mode                              |               |
| inner-background-color--dark    | CSS color formats | inner column background color in dark mode; requires a padding    |               |
| inner-border-color--dark        | CSS color formats | inner column border color in dark mode; requires a padding        |               |
| inner-border-bottom-color--dark | CSS color formats | inner column bottom border color in dark mode; requires a padding |               |
| inner-border-left-color--dark   | CSS color formats | inner column left border color in dark mode; requires a padding   |               |
| inner-border-right-color--dark  | CSS color formats | inner column right border color in dark mode; requires a padding  |               |
| inner-border-top-color--dark    | CSS color formats | inner column top border color in dark mode; requires a padding    |               |

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p>All <code>--dark</code> modifier attributes require <code>support-dark-mode="true"</code> to be set on the <code>&lt;mjml&gt;</code> tag to work effectively in all supported clients.</p>
</div>

###### Responsive

| attribute                  | accepts     | description                                                      | default value |
| -------------------------- | ----------- | ---------------------------------------------------------------- | ------------- |
| direction--responsive      | `ltr` `rtl` | set the display order of direct children                         |               |
| padding--responsive        | `px` `%`    | column padding, supports up to 4 parameters. See the note below. |               |
| padding-bottom--responsive | `px` `%`    | column bottom padding. See the note below.                       |               |
| padding-left--responsive   | `px` `%`    | column left padding. See the note below.                         |               |
| padding-right--responsive  | `px` `%`    | column right padding. See the note below.                        |               |
| padding-top--responsive    | `px` `%`    | column top padding. See the note below.                          |               |
| width--responsive          | `px` `%`    | column width                                                     |               |

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p>All responsive <code>padding</code> modifier attributes require a base <code>padding</code> to be set. This can be <code>padding="0"</code></p>
</div>
