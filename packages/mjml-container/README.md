## mjml-container

```xml
<mjml>
  <mj-body>
    <mj-container>
      <!-- Your email goes here -->
    </mj-container>
  </mj-body>
</mjml>
```

This is the starting point of your email. It is a unique and mandatory component.
It corresponds to the HTML `<body>` tag.

Everything outside the `<mj-container>` will not be parsed by the engine.

<p align="center">
  <a href="/try-it-live/body"><img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" /></a>
</p>

attribute            | unit          | description                    | default value
---------------------|---------------|--------------------------------|---------------
width                | px            | email's width                  | 600px
background-color     | color formats | the general background color   | n/a
font-size            | px            | the general text size          | n/a
