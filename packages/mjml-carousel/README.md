## mjml-carousel

<p align="center">
  <img src="http://i.imgur.com/wHqIzgd.gif" alt="desktop" />
</p>

`mjml-carousel` displays a gallery of images or "carousel". Readers can interact by hovering and clicking on thumbnails depending on the email client they use.

This component enables you to set the styles of the carousel elements.

```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-carousel>
          <mj-carousel-image src="https://www.mailjet.com/wp-content/uploads/2016/11/ecommerce-guide.jpg" />
          <mj-carousel-image src="https://www.mailjet.com/wp-content/uploads/2016/09/3@1x.png" />
          <mj-carousel-image src="https://www.mailjet.com/wp-content/uploads/2016/09/1@1x.png" />
        </mj-carousel>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/carousel">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>


attribute | unit | description | default value
----------|------|-------------|---------------
align | string | horizontal alignment | center
border-radius | px | border radius | n/a
background-color | string | column background color | none
thumbnails | String | display or not the thumbnails (visible | hidden)
tb-border | css border format | border of the thumbnails | none
tb-border-radius | px | border-radius of the thumbnails | none
tb-hover-border-color | string | css border color of the hovered thumbnail | none
tb-selected-border-color | string | css border color of the selected thumbnail | none
tb-width | px | thumbnail width | null
left-icon | url | icon on the left of the main image | https://mjml.io/assets/img/left-arrow.png
right-icon | url | icon on the right of the main image | https://mjml.io/assets/img/right-arrow.png
icon-width | px | width of the icons on left and right of the main image | 44px
css-class | string | class name, added to the root HTML element created | n/a

### mjml-carousel-image

This component enables you to add and style the images in the carousel.

attribute | unit | description | default value
----------|------|-------------|---------------
src | url | image source | n/a
thumbnails-src | url | image source to have a thumbnail different than the image it's linked to | null
href | url | link to redirect to on click | n/a
target | string | link target on click | \_blank
rel | string | specify the rel attribute | n/a
alt | string | image description | n/a
title | string | tooltip & accessibility | n/a
css-class | string | class name, added to the root HTML element created | n/a
