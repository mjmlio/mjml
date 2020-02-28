## mj-accordion

<p align="center">
  <img src="https://i.imgur.com/C4S9MVc.gif" alt="accordion" />
</p>

`mj-accordion` is an interactive MJML component to stack content in tabs, so the information is collapsed and only the titles are visible. Readers can interact by clicking on the tabs to reveal the content, providing a great experience on mobile devices where space is scarce.

```xml
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-accordion border="none" padding="1px" />
      <mj-accordion-element icon-wrapped-url="https://i.imgur.com/Xvw0vjq.png" icon-unwrapped-url="https://i.imgur.com/KKHenWa.png" icon-height="24px" icon-width="24px" />
      <mj-accordion-title font-family="Roboto, Open Sans, Helvetica, Arial, sans-serif" background-color="#fff" color="#031017" padding="15px" font-size="18px" />
      <mj-accordion-text font-family="Open Sans, Helvetica, Arial, sans-serif" background-color="#fafafa" padding="15px" color="#505050" font-size="14px" />
    </mj-attributes>
  </mj-head>

  <mj-body>
    <mj-section padding="20px" background-color="#ffffff">
      <mj-column background-color="#dededd">
        <mj-accordion>
          <mj-accordion-element>
            <mj-accordion-title>Why use an accordion?</mj-accordion-title>
            <mj-accordion-text>
              <span style="line-height:20px">
                Because emails with a lot of content are most of the time a very bad experience on mobile, mj-accordion comes handy when you want to deliver a lot of information in a concise way.
              </span>
            </mj-accordion-text>
          </mj-accordion-element>
          <mj-accordion-element>
            <mj-accordion-title>How it works</mj-accordion-title>
            <mj-accordion-text>
              <span style="line-height:20px">
                Content is stacked into tabs and users can expand them at will. If responsive styles are not supported (mostly on desktop clients), tabs are then expanded and your content is readable at once.
              </span>
            </mj-accordion-text>
          </mj-accordion-element>
        </mj-accordion>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/accordion">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

<aside class="notice">
Every attribute in `mj-accordion` are applied to `mj-accordion-element` unless you override them on `mj-accordion-element`
</aside>


attribute | unit | description | default value
----------|------|-------------|---------------
border | n/a | border | n/a
container-background-color | n/a | background-color of the cell | n/a,
css-class | string | class name, added to the root HTML element created | n/a
font-family | n/a | font | Ubuntu, Helvetica, Arial, sans-serif
icon-align | n/a | icon alignment | middle
icon-height | px | icon width | 32px
icon-position | n/a | display icon left or right | right
icon-unwrapped-alt | n/a | alt text when accordion is unwrapped | -
icon-unwrapped-url | n/a | icon when accordion is unwrapped | https://i.imgur.com/w4uTygT.png
icon-width | px | icon height | 32px
icon-wrapped-alt | n/a | alt text when accordion is wrapped | +
icon-wrapped-url | n/a | icon when accordion is wrapped | https://i.imgur.com/bIXv1bk.png
padding | px | padding | 10px 25px
padding-bottom | px | padding bottom | n/a
padding-left | px | padding left | n/a
padding-right | px | padding right | n/a
padding-top | px | padding top | n/a

### mj-accordion-element

This component enables you to create a accordion pane

attribute | unit | description | default value
----------|------|-------------|---------------
background-color | n/a | background color | n/a
css-class | string | class name, added to the root HTML element created | n/a
font-family | n/a | font | Ubuntu, Helvetica, Arial, sans-serif
icon-align | n/a | icon alignment | middle
icon-height | n/a | icon width | 32px
icon-position | n/a | display icon left or right | right
icon-unwrapped-alt | n/a | alt text when accordion is unwrapped | -
icon-unwrapped-url | n/a | icon when accordion is unwrapped | https://i.imgur.com/w4uTygT.png
icon-width | n/a | icon height | 32px
icon-wrapped-alt | n/a | alt text when accordion is wrapped | +
icon-wrapped-url | n/a | icon when accordion is wrapped | https://i.imgur.com/bIXv1bk.png

### mj-accordion-title

This component enables you to add and style a title to your accordion

attribute | unit | description | default value
----------|------|-------------|---------------
background-color | n/a | background color | n/a
color | n/a | text color | n/a
css-class | string | class name, added to the root HTML element created | n/a
font-family | n/a | font family | Ubuntu, Helvetica, Arial, sans-serif
font-size | px | font size | 13px
padding | px | padding | 16px
padding-bottom | px | padding bottom | n/a
padding-left | px | padding left | n/a
padding-right | px | padding right | n/a
padding-top | px | padding top | n/a

### mj-accordion-text

This component enables you to add and style a text to your accordion

attribute | unit | description | default value
----------|------|-------------|---------------
background-color | n/a | background color | n/a
color | n/a | text color | n/a
css-class | string | class name, added to the root HTML element created | n/a
font-family | n/a | font family | Ubuntu, Helvetica, Arial, sans-serif
font-size | px | font size | 13px
padding | px | padding | 16px
padding-bottom | px | padding bottom | n/a
padding-left | px | padding left | n/a
padding-right | px | padding right | n/a
padding-top | px | padding top | n/a

