## MJ-INLINE-LINKS

``` html

<mj-body>
  <mj-section>
      <mj-column width="600px">
        <mj-inline-links base-url="https://mjml.io">

        </mj-inline-links>
      </mj-column>
    </mj-section>
</mj-body>

```

To display some links horizontally

<p align="center">
  <a href="/try-it-live/"><img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" /></a>
</p>

There is a special mode called "hamburger", if activated the links are displayed on an interactive hamburger menu on mobile.

<aside class="notice">
The "hamburger" feature only work on mobile device with all iOS mail client, for others mail clients the render is performed on an normal way, the links are displayed inline and the hamburger is not visible.
</aside>

<aside class="notice">
All the attributes prefixed with ico- help to customize the hamburger icon. They require to activate the hamburger mode <code>hamburger="hamburger"</code>
</aside>

attribute                   | unit               | description                                                                    | default value
----------------------------|--------------------|--------------------------------------------------------------------------------|------------------------------
base url                    | string             | base url for children components                                               | n/a
hamburger                   | string             | activate the hamburger navigation on mobile if the value is hamburger          | n/a
align                       | string             | align content left/center/right                                                | center
ico-open                    | ASCII code decimal | char code for a custom open icon (only on hamburger mode)                      | 9776
ico-close                   | ASCII code decimal | char code for a custom close icon (only on hamburger mode)                     | 8855
ico-padding                 | px                 | hamburger icon padding, supports up to 4 parameters (only on hamburger mode)   | 10px
ico-padding-top             | px                 | hamburger icon top offset (only on hamburger mode)                             | 10px
ico-padding-right           | px                 | hamburger icon right offset (only on hamburger mode)                           | 10px
ico-padding-bottom          | px                 | hamburger icon bottom offset (only on hamburger mode)                          | 10px
ico-padding-left            | px                 | hamburger icon left offset (only on hamburger mode)                            | 10px
ico-align                   | string             | hamburger icon alignment, left/center/right                                    | center
ico-color                   | color format       | hamburger icon color                                                           | #000000
ico-font-size               | px                 | hamburger icon size                                                            | Ubuntu, Helvetica, Arial, sans-serif
ico-font-family             | string             | hamburger icon font                                                            | 30px
ico-text-transform          | string             | hamburger icon text transformation none/capitalize/uppercase/lowercase         | none
ico-text-decoration         | string             | hamburger icon text decoration none/underline/overline/line-through            | none
ico-line-height             | px                 | hamburger icon line height                                                     | 30px
