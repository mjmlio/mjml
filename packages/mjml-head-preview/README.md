### mj-preview

This tag allows you to set the preview text that will be displayed in the inbox of the recipient.

```xml
<mjml>
 <mj-head>
   <mj-preview>Hello MJML</mj-preview>
 </mj-head>
 <mj-body>
   <mj-section>
     <mj-column>
       <mj-text>
         Hello World!
       </mj-text>
     </mj-column>
   </mj-section>
 </mj-body>
</mjml>
```

#### Attributes

| attribute            | accepts | description                                                                                                           | default value           |
| -------------------- | ------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| fill-space           | string  | number of spacing units appended after preview text to prevent clients from pulling body copy into the inbox preview. | `0`                     |
| fill-space-unit      | string  | unit used for spacing.                                                                                                | `&#8199;&#65279;&#847;` |

<p class="cta-container"><a class="cta" href="https://mjml.io/try-it-live/components/head-preview">Try it live</a></p>
