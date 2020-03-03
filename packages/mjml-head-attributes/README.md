## mj-attributes

This tag allows you to modify default attributes on a `mj-tag` and add `mj-class` to them.

 ```xml
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text padding="0" />
      <mj-class name="blue" color="blue" />
      <mj-class name="big" font-size="20px" />
      <mj-all font-family="Arial" />
    </mj-attributes>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text mj-class="blue big">
          Hello World!
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
 ```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/head-attributes">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>

<aside class="notice">
  You can use mj-all to set default attributes for every components inside your MJML document
</aside>

<aside class="notice">
  Note that the apply order of attributes is: inline attributes, then classes, then default mj-attributes and then defaultMJMLDefinition
</aside>

