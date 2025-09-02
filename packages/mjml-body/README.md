## mj-body

This is the starting point of your email. To aid accessibility, MJML automatically adds a `div` tag as the child of the body, with the following ARIA attributes `role="article"`, `aria-roledescription="email"` and `aria-label="EMAIL NAME"`, where 'EMAIL NAME' is taken from the content of the `mj-title` tag. The `lang` and `dir` attributes are also added here, with values taken from the `mjml` tag.

```xml
<mjml>
  <mj-body>
    <!-- Your email goes here -->
  </mj-body>
</mjml>
```

<p style="text-align: center;" >
  <a target="_blank" href="https://mjml.io/try-it-live/components/body">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>

<aside class="notice">
  mj-body replaces the couple mj-body and mj-container of MJML v3.
</aside>

attribute            | unit          | description                    | default value
---------------------|---------------|--------------------------------|---------------
background-color     | color formats | the general background color   | n/a
css-class            | string        | class name, added to the root HTML element created | n/a
width                | px            | email's width                  | 600px

