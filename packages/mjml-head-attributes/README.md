## mjml-head-attributes

 ``` html
 <mjml>
   <mj-head>
     <mj-attributes>
       <mj-text padding="0" />
       <mj-class name="blue" color="blue" />
       <mj-class name="big" font-size="20px" />
     </mj-attributes>
   </mj-head>
   <mj-body>
     <mj-container>
       <mj-section>
         <mj-column>
           <mj-text mj-class="blue big"> Hello World! </mj-text>
         </mj-column>
       </mj-section>
     </mj-container>
   </mj-body>
 </mjml>
 ```

This tag allows you to modify default attributes on a `mj-tag` and add `mj-class` to them.

<aside class="notice">
  Note that the apply order of attributes is: inline attributes, then classes, then default mj-attributes and then defaultMJMLDefinition
</aside>

<p align="center">
  <a href="/try-it-live/text"><img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" /></a>
</p>
