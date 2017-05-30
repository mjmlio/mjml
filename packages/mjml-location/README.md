## mjml-location

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/2217014/13528219/d574b84c-e214-11e5-8504-f9cd250b65fa.png" />
</p>


Display a Google Maps location link

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-location address="37 bis, rue du Sentier 75002 Paris" />
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/location">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

attribute       | unit          | description                   | default value
----------------|---------------|-------------------------------|--------------
color           | color         | text color                    | #3aa7ed
font-family     | string        | font name                     | Roboto, sans-serif
font-size       | px/em         | font size                     | 18px
font-weight     | css weight    | font weight                   | 500
href            | string        | href link on image/text       | http://maps.google.com/maps?q=(mjAttribute: address)
rel             | string        | specify the rel attribute     | n/a
padding         | px            | supports up to 4 parameters   | 10px 25px
padding-top     | px            | top offset                    | n/a
padding-bottom  | px            | bottom offset                 | n/a
padding-left    | px            | left offset                   | n/a
padding-right   | px            | right offset                  | n/a
img-src         | string        | image source                  | http://i.imgur.com/DPCJHhy.png
css-class       | string        | class name, added to the root HTML element created | n/a
