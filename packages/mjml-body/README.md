### mj-body

This is the starting point of your email. To aid accessibility, MJML automatically adds a `div` tag as the child of the body, with the following ARIA attributes `role="article"`, `aria-roledescription="email"` and `aria-label="EMAIL NAME"`, where 'EMAIL NAME' is taken from the content of the `mj-title` tag. The `lang` and `dir` attributes are also added here, with values taken from the `mjml` tag.

```xml
<mjml>
  <mj-body>
    <!-- Your email goes here -->
  </mj-body>
</mjml>
```

#### Attributes

| attribute             | accepts           | description                                           | default value |
| --------------------- | ----------------- | ----------------------------------------------------- | ------------- |
| background-color      | CSS color formats | the general background color                          |               |
| css-class             | string            | class, added to the `body` tag in the generated HTML. |               |
| dark-background-color | CSS color formats | the background color in dark-mode                     |               |
| id                    | string            | id, added to the `body` tag in the generated HTML     |               |
| width                 | `px`              | email width                                           | `600px`       |

NOTE: All `dark-` prefixed attributes require `support-dark-mode="true"` to be set on the `<mjml>` tag to work effectively in all supported clients.

<p class="cta-container"><a class="cta" href="https://mjml.io/try-it-live/components/body">Try it live</a></p>
