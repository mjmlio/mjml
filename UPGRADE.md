# Upgrading from 1.X to 2.X

## MJML tag

Before `mj-body` was the root tag of an MJML document. Now you should wrap it in a `mjml` tag

### Mj-Body

Note that `mj-body` becomes `mj-container` prior to 2.0 every attributes such as `width` on `mj-body` is now on `mj-container`

### MJML 1.X (before)

```xml
<mj-body width="550">
  <mj-section>
    <mj-column>
      <mj-text>Hello World !</mj-text>
    </mj-column>
  </mj-section>
</mj-body>
```

### MJML 2.X (now)

```xml
<mjml>
  <mj-body>
    <mj-container width="550">
      <mj-section>
        <mj-column>
          <mj-text>Hello World !</mj-text>
        </mj-column>
      </mj-section>
    </mj-container>
  </content>
</mjml>
```  

## Register a new Component

### Before

`registerElement` use to take three arguments :

- a tag name
- a component
- an option hash with `{endingTag: true/false}` to set an endingTag

### Now

`registerElement` becomes `registerMJElement` and now take only one argument : the component.

It reads the statics from the component to define how it behave.

## Create a componenent

### Before

```javascript
import _ from 'lodash'
import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'
import { widthParser } from '../helpers/mjAttribute'

/**
 * Displays a customizable divider
 */
@MJMLColumnElement({
  tagName: 'mj-divider',
  attributes: {
    'border-color': '#000000',
    'border-style': 'solid',
    'border-width': '4px',
    'padding': '10px 25px',
    'width': '100%'
  }
})
class Divider extends Component {
...
}

export default Divider
```

### Now

`MJMLColumnElement` doesn't exist anymore, use `MJMLElement` decorators instead.

You can now add a `postRender` hook that take the HTML generated from MJML document with [Cheerio](https://github.com/cheeriojs/cheerio) API

`tagName`, `baseStyle`, `columnElement`, `endingTag`, `defaultMJMLDefinition` are now statics, use them as such:

```javascript
import { MJMLElement, helpers } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

const tagName = 'mj-divider'
const defaultMJMLDefinition = {
  attributes: {
    'border-color': '#000000',
    'border-style': 'solid',
    'border-width': '4px',
    'padding': '10px 25px',
    'width': '100%'
  }
}
const baseStyles = {
  p: {
    fontSize: '1px',
    margin: '0 auto'
  }
}
const postRender = $ => {
  $('.mj-divider-outlook').each(function () {
    const insertNode = `<table align="center" border="0" cellpadding="0" cellspacing="0" style="${$(this).attr('style')}" width="${$(this).data('divider-width')}"><tr><td>&nbsp;</td></tr></table>`

    $(this)
      .removeAttr('data-divider-width')
      .removeAttr('class')
      .after(`<!--[if mso]>${insertNode}<![endif]-->`)
  })

  return $
}

@MJMLElement
class Divider extends Component {
...
}

Divider.tagName = tagName
Divider.defaultMJMLDefinition = defaultMJMLDefinition
Divider.baseStyles = baseStyles
Divider.postRender = postRender

export default Divider
```
