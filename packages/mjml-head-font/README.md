## mj-font

This tag imports fonts for your use.
The `href` attribute points to a hosted css file; that file points to the font file.
Some font providers (as in our example code) host both the CSS and the font files.

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
  If you don't get a CSS file, model one on the "href" file in the example.
</aside>

attribute   | unit     | description                             | default value
------------|----------|-----------------------------------------|---------------
href        | string   | URL of a hosted CSS file for the font   | n/a
name        | string   | name of the font                        | n/a
