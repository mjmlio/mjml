### mj-image

Displays a responsive image in your email. It is similar to the HTML `<img />` tag.

Note that if no width is provided, the image will use the parent column width.

```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image width="300px" src="https://static.mailjet.com/mjml-website/documentation/image.png" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

#### Attributes

| attribute                       | accepts                 | description                                                                     | default value         |
| ------------------------------- | ----------------------- | ------------------------------------------------------------------------------- | --------------------- |
| align                           | `left` `center` `right` | image alignment                                                                 | `center`              |
| alt                             | string                  | image description                                                               | `''`                  |
| border                          | string                  | CSS border format                                                               | `0`                   |
| border-bottom                   | string                  | CSS border format                                                               |                       |
| border-left                     | string                  | CSS border format                                                               |                       |
| border-radius                   | string                  | border radius                                                                   |                       |
| border-right                    | string                  | CSS border format                                                               |                       |
| border-top                      | string                  | CSS border format                                                               |                       |
| container-background-color      | CSS color formats       | inner element background color                                                  |                       |
| css-class                       | string                  | class name, added to the root HTML element created                              |                       |
| dark-border-color               | CSS color formats       | image border color in dark mode                                                 |                       |
| dark-border-bottom-color        | CSS color formats       | image bottom border color in dark mode                                          |                       |
| dark-border-left-color          | CSS color formats       | image left border color in dark mode                                            |                       |
| dark-border-right-color         | CSS color formats       | image right border color in dark mode                                           |                       |
| dark-border-top-color           | CSS color formats       | image top border color in dark mode                                             |                       |
| dark-container-background-color | CSS color formats       | inner element background color in dark mode                                     |                       |
| dark-src                        | string                  | image used for dark mode (set `support-dark-mode="true"` in `<mjml>` tag).      |                       |
| fluid-on-mobile                 | boolean                 | if `true`, will be full width on mobile even if `width` is set                  |                       |
| font-size                       | `px`                    | size of the alt text when image is not rendered                                 |                       |
| height                          | `px`                    | image height                                                                    | `auto`                |
| href                            | string                  | link to redirect to on click, in URL format                                     |                       |
| max-height                      | `px` `%`                | specify the maximum height of an image                                          |                       |
| name                            | string                  | specify the link name attribute                                                 |                       |
| padding                         | `px` `%`                | image padding, supports up to 4 parameters                                      | `10px 25px`           |
| padding-bottom                  | `px` `%`                | image bottom padding                                                            |                       |
| padding-left                    | `px` `%`                | image left padding                                                              |                       |
| padding-right                   | `px` `%`                | image right padding                                                             |                       |
| padding-top                     | `px` `%`                | image top padding                                                               |                       |
| rel                             | string                  | specify the rel attribute                                                       |                       |
| sizes                           | string                  | set width based on query                                                        |                       |
| src                             | string                  | image source in URL format                                                      |                       |
| srcset                          | string                  | enables to set a different image source based on the viewport, using CSS syntax |                       |
| support-dark-mode-image         | `outlook`               | enables dark-mode image support for New Outlook, Outlook App and Outlook.com    |                       |
| target                          | string                  | link target on click                                                            |                       |
| title                           | string                  | tooltip & accessibility                                                         |                       |
| usemap                          | string                  | reference to image map, be careful, it isn't supported everywhere               |                       |
| width                           | `px`                    | image width                                                                     | inherits parent width |

NOTE: All `dark-` prefixed attributes require `support-dark-mode="true"` to be set on the `<mjml>` tag to work effectively in all supported clients.

<p class="cta-container"><a class="cta" href="https://mjml.io/try-it-live/components/image">Try it live</a></p>
