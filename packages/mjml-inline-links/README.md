## mjml-inline-links

Standard Desktop:

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/1830348/15317906/d6cef510-1c23-11e6-83d7-31e4e4f8ba2a.png" width="800px" />
</p>

Standard Mobile:

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/1830348/15317917/e514d0a4-1c23-11e6-8e5a-c23da9ac1d4e.png" width="318px" />
</p>

Mode hamburger enabled:

<aside class="notice">
  The "hamburger" feature only work on mobile device with all iOS mail client, for others mail clients the render is performed on an normal way, the links are displayed inline and the hamburger is not visible.
</aside>

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

To display some links horizontally

<p align="center">
  <a href="https://mjml.io/try-it-live/component/inline-links">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

<aside class="notice">
  All the attributes prefixed with <code>ico-</code> help to customize the hamburger icon. They only work with the hamburger mode enabled.
</aside>

attribute                   | unit               | description                                                                                      | default value
----------------------------|--------------------|--------------------------------------------------------------------------------------------------|-----------------
base url                    | string             | base url for children components                                                                 | n/a
hamburger                   | string             | activate the hamburger navigation on mobile if the value is hamburger                            | n/a
align                       | string             | align content left/center/right                                                                  | center
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
ico-text-transform          | string             | hamburger icon text transformation none/capitalize/uppercase/lowercase (hamburger mode required) | none
ico-text-decoration         | string             | hamburger icon text decoration none/underline/overline/line-through (hamburger mode required)    | none
ico-line-height             | px                 | hamburger icon line height (hamburger mode required)                                             | 30px
