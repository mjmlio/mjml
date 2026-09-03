import { BodyComponent } from 'mjml-core'
import {
  emitDarkModeHeadStyle,
  registerDarkModeRule,
} from 'mjml-core/lib/helpers/colorSchemeDarkMode'
import buildPreview from './helpers/preview'

export default class MjBody extends BodyComponent {
  static componentName = 'mj-body'

  static allowedAttributes = {
    'background-color': 'color',
    'background-color--dark': 'color',
    id: 'string',
    width: 'unit(px)',
  }

  static defaultAttributes = {
    width: '600px',
  }

  getChildContext() {
    return {
      ...this.context,
      containerWidth: this.getAttribute('width'),
    }
  }

  getStyles() {
    return {
      body: {
        'background-color': this.getAttribute('background-color'),
      },
      div: {
        'word-spacing': 'normal',
        'background-color': this.getAttribute('background-color'),
      },
    }
  }

  styles(styles) {
    const output = super.styles(styles)

    if (styles === 'div') {
      return `${output}font-size:medium;font-size:max(16px, 1rem);`
    }

    return output
  }

  componentHeadStyle = () => {
    const darkBgColor = this.getAttribute('background-color--dark')
    if (!darkBgColor) return ''
    emitDarkModeHeadStyle(this.context && this.context.globalData)
    return ''
  }

  render() {
    const {
      globalData: { lang, dir, title, preview },
    } = this.context

    const darkBgColor = this.getAttribute('background-color--dark')
    const darkClass = darkBgColor
      ? registerDarkModeRule(this.context && this.context.globalData, {
          cssProperty: 'background-color',
          cssValue: darkBgColor,
        })
      : null
    const bodyClass = [this.getAttribute('css-class'), darkClass]
      .filter(Boolean)
      .join(' ') || null

    return `<body${this.htmlAttributes({
      id: this.getAttribute('id'),
      class: bodyClass,
      style: 'body',
      'xml:lang': lang,
    })}>
    ${buildPreview(preview)}
    <div${this.htmlAttributes({
        ...(title && { 'aria-label': title }),
        'aria-roledescription': 'email',
        role: 'article',
        lang,
        dir,
        style: 'div',
        class: darkClass,
      })}>
    ${this.renderChildren()}
    </div>
  </body>`
  }
}
