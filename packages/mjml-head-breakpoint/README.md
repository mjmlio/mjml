## mjml-breakpoint
This tag allows you to control on which breakpoint the layout should go desktop/mobile.

 ```xml
 <mjml>
   <mj-head>
     <mj-breakpoint width="320px" />
   </mj-head>
   <mj-body>
     <mj-container>
       <mj-section>
         <mj-column>
           <mj-text>
             Hello World!
           </mj-text>
         </mj-column>
       </mj-section>
     </mj-container>
   </mj-body>
 </mjml>
 ```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/head-font">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>


attribute            | unit          | description                    | default value
---------------------|---------------|--------------------------------|---------------
width                | px            | breakpoint's value             | n/a
