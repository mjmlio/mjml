### mj-text

Displays text which can be styled.

```xml
<mjml>
 <mj-body>
   <mj-section>
     <mj-column>
       <mj-text font-family="Helvetica" color="#F45E43">
         <h1>Title</h1>
         <p>Paragraph</p>
         <p style="font-family:Comic Sans Ms">Another paragraph</p>
       </mj-text>
     </mj-column>
   </mj-section>
 </mj-body>
</mjml>
```

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p><code>mj-text</code> is an "ending tag", which means that it can contain HTML code  but it cannot contain other MJML components.</p> 
  <p>More information about ending tags <a href="#ending-tags">in this section</a>.</p>
</div>

#### Attributes

| attribute                  | accepts                           | description                                                  | default value        |
| -------------------------- | --------------------------------- | ------------------------------------------------------------ | -------------------- |
| align                      | `left` `right` `center` `justify` | text-alignment                                               | `left`               |
| color                      | CSS color formats                 | text color                                                   | `#000000`            |
| container-background-color | CSS color formats                 | inner element background color                               |                      |
| css-class                  | string                            | class name, added to the root HTML element created           |                      |
| font-family                | string                            | font                                                         | `Ubuntu, sans-serif` |
| font-size                  | `px` `rem`                        | text size                                                    | `16px`               |
| font-style                 | string                            | CSS values, e.g. `normal` `italic` `oblique`                 |                      |
| font-weight                | string                            | text thickness                                               |                      |
| height                     | `px`                              | height of the element                                        |                      |
| letter-spacing             | `px` `em`                         | letter spacing                                               |                      |
| line-height                | `px` `%` `em` `rem`               | space between the lines                                      | `150%`               |
| normalize-elements         | `ol` and/or `ul` (comma delimted) | normalizes the margin and padding for the specified element  |                      |
| padding                    | `px` `%`                          | text padding, supports up to 4 parameters                    | `10px 25px`          |
| padding-bottom             | `px` `%`                          | bottom offset                                                |                      |
| padding-left               | `px` `%`                          | left offset                                                  |                      |
| padding-right              | `px` `%`                          | right offset                                                 |                      |
| padding-top                | `px` `%`                          | top offset                                                   |                      |
| text-decoration            | string                            | CSS values, e.g. `underline` `overline` `none`               |                      |
| text-transform             | string                            | CSS values, i.e. `capitalize` `uppercase` `lowercase` `none` |                      |

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p>For <code>normalize-elements</code> the HTML is compiled with inline margin and/or padding for each <code>ul</code>, <code>ol</code> and <code>li</code> tag, as well as adding <code>mso</code> specific CSS to the <code>&lt;head&lt;</code>. You can override this inline in the HTML, using any padding or margin attribute however it will not change in Outlook classic.</p>
</div>

<p class="cta-container"><a class="cta" href="https://mjml.io/try-it-live/components/text">Try it live</a></p>

##### Modifiers

###### Dark-mode

| attribute                        | accepts           | description                       | default value |
| -------------------------------- | ----------------- | --------------------------------- | ------------- |
| color--dark                      | CSS color formats | the text color in dark-mode       |               |
| container-background-color--dark | CSS color formats | the background color in dark-mode |               |

<div class="alert alert-note" role="alert">
  <p>Note</p>
  <p>All <code>--dark</code> modifier attributes require <code>support-dark-mode="true"</code> to be set on the <code>&lt;mjml&gt;</code> tag to work effectively in all supported clients.</p>
</div>

###### Responsive

| attribute                  | accepts                           | description                               | default value |
| -------------------------- | --------------------------------- | ----------------------------------------- | ------------- |
| align--responsive          | `left` `right` `center` `justify` | text-alignment                            |               |
| font-size--responsive      | `px`                              | text size                                 |               |
| height--responsive         | `px` `%`                          | height of the element                     |               |
| line-height--responsive    | `px` `%`                          | space between the lines                   |               |
| padding--responsive        | `px` `%`                          | text padding, supports up to 4 parameters |               |
| padding-bottom--responsive | `px` `%`                          | bottom offset                             |               |
| padding-left--responsive   | `px` `%`                          | left offset                               |               |
| padding-right--responsive  | `px` `%`                          | right offset                              |               |
| padding-top--responsive    | `px` `%`                          | top offset                                |               |
