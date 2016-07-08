import elements from '../MJMLElementsCollection'
import includes from 'lodash/includes'

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
