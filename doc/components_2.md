## mj-include

The `mjml-core` package allows you to include external `mjml` files
  to build your email template.

```xml
<!-- header.mjml -->
<mj-section>
  <mj-column>
    <mj-text>This is a header</mj-text>
  </mj-column>
</mj-section>
```

You can wrap your external mjml files inside the default `mjml > mj-body`
  tags to make it easier to preview outside the main template.


```xml
<!-- main.mjml -->
<mjml>
  <mj-body>
    <mj-include path="./header.mjml" />
  </mj-body>
</mjml>
```

You can also include external `css` files. They will be inserted the same way as when using a `mj-style`.  
You need to specify that you're including a css file using the `type="css"` attribute.  
If you want the css to be inlined, you can use the `css-inline="inline"` attribute.

```xml
<!-- main.mjml -->
  <mj-include path="./styles.css" type="css" />
  <mj-include path="./inline-styles.css" type="css" css-inline="inline" />
```


The `MJML` engine will then replace your included files before starting
  the rendering process.
