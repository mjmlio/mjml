## mjml-container

This is the starting point of your email.

```xml
<mjml>
  <mj-body>
    <mj-container>
      <!-- Your email goes here -->
    </mj-container>
  </mj-body>
</mjml>
```

<p align="center">
  <a target="_blank" href="/try-it-live/components/container">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>

<aside class="notice">
  MJ-Container was MJ-Body in 1.X
</aside>

attribute            | unit          | description                    | default value
---------------------|---------------|--------------------------------|---------------
width                | px            | email's width                  | 600px
background-color     | color formats | the general background color   | n/a
css-class | string | class name, added to the root HTML element created | n/a
