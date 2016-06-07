
MJ-INCLUDE
==========

The mjml-core package allows you to include external mjml files to build your email template.


> `header.mjml`:
``` xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-text>This is a header</mj-text>
    </mj-container>
  </mj-body>
</mjml>

```

You can wrap your external mjml files inside the default `mjml > mj-body > mj-container`
tags to make it easier to preview outside the template

> `main.mjml`
``` xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-include path='header'> <!-- or 'header.mjml' -->
    </mj-container>
  </mj-body>
</mjml>
```

The mjml engine will then replace your included files before starting the rendering process

> Note that the file must be an MJML file
