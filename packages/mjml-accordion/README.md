## mjml-accordion

<p align="center">
  <img src="http://i.imgur.com/notready" alt="desktop" />
</p>

`mjml-accordion` is an interactive MJML component to stack content in tabs, so the information is collapsed and only the titles are visible. Readers can interact by clicking on the tabs to reveal the content, providing a great experience on mobile devices where space is scarce.

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-accordion>
            <mj-accordion-title>A neat title</mj-accordion-title>
            <mj-accordion-text>What a good content !</mj-accordion-text>
          </mj-accordion>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/carousel">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>


attribute | unit | description | default value
----------|------|-------------|---------------
container-background-color | n/a | background-color of the cell | n/a,
border | n/a | border | n/a
font-family | n/a | font | Ubuntu, Helvetica, Arial, sans-serif
icon-align | n/a | icon alignment | middle
icon-wrapped-url | n/a | icon when accordion is wrapped | http://i.imgur.com/bIXv1bk.png
icon-wrapped-alt | n/a | alt text when accordion is wrapped | +
icon-unwrapped-url | n/a | icon when accordion is unwrapped | http://i.imgur.com/w4uTygT.png
icon-unwrapped-alt | n/a | alt text when accordion is unwrapped | -
icon-position | n/a | display icon left or right | right
icon-height | px | icon width | 32px
icon-width | px | icon height | 32px
padding-bottom | px | padding bottom | n/a
padding-left | px | padding left | n/a
padding-right | px | padding right | n/a
padding-top | px | padding top | n/a
padding | px | padding | 10px 25px

## mjml-accordion-title

This component enables you to add and style a title to your accordion

attribute | unit | description | default value
----------|------|-------------|---------------
background-color | n/a | background color | n/a
color | n/a | text color | n/a
font-family | n/a | font family | Ubuntu, Helvetica, Arial, sans-serif
font-size | px | font size | 13px
padding-bottom | px | padding bottom | n/a
padding-left | px | padding left | n/a
padding-right | px | padding right | n/a
padding-top | px | padding top | n/a
padding | px | padding | 16px

## mjml-accordion-text

This component enables you to add and style a text to your accordion

attribute | unit | description | default value
----------|------|-------------|---------------
background-color | n/a | background color | n/a
color | n/a | text color | n/a
font-family | n/a | font family | Ubuntu, Helvetica, Arial, sans-serif
font-size | px | font size | 13px
padding-bottom | px | padding bottom | n/a
padding-left | px | padding left | n/a
padding-right | px | padding right | n/a
padding-top | px | padding top | n/a
padding | px | padding | 16px
