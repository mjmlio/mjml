### mj-attributes

Inside the `mj-attributes` tag, you can cite other MJML components, like `mj-text` for example, to override the default settings for that component.

An `mj-all` tag is like the above, but affects all MJML components.

An `mj-class` tag creates a named group of MJML attributes you can apply to MJML
components using `mj-class="<name>"`.

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

<div class="alert alert-important" role="alert">
  <p>Important</p>
  <p>MJML will apply found attributes in the following order:</p>
  <ul>
    <li>inline attributes within tags,</li>
    <li>attributes found in tags within the <code>mj-attributes</code> tag, e.g. <code>mj-text</code>,</li>
    <li>the <code>mj-all</code> tag within <code>mj-attributes</code>, and</li>
    <li>the default MJML values.</li>
  </ul>
</div>

<div class="alert alert-caution" role="alert">
  <p>Shorthand and side-specific attributes</p>
  <p>Attributes with a shorthand, such as <code>padding</code> and <code>padding-left</code>, or <code>border</code> and <code>border-top</code>, are separate attributes that are each resolved in the order above. A side-specific attribute always takes precedence over the shorthand, wherever each one is defined. The order of attributes within a tag does not matter either.</p>
  <p>For example, with <code>&lt;mj-section padding-left="40px" /&gt;</code> in <code>mj-attributes</code>, an <code>&lt;mj-section padding="10px"&gt;</code> still gets a left padding of 40px: the inline <code>padding</code> only sets the top, right and bottom padding. To override a side-specific value, set that side-specific attribute, e.g. <code>padding-left="10px"</code>.</p>
</div>

<p class="cta-container"><a class="cta" href="https://mjml.io/try-it-live/components/head-attributes">Try it live</a></p>
