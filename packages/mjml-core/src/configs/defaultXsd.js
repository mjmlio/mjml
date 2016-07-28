import elements from '../MJMLElementsCollection'
import includes from 'lodash/includes'

export default (schemas = '') => {
  const allowedElements = Object.keys(elements).map(element => includes(elements[element].parentTag, 'mj-body') ? elements[element].tagName : null).filter(Boolean)

  return `<?xml version="1.0" encoding="UTF-8"?>
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:complexType name="mjml-elements">
      <xs:sequence>
        <xs:element name="mj-head" type="mj-head" minOccurs="0" maxOccurs="1" />
        <xs:element name="mj-body" type="mj-body" minOccurs="1" maxOccurs="1" />
      </xs:sequence>
    </xs:complexType>
    <xs:complexType name="mjml">
      <xs:complexContent>
        <xs:extension base="mjml-elements">
          <xs:attribute name="validate">
            <xs:simpleType>
              <xs:restriction base="xs:string">
                <xs:enumeration value="strict"/>
                <xs:enumeration value="soft"/>
                <xs:enumeration value="none"/>
              </xs:restriction>
            </xs:simpleType>
          </xs:attribute>
        </xs:extension>
      </xs:complexContent>
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
