import { castArray } from 'lodash'
import { HeadComponent } from 'mjml-core'

// names added by mj-font, per document
const fontsAddedByTag = new WeakMap()

export default class MjFont extends HeadComponent {
  static componentName = 'mj-font'

  static allowedAttributes = {
    name: 'string',
    href: 'string',
  }

  handler() {
    const { add, globalData } = this.context
    const name = this.getAttribute('name')
    const href = this.getAttribute('href')

    // Several mj-font tags with the same name each add a stylesheet, e.g. one
    // for the regular and one for the italic styles. The first one replaces a
    // font of that name from the `fonts` option.
    let addedFonts = fontsAddedByTag.get(globalData)
    if (!addedFonts) {
      addedFonts = new Set()
      fontsAddedByTag.set(globalData, addedFonts)
    }

    if (addedFonts.has(name)) {
      globalData.fonts[name] = [...castArray(globalData.fonts[name]), href]
    } else {
      addedFonts.add(name)
      add('fonts', name, href)
    }
  }
}
