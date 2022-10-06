/* eslint-disable max-classes-per-file */
const chai = require('chai')
const { BodyComponent } = require('../lib/createComponent')

class MockParent extends BodyComponent {
  constructor(...args) {
    super(...args)
    this.tagName = 'mock-parent'
  }
}

class MockChild extends BodyComponent {
  constructor(...args) {
    super(...args)
    this.tagName = 'mock-child'
  }
}

const child = new MockChild({
  attributes: {
    'font-size': '20px',
    color: '#F45E43',
    'font-family': 'helvetica',
  },
  content: 'Hello World',
})

const parent = new MockParent({
  children: [child],
  attributes: {},
})

const mjml = parent.toMJML()

chai
  .expect(mjml, 'toMJML test failed')
  .to.equal(
    '<mock-parent><mock-child font-size="20px" color="#F45E43" font-family="helvetica"></mock-child></mock-parent>',
  )
