## mj-attributes

Inside `mj-attributes`, a tag citing one MJML component (like `mj-text`;
see example) overrides default settings for listed MJML attributes
on the one component.

An `mj-all` is like the above, but affects every MJML component with one tag.

`mj-class` tags create a named group of MJML attributes you can apply to MJML
components much like you can apply HTML classes to HTML elements. To apply them, use `mj-class="<name>"`.

 ```xml
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text padding="0" />
	  <mj-all font-family="Arial" />
      <mj-class name="blue" color="blue" />
      <mj-class name="big" font-size="20px" />
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

<p style="text-align: center;" >
  <a href="https://mjml.io/try-it-live/components/head-attributes">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>

<aside class="notice">
MJML's priority for applying values to MJML attributes is
(highest priority first):
inline MJML attributes, `mj-class` in `mj-attributes`,
`mj-all` in `mj-attributes`, and default MJML values.
</aside>
