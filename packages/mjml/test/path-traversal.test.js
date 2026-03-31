const chai = require('chai')
const mjml = require('../lib')

describe('Path traversal protection (CVE-2020-12827)', function () {
  it('should reject relative path traversal in mj-include', function () {
    const input = '<mjml><mj-body><mj-section><mj-include path="../../../../etc/passwd" /></mj-section></mj-body></mjml>'
    chai.expect(() => mjml(input)).to.throw(/within the project directory/)
  })

  it('should reject absolute paths in mj-include', function () {
    const input = '<mjml><mj-body><mj-section><mj-include path="/etc/passwd" /></mj-section></mj-body></mjml>'
    chai.expect(() => mjml(input)).to.throw(/absolute paths are not allowed/)
  })

  it('should reject URL-encoded traversal in mj-include', function () {
    const input = '<mjml><mj-body><mj-section><mj-include path="%2e%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd" /></mj-section></mj-body></mjml>'
    chai.expect(() => mjml(input)).to.throw(/within the project directory/)
  })

  it('should reject traversal in CSS includes', function () {
    const input = '<mjml><mj-body><mj-section><mj-include path="../../../../etc/passwd" type="css" /></mj-section></mj-body></mjml>'
    chai.expect(() => mjml(input)).to.throw(/within the project directory/)
  })

  it('should reject traversal in HTML includes', function () {
    const input = '<mjml><mj-body><mj-section><mj-include path="../../../../etc/passwd" type="html" /></mj-section></mj-body></mjml>'
    chai.expect(() => mjml(input)).to.throw(/within the project directory/)
  })

  it('should reject absolute paths in CSS includes', function () {
    const input = '<mjml><mj-body><mj-section><mj-include path="/etc/passwd" type="css" /></mj-section></mj-body></mjml>'
    chai.expect(() => mjml(input)).to.throw(/absolute paths are not allowed/)
  })

  it('should not leak filesystem paths in error messages', function () {
    try {
      const input = '<mjml><mj-body><mj-section><mj-include path="../../../../etc/passwd" /></mj-section></mj-body></mjml>'
      mjml(input)
      chai.assert.fail('Expected an error to be thrown')
    } catch (e) {
      chai.expect(e.message).to.not.include('/etc/passwd')
      chai.expect(e.message).to.not.match(/\/home\//)
      chai.expect(e.message).to.not.match(/\/Users\//)
    }
  })
})
