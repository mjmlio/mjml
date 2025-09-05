const chai = require('chai')
const { load } = require('cheerio')
const mjml = require('../lib')

const input = `
 <mjml>
   <mj-head>
     <mj-font name="Libertinus Keyboard"
       href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap|https://fonts.googleapis.com/css2?family=Libertinus+Keyboard&display=swap" />

     <mj-font name="Asimovian"
       href="https://fonts.googleapis.com/css2?family=Asimovian&display=swap" />
   </mj-head>
   <mj-body>
     <mj-section>
       <mj-column>
         <mj-text font-family="Asimovian, Arial">
           Hello World!
         </mj-text>
         <mj-text font-family="'Libertinus Keyboard', Arial">
           Goodbye cruel world!
         </mj-text>
       </mj-column>
      </mj-section>
   </mj-body>
 </mjml>
`

const { html } = mjml(input)

const $ = load(html)

// should split the first mj-font url into 2 separate <link> and 2 separate @import declarations. And the second mj-font should also be added as both <link> and @import
chai
  .expect(
    $('link')
      .map(function getAttr() {
        return $(this).attr('href')
      })
      .get(),
    'All 3 URLs within both mj-text tags to create <link> declarations',
  )
  .to.eql([
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    'https://fonts.googleapis.com/css2?family=Libertinus+Keyboard&display=swap',
    'https://fonts.googleapis.com/css2?family=Asimovian&display=swap',
  ])

chai
  .expect(
    $('link + style')
      .map(function getAttr() {
        return $(this).html().trim().replaceAll('\n', '')
      })
      .get(),
    'All 3 URLs within both mj-text tags to create @import declarations',
  )
  .to.contain.oneOf([
    '@import url(https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap);@import url(https://fonts.googleapis.com/css2?family=Libertinus+Keyboard&display=swap);@import url(https://fonts.googleapis.com/css2?family=Asimovian&display=swap);',
  ])
