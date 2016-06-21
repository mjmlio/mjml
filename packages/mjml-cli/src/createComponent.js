export default (name, endingTag = 'false') => {
  const lowerName = name.toLowerCase()

  return `import { MJMLElement } from 'mjml-core'
import merge from 'lodash/merge'
import MJMLText from 'mjml-text'
import React, { Component } from 'react'

const tagName = '${lowerName}'
const endingTag = ${endingTag}

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
      <MJMLText style={css}>
        {content}
      </MJMLText>
    )
  }

}

${name}.tagName = tagName
${name}.defaultMJMLDefinition = defaultMJMLDefinition
${name}.endingTag = endingTag
${name}.baseStyles = baseStyles

export default ${name}

`
}
