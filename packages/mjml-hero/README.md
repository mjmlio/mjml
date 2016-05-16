## MJ-HERO

<p align="center">
<img src="https://cloud.githubusercontent.com/assets/1830348/15150602/30ab6970-16ce-11e6-9132-ee4c65f34aa2.png" />
</p>

``` html

<mjml>
  <mj-body>
    <mj-container>
      <mj-hero
       mode="fixed-height"
       height="265px"
       background-width="600"
       background-height="265px"
       background-url="http://i.imgur.com/lHOvxs4.jpg"
       background-position="center center"
       background-color="#2a3448"
       padding="20px">
        <mj-hero-content
           width="370px"
           align="left"
           background-color="#ffffff">
           <mj-text font-family="Helvetica" align="left">
             Hello World !
           </mj-text>
         </mj-hero-content>
      </mj-hero>
    </mj-container>
  </mj-body>
</mjml>

```
Display a section with a background image and some content inside (mj-text, mj-button, mj-image ...)

<aside class="notice">
The height attribute is required only for the fixed-height mode
</aside>

<aside class="notice">
<span style="font-weight:bold;">The background position does not work in mode fluid-height and on outlook.com</span>
</aside>

<aside class="notice">
For better result we encourage you to use a background image with a 600px width and always specify a fallback background color, in case the user email client does not support background images.
</aside>

<aside class="notice">
Please keep the hero container height below the image height. When the hero container height - both in fixed or fluid modes - is greater than the background image height, we can’t guarantee a perfect rendering in all supported email clients
</aside>

attribute           | unit                                | description                                                          | default value
--------------------|-------------------------------------|----------------------------------------------------------------------|--------------
mode                | fluid-height/fixed-height           | choose if the height is fixed based on the height attribute or fluid | fluid-height
height              | px                                  | hero section height (required for fixed-height mode)                 | 0px
background-width    | px                                  | width of the image used                                              | 0px
background-height   | px                                  | height of the image used                                             | 0px
background-url      | url                                 | absolute background url                                              | n/a
background-color    | color                               | hero background color                                                | #ffffff
background-position | top/center/bottom left/center/right | background image position                                            | center center
padding             | px                                  | supports up to 4 parameters                                          | 0px
padding-top         | px                                  | top offset                                                           | 0px
padding-right       | px                                  | right offset                                                         | 0px
padding-left        | px                                  | left offset                                                          | 0px
padding-bottom      | px                                  | bottom offset                                                        | 0px
