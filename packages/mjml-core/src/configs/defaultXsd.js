export default (schemas = '') => (
  `<?xml version="1.0" encoding="UTF-8"?>
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <xs:import namespace="http://www.w3.org/1999/xhtml" schemaLocation="http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd" />
    <xs:complexType name="mjml">
      <xs:sequence>
        <xs:element name="mj-body" type="mj-body" minOccurs="1" maxOccurs="1" />
      </xs:sequence>
    </xs:complexType>
    <xs:complexType name="mj-body">
      <xs:sequence>
        <xs:element name="mj-container" type="mj-container" minOccurs="1" maxOccurs="1" />
      </xs:sequence>
    </xs:complexType>
    ${schemas}
    <xs:element name="mjml" type="mjml" />
  </xs:schema>`
)
