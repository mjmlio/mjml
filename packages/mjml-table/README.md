### mj-table

Display a data table. It only accepts plain HTML.

```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-table>
          <tr style="border-bottom:1px solid #ecedee;text-align:left;padding:15px 0;">
            <th style="padding: 0 15px 0 0;">Year</th>
            <th style="padding: 0 15px;">Language</th>
            <th style="padding: 0 0 0 15px;">Inspired from</th>
          </tr>
          <tr>
            <td style="padding: 0 15px 0 0;">1995</td>
            <td style="padding: 0 15px;">PHP</td>
            <td style="padding: 0 0 0 15px;">C, Shell Unix</td>
          </tr>
          <tr>
            <td style="padding: 0 15px 0 0;">1995</td>
            <td style="padding: 0 15px;">JavaScript</td>
            <td style="padding: 0 0 0 15px;">Scheme, Self</td>
          </tr>
        </mj-table>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p><code>mj-table</code> is an "ending tag", which means that it can contain HTML code but it cannot contain other MJML components. Therefore, it will accept any tag you would add inside an HTML table tag.</p>
  <p>More information about ending tags <a href="#ending-tags">in this section</a>.</p>
</div>

#### Attributes

| attribute                  | accepts                            | description                                           | default value        |
| -------------------------- | ---------------------------------- | ----------------------------------------------------- | -------------------- |
| align                      | `left` `right` `center`            | table horizontal alignment                            | `left`               |
| aria-label                 | string                             | adds an `aria-label` attribute to the table           |                      |
| aria-roledescription       | string                             | adds an `aria-roledescription` attribute to the table |                      |
| border                     | string                             | CSS border format                                     | `none`               |
| cellpadding                | integer                            | space between cells                                   | `0`                  |
| cellspacing                | integer                            | space between cell and border                         | `0`                  |
| color                      | CSS color formats                  | text header & footer color                            | `#000000`            |
| container-background-color | CSS color formats                  | background color of the container                     |                      |
| container-border-radius    | string                             | border radius of the container                        |                      |
| css-class                  | string                             | class name, added to the root HTML element created    |                      |
| font-family                | string                             | font name                                             | `Ubuntu, sans-serif` |
| font-size                  | `px` `rem`                         | font size                                             | `16px`               |
| line-height                | `px` `%` `em` `rem`                | space between lines                                   | `150%`               |
| padding                    | `px` `%`                           | outer table padding, supports up to 4 parameters      | `10px 25px`          |
| padding-bottom             | `px` `%`                           | bottom padding                                        |                      |
| padding-left               | `px` `%`                           | left padding                                          |                      |
| padding-right              | `px` `%`                           | right padding                                         |                      |
| padding-top                | `px` `%`                           | top padding                                           |                      |
| responsive-mode            | `stack` `scroll`                   | layout options for the table below the breakpoint     |                      |
| role                       | `none` `presentation` `table`      | specify the role attribute                            |                      |
| table-layout               | `auto` `fixed` `initial` `inherit` | sets the table layout                                 |                      |
| width                      | `px` `%` `auto`                    | table width                                           | `100%`               |

<div class="alert alert-caution" role="alert">
  <p>Caution</p>
  <p><code>responsive-mode="stack"</code> is only supported in email clients with full CSS support (Mac Mail/iOS Mail). It works best with a simple table where the first row uses <code>&lt;th&gt;</code> elements as column headers. See example:</p>
</div>

```xml
<mj-table responsive-mode="stack" border="1px solid grey" cellpadding="10">
          <caption>Caption</caption>
          <tr style="border-bottom: 1px solid grey;text-align:left;">
            <th>Year</th>
            <th>Language</th>
            <th>Inspired from</th>
          </tr>
          <tr style="border-bottom: 1px solid grey;">
            <td>1995</td>
            <td>PHP</td>
            <td>C, Shell Unix</td>
          </tr>
          <tr style="border-bottom: 1px solid grey;">
            <td>1995</td>
            <td>JavaScript</td>
            <td>Scheme, Self</td>
          </tr>
        </mj-table>
```

<p class="cta-container"><a class="cta" href="https://mjml.io/try-it-live/components/table">Try it live</a></p>

##### Modifiers

###### Dark-mode

| attribute                        | accepts           | description                                    | default value |
| -------------------------------- | ----------------- | ---------------------------------------------- | ------------- |
| border-color--dark               | CSS color formats | table border color in dark mode                |               |
| color--dark                      | CSS color formats | text header & footer color in dark mode        |               |
| container-background-color--dark | CSS color formats | background color of the container in dark-mode |               |

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p>All <code>--dark</code> modifier attributes require <code>support-dark-mode="true"</code> to be set on the <code>&lt;mjml&gt;</code> tag to work effectively in all supported clients.</p>
</div>

###### Responsive

| attribute                  | accepts                 | description                                      | default value |
| -------------------------- | ----------------------- | ------------------------------------------------ | ------------- |
| align--responsive          | `left` `right` `center` | table horizontal alignment                       |               |
| font-size--responsive      | `px` `rem`              | font size                                        |               |
| line-height--responsive    | `px` `%` `em` `rem`     | space between lines                              |               |
| padding--responsive        | `px` `%`                | outer table padding, supports up to 4 parameters |               |
| padding-bottom--responsive | `px` `%`                | bottom padding                                   |               |
| padding-left--responsive   | `px` `%`                | left padding                                     |               |
| padding-right--responsive  | `px` `%`                | right padding                                    |               |
| padding-top--responsive    | `px` `%`                | top padding                                      |               |
| width--responsive          | `px` `%`                | table width                                      |               |
