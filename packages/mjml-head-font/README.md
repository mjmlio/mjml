## mjml-font

This tag allows you to import fonts if used in your MJML document

 ```xml
 <mjml>
   <mj-head>
     <mj-font name="Raleway" href="https://fonts.googleapis.com/css?family=Raleway" />
   </mj-head>
   <mj-body>
     <mj-section>
       <mj-column>
         <mj-text font-family="Raleway, Arial">
           Hello World!
         </mj-text>
       </mj-column>
      </mj-section>
   </mj-body>
 </mjml>
 ```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/head-font">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>


attribute            | unit          | description                    | default value
---------------------|---------------|--------------------------------|---------------
href                 | string        | url of the font                | n/a
name                 | string        | name of the font               | n/a

