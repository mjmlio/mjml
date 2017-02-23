## mjml-wrapper

Wrapper enables to wrap multiple sections together. It's especially useful to achieve a layout where sections share a similar background or are wrapped in borders.

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-wrapper full-width="full-width" background-color="red">
        <!-- Your sections go here -->
      </mj-wrapper>
    </mj-container>   
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/wrapper">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

The `full-width` property will be used to manage the background width.
By default, it will be 600px. With the `full-width` property on, it will be
changed to 100%.

attribute           | unit        | description                    | default value
--------------------|-------------|--------------------------------|---------------
full-width          | string      | make the wrapper full-width    | n/a
border              | string      | css border format              | none
border-bottom       | string      | css border format              | n/a
border-left         | string      | css border format              | n/a
border-right        | string      | css border format              | n/a
border-top          | string      | css border format              | n/a
border-radius       | px          | border radius                  | n/a
background-color    | color       | section color                  | n/a
background-url      | url         | background url                 | n/a
background-repeat   | string      | css background repeat          | repeat
background-size     | percent/px  | css background size            | auto
vertical-align      | string      | css vertical-align             | top
text-align          | string      | css text-align                 | center
padding             | px          | supports up to 4 parameters    | 20px 0
padding-top         | px          | section top offset             | n/a
padding-bottom      | px          | section bottom offset          | n/a
padding-left        | px          | section left offset            | n/a
padding-right       | px          | section right offset           | n/a
