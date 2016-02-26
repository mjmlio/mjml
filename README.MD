<br>
<p align="center"><a href="http://mjml.io" target="_blank"><img width="250"src="https://cloud.githubusercontent.com/assets/6558790/12672296/7b66d8cc-c675-11e5-805d-c6d196320537.png"></a></p>

<p align="center">
  <a href="https://travis-ci.org/mjmlio/mjml"><img src="https://travis-ci.org/mjmlio/mjml.svg?branch=master" alt="travis"></a>
  <a href="https://www.codacy.com/app/gbadi/mjml"><img src="https://api.codacy.com/project/badge/grade/575339cb861f4ff4b0dbb3f9e1759c35"/></a>
</p>

<p align="center">
<br>
|
<b><a href="#introduction"> Introduction </a></b>|
<b><a href="#installation"> Installation </a></b>|
<b><a href="#show-me-the-code"> Usage </a></b>|
<b><a href="#contribute"> Contribute </a></b>|

</p>
<br>

---

# Introduction

MJML is a markup language designed to reduce the pain of coding a responsive email. Its semantic syntax makes it easy and straightforward while its rich standard components library fastens your development time and lightens your email codebase. MJML’s open-source engine takes care of translating the MJML you wrote into responsive HTML.

<br>
<p align="center">
  <a href="http://mjml.io" target="_blank">
    <img width="75%" src="https://cloud.githubusercontent.com/assets/6558790/12450760/ee034178-bf85-11e5-9dda-98d0c8f9f8d6.png">
  </a>
</p>

<br>

# Installation

## Requirements:
 - Node >= 4.2.x

<p>
  <a href="https://www.npmjs.com/package/mjml" target="_blank">
    <strong align="left">Via NPM: </strong>
    <img align="right" width="30" src="https://www.npmjs.com/static/images/npm-logo.svg">
  </a>
</p>


```

npm install -g mjml

```

<a href="https://github.com/mjmlio/mjml/releases" target="_blank">
  <strong align="left">Via... click: </strong>
</a>

<p align="center">
  <a href="https://github.com/mjmlio/mjml/releases" target="_blank">
    <img width="100" src="https://cloud.githubusercontent.com/assets/6558790/12175323/cdc78a78-b561-11e5-99e2-23abd893879a.png">
  </a>
</p>


# Show me the code!

### Command line

> Compile the file and output the result in `a.html`

``` bash

$> mjml -r input.mjml

```

> Redirect the result to a file

``` bash

$> mjml -r input.mjml -o output.html

```

> Watch a file and compile every time the file changes

``` bash

$> mjml -w input.mjml -o output.html

```

<br>
### Inside NodeJs

``` javascript

import mjml from 'mjml'

/*
  Compile an mjml string
*/
const htmlOutput = mjml.mjml2html(`<mj-body>
  <mj-section>
    <mj-column>
      <mj-text>
        Hello World!
      </mj-text>
    </mj-column>
  </mj-section>
</mj-body>
`)

/*
  Print the responsive HTML generated
*/
console.log(htmlOutput);
```

### Create your component

> Issue the following in your terminal

``` bash

$> mjml --init-component <name of your component>

# If your component cannot contain anything else than text:
$> mjml --init-component <name of you component> -e

# It means nothing inside it will be parsed by the mjml engine.

```

It will create a basic component template in a `.js` file. Follow the instructions provided in the file
and read more about custom components in the documentation

<br>

# Try it live

Get your hands dirty by trying the MJML online editor! Write awesome code on the left side and preview your email on the right. You can also get the rendered HTML directly from the online editor.

<p align="center">
  <a href="http://mjml.io/try-it-live"><img src="https://cloud.githubusercontent.com/assets/6558790/12195421/58a40618-b5f7-11e5-9ed3-80463874ab14.png" alt="try it live" width="75%"></a>
</p>
<br>

# Contributors

<table cellpadding="0">
  <tr>
    <th><a href="https://github.com/iRyusa"><img src="https://avatars2.githubusercontent.com/u/570317?v=3&s=192" alt="Maxime" width="100px"></a></th>
    <th><a href="https://github.com/robink"><img src="https://avatars0.githubusercontent.com/u/116530?v=3&s=192" alt="Robin" width="100px"></a></th>
    <th><a href="https://github.com/lohek"><img src="https://avatars1.githubusercontent.com/u/582703?v=3&s=192" alt="Loeck" width="100px"></a></th>
    <th><a href="https://github.com/GuillaumeBadi"><img src="https://avatars3.githubusercontent.com/u/6558790?v=3&s=192" alt="Guillaume" width="100px"></a></th>
    <th><a href="https://github.com/meriadec"><img src="https://avatars1.githubusercontent.com/u/315259?v=3&s=192" alt="Meriadec" width="100px"></a></th>
    <th><a href="https://github.com/arnaudbreton"><img src="https://avatars0.githubusercontent.com/u/1361191?v=3&s=192" alt="Arnaud" width="100px"></a></th>
     <th><a href="https://github.com/hteumeuleu"><img src="https://avatars2.githubusercontent.com/u/3451753?v=3&s=460" alt="HTeuMeuLeu" width="100px"></a></th>
     <th><a href="https://github.com/epayet"><img src="https://avatars1.githubusercontent.com/u/3276179?v=3&s=460" alt="Emmanuel Payer" width="100px"></a></th>
  </tr>
  <tr>
    <td><a href="https://github.com/iRyusa">Maxime</a></td>
    <td><a href="https://github.com/robink">Robin</a></td>
    <td><a href="https://github.com/lohek">Loeck</a></td>
    <td><a href="https://github.com/GuillaumeBadi">Guillaume</a></td>
    <td><a href="https://github.com/meriadec">Meriadec</a></td>
    <td><a href="https://github.com/arnaudbreton">Arnaud</a></td>
    <td><a href="https://github.com/hteumeuleu">HTeuMeuLeu</a></td>
    <td><a href="https://github.com/epayet">Emmanuel Payet</a></td>
  </tr>
</table>

# Contribute

 - [ ] Fork the repository
 - [x] Code an awesome feature (we are confident about that)
 - [ ] Make your pull request
 - [ ] Add your github profile here
