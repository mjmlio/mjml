# MJML document

An MJML Document starts with a `<mjml>` tag, it can contains only `mj-head` and `mj-body` tags. Both have the same purpose of `head` and `body` in a HTML document.

## mj-head

Mj-Head contains everything related to the document such as style and meta element. It supports custom head elements and can be registered through `registerMJHeadElement(<string> name, <function> handler)` api from `mjml-core`, it acts as a pre-render hook.


## mj-body

Mj-Body contains everything related to the content of your email. It supports custom elements too and can be registered either through `registerMJElement(<MJMLElement> class)` api from `mjml-core` or via a `.mjmlconfig` file. Non-known element from `mjml-core` are simply ignored. Note that `mj-body` should have only one root element due to how React work.


## mj-include

The mjml-core package allows you to include external mjml files to build your email template.

`header.mjml`
```xml
<mj-section>
  <mj-column>
    <mj-text>This is a header</mj-text>
  </mj-column>
</mj-section>
```

You can wrap your external mjml files inside the default `mjml > mj-body > mj-container`
tags to make it easier to preview outside the main template

`main.mjml`
```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-include path="./header" /> <!-- or 'header.mjml' -->
    </mj-container>
  </mj-body>
</mjml>
```

The mjml engine will then replace your included files before starting the rendering process

<aside class="notice">
Note that the file must be a file with a `.mjml` extension
</aside>
