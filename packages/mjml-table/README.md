## mjml-table

This tag allows you to display table and filled it with data. It only accepts plain HTML.

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

<p align="center">
  <a href="https://mjml.io/try-it-live/components/table">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>

attribute                   | unit                        | description                    | default value
----------------------------|-----------------------------|------------------------------- |--------------
color                       | color                       | text header & footer color     | #000
cellpadding                 | pixels                      | space between cells            | n/a
cellspacing                 | pixels                      | space between cell and border  | n/a
font-family                 | string                      | font name                      | Ubuntu, Helvetica, Arial, sans-serif
font-size                   | px/em                       | font size                      | 13px
line-height                 | percent/px                  | space between lines            | 22px
container-background-color  | color                       | inner element background color | n/a
padding                     | px                          | supports up to 4 parameters    | 10px 25px
padding-top                 | px                          | top offset                     | n/a
padding-bottom              | px                          | bottom offset                  | n/a
padding-left                | px                          | left offset                    | n/a
padding-right               | px                          | right offset                   | n/a
width                       | percent/px                  | table width                    | 100%
table-layout                | auto/fixed/initial/inherit  | sets the table layout.         | auto
