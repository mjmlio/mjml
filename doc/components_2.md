### mj-include

The `mjml-core` package allows you to include external `.mjml` files
to build your email template.

<div class="alert alert-important" role="alert">
  <p>Important</p>
  <br>
  <p><b>MJML 5 — includes are disabled by default.</b></p>
  <p><code>mj-include</code> tags are silently ignored unless you opt in. If your included
  content is missing from the output, enable includes explicitly using <code>ignoreIncludes: false</code> for <a href="#inside-node-js">Node.js</a> or <code>--config.allowIncludes true</code> for the <a href="#command-line-interface">CLI</a>

  <p>See the <a href="#include-path-examples">include security documentation</a> for details
  on scoping which directories are allowed.</p>
</div>

```xml
<!-- header.mjml -->
<mj-section>
  <mj-column>
    <mj-text>This is a header</mj-text>
  </mj-column>
</mj-section>
```

You can wrap your external `.mjml` files inside the default `mjml > mj-body`
tags to make it easier to preview outside the main template.

```xml
<!-- main.mjml -->
<mjml>
  <mj-body>
    <mj-include path="./header.mjml" />
  </mj-body>
</mjml>
```

The MJML engine will then replace your included files before starting the rendering process.

#### Other file types

You can include external `.css` files which will be inserted in the same way as using an `mj-style` tag. You need to specify that you're including a CSS file using the attribute `type="css"` attribute.

If you want the CSS to be inlined, you can use the `css-inline="inline"` attribute.

```xml
<!-- main.mjml -->
<mj-include path="./styles.css" type="css" />
<mj-include path="./inline-styles.css" type="css" css-inline="inline" />
```

You can also include external `html` files. They will be inserted the same way as when using an `mj-raw` tag. You need to specify that you're including an HTML file using the attribute `type="html"`.

```xml
<!-- main.mjml -->
<mj-include path="./partial.html" type="html" />
```
