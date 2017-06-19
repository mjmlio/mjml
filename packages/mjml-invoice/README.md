## mjml-invoice

<p align="center">
  <img width="300px" src="https://cloud.githubusercontent.com/assets/2217014/13403338/c81697b8-df14-11e5-8cfb-6e5b3e6b7ade.png" />
</p>

Display a table of items with calculated total price.

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column width="100%">
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

<p align="center">
  <a href="https://mjml.io/try-it-live/components/invoice">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

attribute                   | unit        | description                                           | default value
----------------            |-------------|-------------------------------------------------------|--------------
width                       | percent/px  | width of the invoice                                  | n/a
align                       | string      | left/center/right                                     | left
color                       | color       | text header & footer color                            | #b9b9b9
font-family                 | string      | font name                                             | Roboto, Ubuntu, Helvetica, Arial, sans-serif
font-size                   | px/em       | font size                                             | 13px
line-height                 | percent/px  | space between lines                                   | 22px
border                      | string      | border-bottom header & border-top footer              | 1px solid #ecedee
container-background-color  | color       | inner element background color                        | n/a
padding                     | px          | supports up to 4 parameters                           | 10px 25px
padding-top                 | px          | top offset                                            | n/a
padding-bottom              | px          | bottom offset                                         | n/a
padding-left                | px          | left offset                                           | n/a
padding-right               | px          | right offset                                          | n/a
intl                        | string      | formatted string to set wording for header and footer | "name:Name;quantity:Quantity;price:Price"
format   	                  | string      | how to format total price, based on [numeraljs](http://numeraljs.com/) | n/a
css-class                   | string      | class name, added to the root HTML element created    | n/a

### mjml-invoice-item

Display a row in an `mj-invoice` component

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
css-class       | string        | class name, added to the root HTML element created    | n/a
