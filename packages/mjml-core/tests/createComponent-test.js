/* eslint-disable max-classes-per-file */
const chai = require('chai')
const { Component } = require('../src/createComponent')


class MockParent extends Component {
  tagName = 'mock-parent'
}

class MockChild extends Component {
  tagName = 'mock-child'
}


  const child = new MockChild(
    {
      tagName: 'mj-text',
      attributes: {
        'font-size': '20px',
        color: '#F45E43',
        'font-family': 'helvetica',
      },
      content: 'Hello World',
    },
  )

  

const parent = new MockParent({
    tagName: 'mj-column',
    children: [child],
    attributes: {},
})

const mjml = parent.renderAsMJML()


chai.expect(mjml, 'renderAsMJML test failed').to.equal('')
