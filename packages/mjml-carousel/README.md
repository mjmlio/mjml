### mj-carousel

Displays a gallery of images or "carousel". Readers can interact by hovering and clicking on thumbnails depending on the email client they use.

<figure>
  <img src="https://static.mailjet.com/mjml-website/documentation/carousel-example.gif" alt="desktop" />
</figure>

```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel>
          <mj-carousel-image src="https://static.mailjet.com/mjml-website/documentation/carousel-1.jpg" />
          <mj-carousel-image src="https://static.mailjet.com/mjml-website/documentation/carousel-2.jpg" />
          <mj-carousel-image src="https://static.mailjet.com/mjml-website/documentation/carousel-3.jpg" />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

#### Attributes

| attribute                  | accepts                        | description                                                     | default value                     |
| -------------------------- | ------------------------------ | --------------------------------------------------------------- | --------------------------------- |
| align                      | `left` `center` `right`        | horizontal alignment                                            | `center`                          |
| aria-label                 | string                         | adds an `aria-label` attribute to the slide container           |                                   |
| aria-roledescription       | string                         | adds an `aria-roledescription` attribute to the slide container |                                   |
| border-radius              | string                         | border radius                                                   | `6px`                             |
| container-background-color | CSS color formats              | column background color                                         |                                   |
| css-class                  | string                         | class name, added to the root HTML element created              |                                   |
| icon-width                 | `px` `%`                       | width of the icons on left and right of the main image          | `44px`                            |
| left-icon                  | string                         | icon on the left of the main image                              | `https://i.imgur.com/xTh3hln.png` |
| padding                    | `px` `%`                       | carousel padding, supports up to 4 parameters                   |                                   |
| padding-bottom             | `px` `%`                       | carousel bottom padding                                         |                                   |
| padding-left               | `px` `%`                       | carousel left padding                                           |                                   |
| padding-right              | `px` `%`                       | carousel right padding                                          |                                   |
| padding-top                | `px` `%`                       | carousel top padding                                            |                                   |
| right-icon                 | string                         | icon on the right of the main image                             | `https://i.imgur.com/os7o9kz.png` |
| role                       | string                         | adds a `role` attribute to the slide container                  |                                   |
| support-dark-mode-image    | `outlook`                      | enables Outlook dark-mode support for carousel icons            |                                   |
| tb-border                  | string                         | border of the thumbnails in CSS border format                   | `2px solid transparent`           |
| tb-border-radius           | string                         | border-radius of the thumbnails                                 | `6px`                             |
| tb-hover-border-color      | CSS color formats              | border color of the hovered thumbnail                           | `#fead0d`                         |
| tb-selected-border-color   | CSS color formats              | border color of the selected thumbnail                          | `#ccc`                            |
| tb-width                   | `px` `%`                       | thumbnail width                                                 |                                   |
| thumbnails                 | `visible` `hidden` `supported` | display the thumbnails                                          | `hidden`                          |

<p class="cta-container"><a class="cta" href="https://mjml.io/try-it-live/components/carousel">Try it live</a></p>

##### Modifiers

###### Dark-mode

| attribute                        | accepts           | description                                         | default value |
| -------------------------------- | ----------------- | --------------------------------------------------- | ------------- |
| container-background-color--dark | CSS color formats | column background color in dark mode                |               |
| left-icon--dark                  | string            | dark-mode icon on the left of the main image        |               |
| right-icon--dark                 | string            | dark-mode icon on the right of the main image       |               |
| tb-border-color--dark            | CSS color formats | border color of the thumbnails in dark mode         |               |
| tb-hover-border-color--dark      | CSS color formats | border color of the hovered thumbnail in dark mode  |               |
| tb-selected-border-color--dark   | CSS color formats | border color of the selected thumbnail in dark mode |               |

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p>All <code>--dark</code> modifier attributes and <code>support-dark-image="outlook"</code> require <code>support-dark-mode="true"</code> to be set on the <code>&lt;mjml&gt;</code> tag to work effectively in all supported clients.</p>
</div>

#### mj-carousel-image

Enables you to add and style the images in the carousel.

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p><code>mj-carousel-image</code> is an "ending tag", which means that it can contain HTML code but it cannot contain other MJML components.</p>
  <p>More information about ending tags <a href="#ending-tags">in this section</a>.</p>
</div>

#### Attributes

| attribute               | accepts   | description                                                     | default value |
| ----------------------- | --------- | --------------------------------------------------------------- | ------------- |
| alt                     | string    | image description                                               | `''`          |
| aria-label              | string    | adds an `aria-label` attribute to the slide container           | `slide`       |
| aria-roledescription    | string    | adds an `aria-roledescription` attribute to the slide container | `X of X`      |
| border-radius           | string    | border radius of the main image                                 |               |
| css-class               | string    | class name, added to the root HTML element created              |               |
| href                    | string    | link to redirect to on click, <br>URL format                    |               |
| rel                     | string    | specify the rel attribute                                       |               |
| role                    | string    | adds a `role` attribute to the slide container                  | `group`       |
| src                     | string    | URL format                                                      |               |
| support-dark-mode-image | `outlook` | enables Outlook dark-mode support for carousel images           |               |
| target                  | string    | link target on click                                            |               |
| tb-border               | string    | CSS border format                                               |               |
| tb-border-radius        | string    | border radius of the thumbnail                                  |               |
| thumbnails-src          | string    | specify a different thumbnail image in URL format               |               |
| title                   | string    | tooltip & accessibility                                         |               |

##### Modifiers

###### Dark-mode

| attribute             | accepts           | description                                | default value |
| --------------------- | ----------------- | ------------------------------------------ | ------------- |
| src--dark             | string            | dark-mode main image in URL format         |               |
| tb-border-color--dark | CSS color formats | border color of the thumbnail in dark mode |               |
| thumbnails-src--dark  | string            | dark-mode thumbnail image in URL format    |               |

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p>All <code>--dark</code> modifier attributes require <code>support-dark-mode="true"</code> to be set on the <code>&lt;mjml&gt;</code> tag to work effectively in all supported clients.</p>
</div>
