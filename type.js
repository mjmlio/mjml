const types = require('./packages/mjml-core/lib/types/type.js')

const enumtype = types.initializeType('enum(top,left,center)')
const colortype = types.initializeType('color')
const booleantype = types.initializeType('boolean')
const unittype = types.initializeType('unit(px,%){1,3}')
const stringtype = types.initializeType('string')

console.log(stringtype)

const output = (t) => { console.log(`Type: ${t.constructor.name} — Value: ${t.value} — isValid: ${t.isValid()} ${t.getErrorMessage()}`) }

[new colortype('grey'),
  new colortype('rgba(0,255,3,0.3)'),
  new colortype('#DDF'),
  new colortype('#DF'),
  new booleantype('true'),
  new booleantype('false'),
  new booleantype('banana'),
  new unittype('10 20px 20'),
  new unittype('10px 20px 20px'),
  new unittype('10px'),
  new unittype('10%'),
  new unittype('10px 10px'),
  new unittype('0'),
  new stringtype('hello world'),
].map(output)

