### mj-spacer

Displays a blank space, that can be used to separate content.

```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>A first line of text</mj-text>
        <mj-spacer height="50px" />
        <mj-text>A second line of text</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

#### Attributes

| attribute                       | accepts           | description                                        | default value |
| ------------------------------- | ----------------- | -------------------------------------------------- | ------------- |
| container-background-color      | CSS color formats | inner element background color                     |               |
| css-class                       | string            | class name, added to the root HTML element created |               |
| dark-container-background-color | CSS color formats | the background color in dark-mode                  |               |
| height                          | `px` `%`          | spacer height                                      | `0px`         |
| padding                         | `px` `%`          | spacer padding, supports up to 4 parameters        |               |
| padding-bottom                  | `px` `%`          | bottom padding                                     |               |
| padding-left                    | `px` `%`          | left padding                                       |               |
| padding-right                   | `px` `%`          | right padding                                      |               |
| padding-top                     | `px` `%`          | top padding                                        |               |

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p>All <code>dark-</code> prefixed attributes require <code>support-dark-mode="true"</code> to be set on the <code>&lt;mjml&gt;</code> tag to work effectively in all supported clients.</p>
</div>

<p class="cta-container"><a class="cta" href="https://mjml.io/try-it-live/components/spacer">Try it live</a></p>
