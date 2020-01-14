## mjml-image

Displays a responsive image in your email. It is similar to the HTML `<img />` tag.
Note that if no width is provided, the image will use the parent column width.

```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image width="300px" src="http://www.online-image-editor.com//styles/2014/images/example_image.png" />
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/image">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>


attribute                     | unit          | description                    | default value
------------------------------|---------------|--------------------------------|-----------------------------
align                         | position      | image alignment                | center
alt                           | string        | image description              | n/a
border                        | string        | css border definition          | none
border-radius                 | px            | border radius                  | n/a
container-background-color    | color         | inner element background color | n/a
css-class                     | string        | class name, added to the root HTML element created | n/a
fluid-on-mobile               | string        | if "true", will be full width on mobile even if width is set | n/a
height                        | px            | image height                   | auto
href                          | url           | link to redirect to on click   | n/a
padding                       | px            | supports up to 4 parameters    | 10px 25px
padding-bottom                | px            | bottom offset                  | n/a
padding-left                  | px            | left offset                    | n/a
padding-right                 | px            | right offset                   | n/a
padding-top                   | px            | top offset                     | n/a
rel                           | string        | specify the rel attribute      | n/a
src                           | url           | image source                   | n/a
srcset                        | url & width   | enables to set a different image source based on the viewport | n/a
target                        | string        | link target on click           | \_blank
title                         | string        | tooltip & accessibility        | n/a
width                         | px            | image width                    | 100%

