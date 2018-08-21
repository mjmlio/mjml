const chai = require('chai')
const jsonToXml = require('../lib/helpers/jsonToXML')

const json = {
  line: 1,
  includedIn: [],
  tagName: 'mjml',
  children:
   [ {
       line: 2,
       includedIn: [],
       tagName: 'mj-body',
       children:
        [ {
            line: 3,
            includedIn: [],
            tagName: 'mj-section',
            children:
             [ {
                 line: 4,
                 includedIn: [],
                 tagName: 'mj-column',
                 children:
                  [ {
                      line: 5,
                      includedIn: [],
                      tagName: 'mj-text',
                      attributes:
                       { 'font-size': '20px',
                         color: '#F45E43',
                         'font-family': 'helvetica' },
                      content: 'Hello World' } ],
                 attributes: {} } ],
            attributes: {} } ],
       attributes: {} } ],
  attributes: {} }

const xml = jsonToXml(json)

const validXml = '<mjml><mj-body><mj-section><mj-column><mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text></mj-column></mj-section></mj-body></mjml>'

chai.expect(xml, 'jsonToXML test failed')
    .to.equal(validXml)
