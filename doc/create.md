# Create a Component

Creating a component is easy! With custom components, you can abstract complex patterns and reuse them easily whenever you need them in your emails!

Let's create a simple `Title` component.

### Generate the template file

```

$> mjml --init-component title

```
run the following in your terminal. It will create a `Title.js` file in the current working directory.

### Imports

``` javascript

import React, { Component } from 'react'
import {
  MJMLElement,
  elements,
  registerElement,
} from 'mjml'

```
These are the required modules to build your component:

[React](https://facebook.github.io/react/) is used by the engine to abstract higher level components and render them into HTML.

[MJMLElement](https://github.com/mjmlio/mjml/blob/master/src/components/MJMLElement.js)

[elements](https://github.com/mjmlio/mjml/blob/master/src/MJMLElementsCollection.js) contains all the standard MJML components.

[registerElement](https://github.com/mjmlio/mjml/blob/master/src/MJMLElementsCollection.js#L17) is a helper function that allows you to register the component within the MJML engine.

### Declare your dependencies

``` javascript
/*
 * Wrap your dependencies here.
 */
const {
  text: MjText,
  // ...
} = elements;

```

The first thing to do is to declare your dependencies at the top of your file.
The key is the component name, and its value is the name you're going to use in the file.
By convention it should be capitalized.

## Class definition

All MJML component have some special static that can be use to change the behaviour of your componenet

``` javascript
Title.tagName = 'title'
Title.defaultMJMLDefinition = {
  attributes: {
    'color': '#424242',
    'font-family': 'Helvetica',
    'margin-top': '10px'
  }
}
Title.endingTag = true
Title.columnElement = true
Title.baseStyles = {
  div: {
    color: "blue"
  }
}
Title.postRender = ($) => {
  $('.title').removeAttr('data-title-color');
  return $
}
```

- tagName: modify the tag name of your component, here it will be `<title>`
- endingTag: set to false if your component can include some other MJML component (example: mj-body/mj-section/mj-column are not ending tags, and mj-text/mj-image are both ending tags)`
- columnElement: if your component is included in a `mj-column` then it should be set to true. It will wrap everything in a `td` that supports `padding` for example

## Default and readonly attributes

``` javascript
const defaultMJMLDefinition = {
  attributes: {
    'color': '#424242',
    'font-family': 'Helvetica',
    'margin-top': '10px'
  }
}
```

Here you can modify and change your element's default and/or readonly attributes.
The attributes are stored within the defaultMJMLDefinition variable at the top.
It can contain any CSS property or component property, but please make sure it will be compatible with most email clients to keep MJML responsive and compatible.

## Post render
In some case, you'll need to modify the rendered html, like replace some placeholder for outlook by conditional tag then you can define a postRender static function that take jQuery/[Cheerio](https://github.com/cheeriojs/cheerio) with the rendered document.

``` javascript
Title.postRender = $ => {
  $('.title').prepend(`<!--[if mso | IE]>
    <table border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600}px;"><tr><td>
    <![endif]-->`)
  $('.title').append(`<!--[if mso | IE]>
    </td></tr></table>
    <![endif]-->`)

  return $
}
```

Please note that postRender should return a valid jQuery/Cheerio object

## Define your public attributes

``` javascript
  /*
   * Build your styling here
   */
  getStyles() {
    const { mjAttribute, color } = this.props

    return _.merge({}, baseStyles, {
      text: {
      /*
       * Get the color attribute
       * Example: <mj-title color="blue">content</mj-title>
       */
        color: mjAttribute('color')
      }
    })
  }
```

The getStyles method allows you to expose public attributes to the end user with `mjAttribute`. If the user does not provide any value, it will keep the default one.

## Render your component

``` javascript

  render() {

    const css = this.getStyles(),
          content = 'Hello World!'

    return (
      <MjText style={ css }>
        { content }
      </MjText>
    )
  }
}

```

To render your component, you need to load your style.

Finally, use the JSX syntax to define your component. Find out more about JSX [here](https://facebook.github.io/react/docs/jsx-in-depth.html).

# Import your component

## .mjmlconfig inside the folder

You can add a simple .mjmlconfig file with path to your class file simple as :

``` javascript
{
  "packages": [
    "./Title.js",
    "mjml-github-component"
  ]
}
```
Note that if you install a MJML componenet from npm, you can declare them in the .mjmlconfig file

The file should be at the root of where you launch the command in order to be use

## Manually with a Javascript file

``` javascript
import { mjml2html, registerMJElement } from 'mjml'
import Title from './Title'

registerMJElement(Title)

console.log(mjml2html(`
  <mjml>
    <mj-body>
      <mj-title>Hello world!</mj-title>
    </mj-body>
  </mjml>
```

Then launch it with node script.js and the result will be shown in the console
