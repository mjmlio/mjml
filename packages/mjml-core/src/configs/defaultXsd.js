import elements from '../MJMLElementsCollection'
import includes from 'lodash/includes'

export default (schemas = '') => {
  const allowedElements = Object.keys(elements).map(element => includes(elements[element].parentTag, 'mj-body') ? elements[element].tagName : null).filter(Boolean)

  return `<?xml version="1.0" encoding="UTF-8"?>
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:complexType name="mjml">
      <xs:sequence>
        <xs:element name="mj-head" type="mj-head" minOccurs="0" maxOccurs="1" />
        <xs:element name="mj-body" type="mj-body" minOccurs="1" maxOccurs="1" />
      </xs:sequence>
    </xs:complexType>
    <xs:complexType name="mj-head">
      <xs:sequence>
        <xs:any processContents="skip" minOccurs="0" maxOccurs="unbounded"/>
      </xs:sequence>
    </xs:complexType>
    <xs:complexType name="mj-body">
      <xs:sequence>
          ${allowedElements.map(elem => `<xs:element name="${elem}" type="${elem}" minOccurs="0" maxOccurs="1"/>`).join(`\n`)}
      </xs:sequence>
    </xs:complexType>
    ${schemas}
    <xs:element name="mjml" type="mjml" />
    <xs:element name="mj-body" type="mj-body" />
    <xs:element name="mj-head" type="mj-head" />
  </xs:schema>`
}
