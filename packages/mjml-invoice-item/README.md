## mjml-invoice-item

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-invoice format="0,00.00€" intl="name:Product Name">
            <mj-invoice-item name="TV" price="549€" quantity="1" />
            <mj-invoice-item name="DVD - Iron Man II" price="22.99€" quantity="2" />
          </mj-invoice>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```

Display a row in an `mj-invoice` component

attribute       | unit          | description                                           | default value
----------------|---------------|-------------------------------------------------------|--------------
color           | color         | text color                                            | #747474
font-family     | string        | font name                                             | Roboto, Ubuntu, Helvetica, Arial, sans-serif
font-size       | px/em         | font size                                             | 14px
line-height     | percent/px    | space between lines                                   | 22px
border          | string        | border-bottom header & border-top footer              | 1px solid #ecedee
text-align      | string        | css text align                                        | left (quantity column: right)
padding         | px            | supports up to 4 parameters                           | 10px 25px
padding-top     | px            | top offset                                            | n/a
padding-bottom  | px            | bottom offset                                         | n/a
padding-left    | px            | left offset                                           | n/a
padding-right   | px            | right offset                                          | n/a
name            | string        | item name                                             | n/a
price           | string/number | price (should already be formatted)                   | 0
quantity        | number        | quantity                                              | 0
