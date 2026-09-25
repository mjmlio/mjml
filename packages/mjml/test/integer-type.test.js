const chai = require('chai')
const { initializeType } = require('../../mjml-core/lib/types/type')

describe('integer type', function () {
  describe('integer', function () {
    const IntegerType = initializeType('integer')

    ;['0', '6', '42', '06'].forEach((value) => {
      it(`should accept "${value}"`, function () {
        chai.expect(new IntegerType(value).isValid()).to.equal(true)
      })
    })
    ;['6px', 'abc5', '5abc', '10%', '1.5', '-6', 'abc', '', ' 6', '6 '].forEach(
      (value) => {
        it(`should reject "${value}"`, function () {
          chai.expect(new IntegerType(value).isValid()).to.equal(false)
        })
      },
    )
  })

  describe('integer(px)', function () {
    const IntegerType = initializeType('integer(px)')

    ;['0', '6', '6px', '0px'].forEach((value) => {
      it(`should accept "${value}"`, function () {
        chai.expect(new IntegerType(value).isValid()).to.equal(true)
      })
    })
    ;[
      '6em',
      '10%',
      '1.5',
      '1.5px',
      '-6',
      'px',
      'abc5',
      '5abc',
      '6PX',
      '6 px',
      ' 6',
      '6 ',
    ].forEach((value) => {
      it(`should reject "${value}"`, function () {
        chai.expect(new IntegerType(value).isValid()).to.equal(false)
      })
    })
  })

  it('should fall back to plain integer for unsupported parameters', function () {
    ;['integer(em)', 'integer(px,em)', 'integer '].forEach((typeConfig) => {
      const IntegerType = initializeType(typeConfig)

      chai.expect(new IntegerType('6').isValid(), typeConfig).to.equal(true)
      chai.expect(new IntegerType('6px').isValid(), typeConfig).to.equal(false)
      chai.expect(new IntegerType('6em').isValid(), typeConfig).to.equal(false)
    })
  })

  it('should read the (px) parameter of the type case-insensitively', function () {
    const IntegerType = initializeType('Integer(PX)')

    chai.expect(new IntegerType('6px').isValid()).to.equal(true)
    // values themselves stay case-sensitive
    chai.expect(new IntegerType('6PX').isValid()).to.equal(false)
  })

  describe('getValue', function () {
    it('should strip px from valid integer(px) values', function () {
      const IntegerType = initializeType('integer(px)')

      chai.expect(new IntegerType('6px').getValue()).to.equal('6')
      chai.expect(new IntegerType('0px').getValue()).to.equal('0')
      chai.expect(new IntegerType('6').getValue()).to.equal('6')
    })

    it('should leave invalid integer(px) values unchanged', function () {
      const IntegerType = initializeType('integer(px)')

      ;['10%', '1.5px', '6PX', 'abc5px', ' 6px'].forEach((value) => {
        chai.expect(new IntegerType(value).getValue()).to.equal(value)
      })
      chai.expect(new IntegerType(undefined).getValue()).to.equal(undefined)
    })

    it('should never strip px for plain integer', function () {
      const IntegerType = initializeType('integer')

      chai.expect(new IntegerType('6px').getValue()).to.equal('6px')
    })
  })
})
