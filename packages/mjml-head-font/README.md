## mj-font

This tag imports fonts.
The tag has effect only if the template uses the font, too. 
The `href` attribute points to a hosted css file; that file contains a `@font-face` declaration.
Example: [https://fonts
.googleapis.com/css?family=Raleway](https://fonts.googleapis.com/css?family=Raleway)

 ```xml
 <mjml>
   <mj-head>
     <mj-font name="Raleway"
       href="https://fonts.googleapis.com/css?family=Raleway" />
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

<aside class="notice">
  "mj-font" cannot work if the email client doesn't support external fonts.
  <a href="https://www.caniemail.com/features/css-at-font-face/"
     target="_blank"
     referrerpolicy="no-referrer"
     rel="noreferrer noopener"
     title="link to caniemail.com/features/css-at-font-face"
   >https://www.caniemail.com/features/css-at-font-face/</a >
   may help.
</aside>

attribute   | unit     | description                | default value
------------|----------|----------------------------|---------------
href        | string   | URL of a hosted CSS file   | n/a
name        | string   | name of the font           | n/a
