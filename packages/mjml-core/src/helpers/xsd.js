import elements from '../MJMLElementsCollection'
import includes from 'lodash/includes'

class XsdError {
  constructor (errors) {
    this.errors = errors
  }

  defaultError ({line, column, code, message}) {
    return this.formatLine(line, column, `Uknown MJML error, please open an issue on github.com/mjmlio/mjml with code: ${code} and message: ${message}`)
  }

  formatLine (line, column, message) {
    return { line, column, message }
  }

  format (error) {
    const cleanedErrorMessage = error.message.replace(/'/gmi, '"')
    const errorFormater = XsdError.CODES[error.code]

    if (!errorFormater) {
      return this.defaultError(error)
    }

    const { regexp, message } = errorFormater
    const matching = []
    let matched

    do {
      matched = regexp.exec(cleanedErrorMessage)

      if (matched) {
        matching.push(matched[1].trim())
      }
    } while (matched)

    if (matching.length < 1) {
      return this.defaultError(error)
    }

    return this.formatLine(error.line, error.column, matching.reduce((finalMessage, value, index) => finalMessage.replace(`$${index}`, value), message))
  }

  getErrors () {
    return this.errors.map((error) => this.format(error))
  }
}

XsdError.CODES = {
  "1866": {
    regexp: /"(.*?)"/gmi,
    message: `$0 : has no attribute "$1"`
  },
  "1871": {
    regexp: /[\(|"](.*?)["|\)]/gmi,
    message: `$0 is not allowed here, only $1 are accepted`
  }
}

export { XsdError }

const endingTagXsd = (Component) => {

  return `${Component.selfClosingTag ? '' : `
    <xs:complexType name="${Component.tagName}-elements" mixed="true">
      <xs:sequence>
        <xs:any processContents="skip" minOccurs="0" maxOccurs="unbounded"/>
      </xs:sequence>
    </xs:complexType>`}

  <xs:complexType name="${Component.tagName}">
      ${Component.selfClosingTag ? "" : `
      <xs:complexContent>
        <xs:extension base="${Component.tagName}-elements">`}
          ${Object.keys(Component.defaultMJMLDefinition.attributes).map(attribute => `<xs:attribute type="xs:string" name="${attribute}" />`).join(`\n`)}
      ${Component.selfClosingTag ? "" : `
        </xs:extension>
    </xs:complexContent>`}
  </xs:complexType>

  <xs:element name="${Component.tagName}" type="${Component.tagName}" />`
}

const defaultXsd = (Component) => {
  const allowedElements = Object.keys(elements).map(element => includes(elements[element].parentTag, Component.tagName) ? elements[element].tagName : null).filter(Boolean)

  return `
    <xs:complexType name="${Component.tagName}-elements" mixed="true">
      <xs:sequence>
        ${allowedElements.map(elem => `<xs:element name="${elem}" type="${elem}" minOccurs="0" maxOccurs="unbounded"/>`).join(`\n`)}
      </xs:sequence>
    </xs:complexType>

    <xs:complexType name="${Component.tagName}">
      <xs:complexContent>
        <xs:extension base="${Component.tagName}-elements">
          ${Object.keys(Component.defaultMJMLDefinition.attributes).map(attribute => `<xs:attribute type="xs:string" name="${attribute}" />`).join(`\n`)}
        </xs:extension>
      </xs:complexContent>
    </xs:complexType>

    <xs:element name="${Component.tagName}" type="${Component.tagName}" />`
}

export default (Component) => {
  return () => Component.endingTag ? endingTagXsd(Component) : defaultXsd(Component)
}
