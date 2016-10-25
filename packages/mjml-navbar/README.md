## mjml-navbar

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/1830348/15317906/d6cef510-1c23-11e6-83d7-31e4e4f8ba2a.png" width="800px" />
</p>

Displays a full width section for navigation

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-navbar background-color="#ef6451">
        <mj-column width="20%">
          <mj-image width="150px" src="https://mjml.io/assets/img/logo-white-small.png"></mj-image>
        </mj-column>
        <mj-column width="80%">
          <mj-inline-links base-url="https://mjml.io">
            <mj-link href="/gettings-started-onboard" color="#ffffff">Getting started</mj-link>
            <mj-link href="/try-it-live" color="#ffffff">Try it live</mj-link>
            <mj-link href="/templates" color="#ffffff">Templates</mj-link>
            <mj-link href="/components" color="#ffffff">Components</mj-link>
            <mj-link href="/documentation" color="#ffffff">Documentation</mj-link>
          </mj-inline-links>
        </mj-column>
      </mj-navbar>
    </mj-container>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/navbar">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

attribute           | unit        | description                    | default value
--------------------|-------------|--------------------------------|---------------
full-width          | string      | make the section full-width    | n/a
border              | string      | css border format              | none
border-bottom       | string      | css border format              | n/a
border-left         | string      | css border format              | n/a
border-right        | string      | css border format              | n/a
border-top          | string      | css border format              | n/a
border-radius       | px          | border radius                  | n/a
background-color    | color       | section color                  | n/a
background-url      | url         | background url                 | n/a
background-repeat   | string      | css background repeat          | repeat
background-size     | percent/px  | css background size            | auto
vertical-align      | string      | css vertical-align             | top
text-align          | string      | css text-align                 | center
padding             | px          | supports up to 4 parameters    | 10px 25px
padding-top         | px          | section top offset             | n/a
padding-bottom      | px          | section bottom offset          | n/a
padding-left        | px          | section left offset            | n/a
padding-right       | px          | section right offset           | n/a

### mjml-inline-links

To display some links horizontally

Standard Desktop:

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/1830348/15317906/d6cef510-1c23-11e6-83d7-31e4e4f8ba2a.png" width="800px" />
</p>

Standard Mobile:

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/1830348/15317917/e514d0a4-1c23-11e6-8e5a-c23da9ac1d4e.png" width="318px" />
</p>

Mode hamburger enabled:

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/1830348/15317922/f01c5c24-1c23-11e6-9b0c-95b0602da260.gif" width="309px" />
</p>

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-navbar background-color="#ef6451">
        <mj-column width="20%">
          <mj-image width="150px" src="https://mjml.io/assets/img/logo-white-small.png"></mj-image>
        </mj-column>
        <mj-column width="80%">
          <mj-inline-links base-url="https://mjml.io">
            <mj-link href="/gettings-started-onboard" color="#ffffff">Getting started</mj-link>
            <mj-link href="/try-it-live" color="#ffffff">Try it live</mj-link>
            <mj-link href="/templates" color="#ffffff">Templates</mj-link>
            <mj-link href="/components" color="#ffffff">Components</mj-link>
            <mj-link href="/documentation" color="#ffffff">Documentation</mj-link>
          </mj-inline-links>
        </mj-column>
      </mj-navbar>
    </mj-container>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/navbar/1">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

<aside class="notice">
  The "hamburger" feature only work on mobile device with all iOS mail client, for others mail clients the render is performed on an normal way, the links are displayed inline and the hamburger is not visible.
</aside>

<aside class="notice">
  All the attributes prefixed with <code>ico-</code> help to customize the hamburger icon. They only work with the hamburger mode enabled.
</aside>

attribute                   | unit               | description                                                                                      | default value
----------------------------|--------------------|--------------------------------------------------------------------------------------------------|-----------------
base url                    | string             | base url for children components                                                                 | n/a
hamburger                   | string             | activate the hamburger navigation on mobile if the value is hamburger                            | n/a
align                       | string             | align content left/center/right                                                                  | center
ico-open                    | ASCII code decimal | char code for a custom open icon (hamburger mode required)                                       | 9776
ico-close                   | ASCII code decimal | char code for a custom close icon (hamburger mode required)                                      | 8855
ico-padding                 | px                 | hamburger icon padding, supports up to 4 parameters (hamburger mode required)                    | 10px
ico-padding-top             | px                 | hamburger icon top offset (hamburger mode required)                                              | 10px
ico-padding-right           | px                 | hamburger icon right offset (hamburger mode required)                                            | 10px
ico-padding-bottom          | px                 | hamburger icon bottom offset (hamburger mode required)                                           | 10px
ico-padding-left            | px                 | hamburger icon left offset (hamburger mode required)                                             | 10px
ico-align                   | string             | hamburger icon alignment, left/center/right (hamburger mode required)                            | center
ico-color                   | color format       | hamburger icon color (hamburger mode required)                                                   | #000000
ico-font-size               | px                 | hamburger icon size (hamburger mode required)                                                    | Ubuntu, Helvetica, Arial, sans-serif
ico-font-family             | string             | hamburger icon font (only on hamburger mode)                                                     | 30px
ico-text-transform          | string             | hamburger icon text transformation none/capitalize/uppercase/lowercase (hamburger mode required) | none
ico-text-decoration         | string             | hamburger icon text decoration none/underline/overline/line-through (hamburger mode required)    | none
ico-line-height             | px                 | hamburger icon line height (hamburger mode required)                                             | 30px

### mjml-link

```xml
<mjml>
  <mj-body>
    <mj-container>
      <!-- Navbar (see component mj-navbar) -->
      <mj-navbar>
        <mj-column>
          <!-- Wrapper (see component mj-inline-links) -->
          <mj-inline-links base-url="https://mjml.io">
            <mj-link href="/getting-started-onboard">Getting started</mj-link>
            <mj-link href="/try-it-live">Try it live</mj-link>
            <mj-link href="/documentation">Documentation</mj-link>
          </mj-inline-links>
        </mj-column>
      </mj-navbar>
    </mj-container>
  </mj-body>
</mjml>
```

Displays a horizontal navbar.

<p align="center">
  <a href="https://mjml.io/try-it-live/components/link">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

<aside class="notice">
  All the mj-link components must be wrapped in a component mj-inline-links
</aside>

attribute        | unit          | description                           | default value
-----------------|---------------|---------------------------------------|------------------------------
color            | color         | text color                            | #000000
font-family      | string        | font                                  | Ubuntu, Helvetica, Arial, sans-serif
font-size        | px            | text size                             | 13px
font-style       | string        | normal/italic/oblique                 | n/a
font-weight      | number        | text thickness                        | n/a
line-height      | px            | space between the lines               | 22px
text-decoration  | string        | underline/overline/none               | n/a
text-transform   | string        | capitalize/uppercase/lowercase/none   | uppercase
padding          | px            | supports up to 4 parameters           | 10px 25px
padding-top      | px            | top offset                            | n/a
padding-bottom   | px            | bottom offset                         | n/a
padding-left     | px            | left offset                           | n/a
padding-right    | px            | right offset                          | n/a
