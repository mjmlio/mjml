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

| attribute                  | accepts                 | description                                                                                                                                   | default value         |
| -------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| align                      | `left` `center` `right` | image alignment                                                                                                                               | `center`              |
| alt                        | string                  | image description                                                                                                                             | `''`                  |
| aria-hidden                | string                  | when set to `true` adds an `aria-hidden` attribute to the rendered image or `aria-hidden` and `tabindex` to the parent `<a>` if `href` is set |                       |
| border                     | string                  | CSS border format                                                                                                                             | `0`                   |
| border-bottom              | string                  | CSS border format                                                                                                                             |                       |
| border-left                | string                  | CSS border format                                                                                                                             |                       |
| border-radius              | string                  | border radius                                                                                                                                 |                       |
| border-right               | string                  | CSS border format                                                                                                                             |                       |
| border-top                 | string                  | CSS border format                                                                                                                             |                       |
| container-background-color | CSS color formats       | background color of the container                                                                                                             |                       |
| container-border-radius    | string                  | border radius of the container                                                                                                                |                       |
| css-class                  | string                  | class name, added to the root HTML element created                                                                                            |                       |
| fluid-on-mobile            | boolean                 | if `true`, will be full width on mobile even if `width` is set                                                                                |                       |
| font-size                  | `px` `rem`              | size of the alt text when image is not rendered                                                                                               | `16px`                |
| height                     | `px`                    | image height                                                                                                                                  | `auto`                |
| href                       | string                  | link to redirect to on click, in URL format                                                                                                   |                       |
| max-height                 | `px` `%`                | specify the maximum height of an image                                                                                                        |                       |
| name                       | string                  | specify the link name attribute                                                                                                               |                       |
| padding                    | `px` `%`                | hero padding, supports up to 4 parameters                                                                                                     | `10px 25px`           |
| padding-bottom             | `px` `%`                | hero bottom padding                                                                                                                           |                       |
| padding-left               | `px` `%`                | hero left padding                                                                                                                             |                       |
| padding-right              | `px` `%`                | hero right padding                                                                                                                            |                       |
| padding-top                | `px` `%`                | hero top padding                                                                                                                              |                       |
| rel                        | string                  | specify the rel attribute                                                                                                                     |                       |
| sizes                      | string                  | set width based on query                                                                                                                      |                       |
| src                        | string                  | image source in URL format                                                                                                                    |                       |
| srcset                     | string                  | enables to set a different image source based on the viewport, using CSS syntax                                                               |                       |
| support-dark-mode-image    | `outlook`               | enables dark-mode image support for New Outlook, Outlook App and Outlook.com                                                                  |                       |
| target                     | string                  | link target on click                                                                                                                          |                       |
| title                      | string                  | tooltip & accessibility                                                                                                                       |                       |
| usemap                     | string                  | reference to image map, be careful, it isn't supported everywhere                                                                             |                       |
| width                      | `px`                    | image width                                                                                                                                   | inherits parent width |

<p class="cta-container"><a class="cta" href="https://mjml.io/try-it-live/components/image">Try it live</a></p>

##### Modifiers

###### Dark-mode

| attribute                        | accepts           | description                                                                | default value |
| -------------------------------- | ----------------- | -------------------------------------------------------------------------- | ------------- |
| border-color--dark               | CSS color formats | image border color in dark mode                                            |               |
| border-bottom-color--dark        | CSS color formats | image bottom border color in dark mode                                     |               |
| border-left-color--dark          | CSS color formats | image left border color in dark mode                                       |               |
| border-right-color--dark         | CSS color formats | image right border color in dark mode                                      |               |
| border-top-color--dark           | CSS color formats | image top border color in dark mode                                        |               |
| container-background-color--dark | CSS color formats | background color of the container in dark mode                             |               |
| src--dark                        | string            | image used for dark mode (set `support-dark-mode="true"` in `<mjml>` tag). |               |

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p>All <code>--dark</code> modifier attributes and <code>support-dark-mode-image="outlook"</code> require <code>support-dark-mode="true"</code> to be set on the <code>&lt;mjml&gt;</code> tag to work effectively in all supported clients.</p>
</div>

###### Responsive

| attribute                  | accepts                 | description                                     | default value |
| -------------------------- | ----------------------- | ----------------------------------------------- | ------------- |
| align--responsive          | `left` `center` `right` | image alignment                                 |               |
| font-size--responsive      | `px` `rem`              | size of the alt text when image is not rendered |               |
| height--responsive         | `px` `auto`             | image height                                    |               |
| max-height--responsive     | `px` `%`                | specify the maximum height of an image          |               |
| padding--responsive        | `px` `%`                | image padding, supports up to 4 parameters      |               |
| padding-bottom--responsive | `px` `%`                | image bottom padding                            |               |
| padding-left--responsive   | `px` `%`                | image left padding                              |               |
| padding-right--responsive  | `px` `%`                | image right padding                             |               |
| padding-top--responsive    | `px` `%`                | image top padding                               |               |
| width--responsive          | `px` `%`                | image width                                     |               |

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p>Yahoo (iOS / Android) converts <code>height--responsive</code> declaration to a <code>min-height</code> in CSS. This can be fixed by adding the same value in <code>max-height--responsive</code> declaration.</p>
</div>
