## MJ-INVOICE

<p align="center">
<img width="300px" src="https://cloud.githubusercontent.com/assets/2217014/13403338/c81697b8-df14-11e5-8cfb-6e5b3e6b7ade.png" style="width: 250px; padding: 25px;" />
</p>

``` html

<mjml>
  <mj-body>
    <mj-invoice format="0,00.00â‚¬" intl="name:Product Name">
      <mj-invoice-item name="TV" price="549â‚¬" quantity="1" />
      <mj-invoice-item name="DVD - Iron Man II" price="22.99â‚¬" quantity="2" />
    </mj-invoice>    
  </mj-body>
</mjml>

```
Display a table of items with calculated total price.

attribute       | unit        | description                                           | default value
----------------|-------------|-------------------------------------------------------|--------------
color           | color       | text header & footer color                            | #b9b9b9
font-family     | string      | font name                                             | Roboto, Ubuntu, Helvetica, Arial, sans-serif
font-size       | px/em       | font size                                             | 13px
line-height     | percent/px  | space between lines                                   | 22px
border          | string      | border-bottom header & border-top footer              | 1px solid #ecedee
padding         | px          | supports up to 4 parameters                           | 10px 25px
padding-top     | px          | top offset                                            | n/a
padding-bottom  | px          | bottom offset                                         | n/a
padding-left    | px          | left offset                                           | n/a
padding-right   | px          | right offset                                          | n/a
intl            | string      | formatted string to set wording for header and footer | "name:Name;quantity:Quantity;price:Price"
format   	      | string      | how to format total price, based on [numeraljs](http://numeraljs.com/) | n/a
