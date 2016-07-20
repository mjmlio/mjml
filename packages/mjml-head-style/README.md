## mjml-style

This tag allow you to specify CSS style for your MJML document. Style will be inlined on the final HTML document

 ```xml
 <mjml>
   <mj-head>
     <mj-style>
       .red-color {
         color: red;
       }
     </mj-style>
   </mj-head>
   <mj-body>
     <mj-container>
       <mj-section>
         <mj-column>
           <mj-text>
             <p class="red-color">Hello World!</p>
           </mj-text>
         </mj-column>
       </mj-section>
     </mj-container>
   </mj-body>
 </mjml>
 ```

<p align="center">
  <a href="https://mjml.io/try-it-live/component/head-title">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>
