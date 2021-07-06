## mj-include

The `mjml-core` package adds `mj-include` content to
  a copy of your MJML markup in memory.
It uses that copy to build the HTML file.

```xml
<!-- header.mjml -->
<mj-section>
  <mj-column>
    <mj-text>This is a header</mj-text>
  </mj-column>
</mj-section>
```

```xml
<!-- main.mjml -->
<mjml>
  <mj-body>
    <mj-include path="./header.mjml" />
  </mj-body>
</mjml>
```

The `main.mjml` code here demonstrates adding content from `header.mjml`.

The `header.mjml` code here is an include file without `mjml`, `mj-head`, and
  `mj-body` tags.
In this case, MJML puts all text from this file where
  it finds the `mj-include`.

MJML also allows the `mjml`, `mj-head`, and `mj-body` tags in include files.
The resulting MJML include file can preview better outside the main template.
When the main `mj-body` section holds these mixed include files,
  MJML puts content of
  (1) the `mj-head` from `mj-include` in the main `mj-head` element and 
  (2) the `mj-body` from `mj-include` where it finds the `mj-include`.

Include files can have `mj-include` elements.


### Other file types

MJML can include external `css` files;
  it inserts them as if finding an `mj-style`.  
When including a CSS file, use the `type="css"` attribute.  
The `css-inline="inline"` attribute causes MJML to inline the CSS.

```xml
<!-- main.mjml -->
  <mj-include path="./styles.css" type="css" />
  <mj-include path="./inline-styles.css" type="css" css-inline="inline" />
```

MJML can include external `html` files;
  it inserts them as if finding an `mj-raw`.  
When including an HTML file, use the `type="html"` attribute.
MJML puts the external HTML where it finds the `<include>`.

```xml
<!-- main.mjml -->
  <mj-include path="./partial.html" type="html" />
```
