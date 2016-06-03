## mjml-navbar

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-navbar background-color="#ef6451">
        <mj-column width="20%">
          <mj-image width="150px" src="https://mjml.io/assets/img/logo-white-small.png"></mj-image>
        </mj-column>
        <mj-column width="80%">
          <mj-inline-links base-url="https://mjml.io">
            <mj-link href="/gettings-started-onboard" color="#ffffff">Getting started</mj-link>
            <mj-link href="/try-it-live" color="#ffffff">Try it live</mj-link>
            <mj-link href="/templates" color="#ffffff">Templates</mj-link>
            <mj-link href="/components" color="#ffffff">Components</mj-link>
            <mj-link href="/documentation" color="#ffffff">Documentation</mj-link>
          </mj-inline-links>
        </mj-column>
      </mj-navbar>
    </mj-container>
  </mj-body>
</mjml>
```

Displays a full width section for navigation

<p align="center">
  <a href="https://mjml.io/try-it-live/component/navbar">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

attribute           | unit        | description                    | default value
--------------------|-------------|--------------------------------|---------------
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
