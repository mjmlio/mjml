## mjml-button

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/6558790/12751346/fd993192-c9bc-11e5-8c91-37d616bf5874.png" alt="desktop" width="150px" />
</p>

Displays a customizable button.

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-button font-family="Helvetica" background-color="#f45e43" color="white">
            Don't click me!
          </mj-button>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/component/button">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

attribute                   | unit        | description                                      | default value
----------------------------|-------------|--------------------------------------------------|---------------------
background-color            | color       | button background-color                          | #414141
container-background-color  | color       | button container background color                | n/a
border-radius               | px          | border radius                                    | 3px
font-style                  | string      | normal/italic/oblique                            | n/a
font-size                   | px          | text size                                        | 13px
font-weight                 | number      | text thickness                                   | bold
font-family                 | string      | font name                                        | Ubuntu, Helvetica, Arial, sans-serif
color                       | color       | text color                                       | #ffffff
border                      | string      | css border format                                | none
text-decoration             | string      | underline/overline/none                          | none
text-transform              | string      | capitalize/uppercase/lowercase                   | none
align                       | string      | horizontal alignment                             | center
vertical-align              | string      | vertical alignment                               | middle
href                        | link        | link to be triggered when the button is clicked  | n/a
padding                     | px          | supports up to 4 parameters                      | 15px 25px
padding-top                 | px          | top offset                                       | n/a
padding-bottom              | px          | bottom offset                                    | n/a
padding-left                | px          | left offset                                      | n/a
padding-right               | px          | right offset                                     | n/a
