## mjml-accordion

<p align="center">
  <img src="http://i.imgur.com/1p50NXi.gif" alt="accordion" />
</p>

`mjml-accordion` is an interactive MJML component to stack content in tabs, so the information is collapsed and only the titles are visible. Readers can interact by clicking on the tabs to reveal the content, providing a great experience on mobile devices where space is scarce.

```xml
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-accordion-title font-size="18px" font-family="Helvetica"/>
      <mj-accordion-text font-size="14px" font-family="Helvetica" />
    </mj-attributes>
  </mj-head>
  <mj-body>
    <mj-container background-color="#fbfbfb">
      <mj-section>
        <mj-column background-color="#dfdfdf">
          <mj-accordion border="1px solid blue">
            <mj-accordion-element icon-position="left" icon-wrapped-url="https://cdn4.iconfinder.com/data/icons/e-commerce-icon-set/48/More-128.png" icon-unwrapped-url="https://cdn4.iconfinder.com/data/icons/e-commerce-icon-set/48/Less-128.png">
              <mj-accordion-title background-color="#dedede" color="#333333">To the left, to the left</mj-accordion-title>
              <mj-accordion-text background-color="#333333" color="#dedede">Isn't this content neat?</mj-accordion-text>
            </mj-accordion-element>
            <mj-accordion-element icon-position="right" icon-wrapped-url="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/down4-512.png" icon-unwrapped-url="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/up4-512.png">
              <mj-accordion-title background-color="#dedeff" color="#444488">To the right, to the right</mj-accordion-title>
              <mj-accordion-text background-color="#444488" color="#dedeff">What about this content?</mj-accordion-text>
            </mj-accordion-element>
          </mj-accordion>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/accordion">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

<aside class="notice">
Every attribute in `mj-accordion` are applied to `mj-accordion-element` unless you overide them on `mj-accordion-element`
</aside>


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

### mjml-accordion-element

This component enables you to create a accordion pane

attribute | unit | description | default value
----------|------|-------------|---------------
background-color | n/a | background color | n/a
font-family | n/a | font | Ubuntu, Helvetica, Arial, sans-serif
icon-align | n/a | icon alignment | middle
icon-wrapped-url | n/a | icon when accordion is wrapped | http://i.imgur.com/bIXv1bk.png
icon-wrapped-alt | n/a | alt text when accordion is wrapped | +
icon-unwrapped-url | n/a | icon when accordion is unwrapped | http://i.imgur.com/w4uTygT.png
icon-unwrapped-alt | n/a | alt text when accordion is unwrapped | -
icon-position | n/a | display icon left or right | right
icon-height | n/a | icon width | 32px
icon-width | n/a | icon height | 32px

### mjml-accordion-title

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

### mjml-accordion-text

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
