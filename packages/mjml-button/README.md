## mjml-button

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/6558790/12751346/fd993192-c9bc-11e5-8c91-37d616bf5874.png" alt="desktop" width="150px" />
</p>

Displays a customizable button.

```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-button font-family="Helvetica" background-color="#f45e43" color="white">
          Don't click me!
         </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/button">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>

attribute                   | unit        | description                                      | default value
----------------------------|-------------|--------------------------------------------------|---------------------
align                       | string      | horizontal alignment                             | center
background-color            | color       | button background-color                          | #414141
border                      | string      | css border format                                | none
border-bottom               | string      | css border format                                | n/a
border-left                 | string      | css border format                                | n/a
border-radius               | px          | border radius                                    | 3px
border-right                | string      | css border format                                | n/a
border-top                  | string      | css border format                                | n/a
color                       | color       | text color                                       | #ffffff
container-background-color  | color       | button container background color                | n/a
css-class                   | string      | class name, added to the root HTML element created | n/a
font-family                 | string      | font name                                        | Ubuntu, Helvetica, Arial, sans-serif
font-size                   | px          | text size                                        | 13px
font-style                  | string      | normal/italic/oblique                            | n/a
font-weight                 | number      | text thickness                                   | normal
height                      | px          | button height                                    | n/a
href                        | link        | link to be triggered when the button is clicked  | n/a
inner-padding               | px          | inner button padding                             | 10px 25px
line-height                 | px/%/none   | line-height on link                              | 120%
padding                     | px          | supports up to 4 parameters                      | 10px 25px
padding-bottom              | px          | bottom offset                                    | n/a
padding-left                | px          | left offset                                      | n/a
padding-right               | px          | right offset                                     | n/a
padding-top                 | px          | top offset                                       | n/a
rel                         | string      | specify the rel attribute for the button link    | n/a
target                      | string      | specify the target attribute for the button link | \_blank
text-align                  | string      | text-align button content                        | none
text-decoration             | string      | underline/overline/none                          | none
text-transform              | string      | capitalize/uppercase/lowercase                   | none
vertical-align              | string      | vertical alignment                               | middle
width                       | px          | button width                                     | n/a

