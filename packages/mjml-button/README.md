## mj-button

<p style="text-align: center;" >
  <img src="https://cloud.githubusercontent.com/assets/6558790/12751346/fd993192-c9bc-11e5-8c91-37d616bf5874.png"
       alt="desktop" width="150px" />
</p>

Displays a customizable button.

<aside style="text-decoration: line-through">
  The `mj-button` won't be fully clickable because of client support.
  See discussion at
    <a href="https://github.com/mjmlio/mjml/issues/359">Issue #359</a>.
</aside>
<br>
<aside class="notice">
Notes for the Fixed previous <a href="https://github.com/mjmlio/mjml/issues/359">Issue #359</a> in discussion at <a href="https://github.com/mjmlio/mjml/issues/2565">Issue #2565</a>
  <ul>
    <li style="padding-bottom: 8px"><strong>in getStyles.td:</strong><br>Removed the mso-padding-alt as inner padding cause is no longer needed when the size of the button is controlled by the padding in the anchor. If I keep the MSO-attribute, the button will be shown as twice the size in MSO-PC.</li>
    <li style="padding-bottom: 8px"><strong>in getStyles.content:</strong><br>
    Removed the mso-padding-alt: 0px cause is nullifying the effect of activating the anchor as a button in MSO-PC. The padding in the anchor is now effectively creating the internal size of the button.</li>
    <li style="padding-bottom: 8px"><strong>Added border:</strong><br>1px solid which activates a "bug" in MSO-PC, forcing MSO to read the display attribute of the button (default: inline-block) and thus, changing the behavior of the anchor in MSO to act like a common anchor in all the other readers/browsers.</li>
    <li style="padding-bottom: 8px">To avoid non-corresponding colours between the background of the container TD and the border created in the anchor, I added the this.getAttribute('background-color') property to the style, aligning both colours, minimizing the unwilling mismatching.</li>
  </ul>
</aside>

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

<p style="text-align: center;" >
  <a href="https://mjml.io/try-it-live/components/button">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>

<aside class="notice">
  `mj-button` is an "ending tag", which means it can contain HTML code which will be left as it is, so it can contain HTML tags with attributes, but it cannot contain other MJML components. More information about ending tags <a href="#ending-tags">in this section</a>.
</aside>


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
letter-spacing              | px,em       | letter-spacing                                   | n/a
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
title                       | string      | tooltip & accessibility                          | n/a
vertical-align              | string      | vertical alignment                               | middle
width                       | px          | button width                                     | n/a
