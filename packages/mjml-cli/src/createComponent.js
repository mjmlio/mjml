export default (name, endingTag="false", columnElement="false") => {
  const lowerName = name.toLowerCase()

  return `import { MJMLElement, elements } from 'mjml-core'
import merge from 'lodash/merge'
import React, { Component } from 'react'

/*
* Wrap your dependencies here.
*/
const { text: MjText } = elements

const tagName = '${lowerName}'
const endingTag = ${endingTag}
const columnElement = ${columnElement}
/*
 * Add your default mjml-attributes here
 */
const defaultMJMLDefinition = {
  attributes: {
    'color': '#424242',
    'font-family': 'Helvetica',
    'margin-top': '10px'
  }
}
/*
 * Add you default style here
 */
const baseStyles = {
  div: {
    cursor: 'auto'
  }
}

@MJMLElement
class ${name} extends Component {

  /*
   * Build your styling here
   */
  getStyles () {
    const { mjAttribute, color } = this.props

    return merge({}, this.constructor.baseStyles, {
      text: {
      /*
       * Get the color attribute
       * Example: <mj-${lowerName} color="blue">content</mj-${lowerName}>
       */
        color: mjAttribute('color')
      }
    })
  }

  render () {
    const css = this.getStyles()
    const content = 'Hello World!'

    return (
      <MjText style={ css }>
        { content }
      </MjText>
    )
  }
}

${name}.tagName = tagName
${name}.defaultMJMLDefinition = defaultMJMLDefinition
${name}.endingTag = endingTag
${name}.columnElement = columnElement
${name}.baseStyles = baseStyles

export default ${name}

`
}
