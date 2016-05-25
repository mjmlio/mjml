## mjml-link

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
  <a href="https://mjml.io/try-it-live/component/link">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

<aside class="notice">
  All the mj-link components must be wrapped in a component mj-inline-links
</aside>

attribute        | unit          | description                    | default value
-----------------|---------------|--------------------------------|------------------------------
color            | color         | text color                     | #000000
font-family      | string        | font                           | Ubuntu, Helvetica, Arial, sans-serif
font-size        | px            | text size                      | 13px
font-style       | string        | normal/italic/oblique          | n/a
font-weight      | number        | text thickness                 | n/a
line-height      | px            | space between the lines        | 22px
text-decoration  | string        | underline/overline/none        | n/a
padding          | px            | supports up to 4 parameters    | 10px 25px
padding-top      | px            | top offset                     | n/a
padding-bottom   | px            | bottom offset                  | n/a
padding-left     | px            | left offset                    | n/a
padding-right    | px            | right offset                   | n/a
