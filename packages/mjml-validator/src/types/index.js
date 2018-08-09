import NBoolean, { matcher as booleanMatcher } from './boolean'
import Color, { matcher as colorMatcher } from './color'
import Enum, { matcher as enumMatcher } from './enum'
import Unit, { matcher as unitMatcher } from './unit'
import NString, { matcher as stringMatcher } from './string'
import NInteger, { matcher as intMatcher } from './integer'

export default {
  boolean: { matcher: booleanMatcher, typeConstructor: NBoolean },
  enum: { matcher: enumMatcher, typeConstructor: Enum },
  color: { matcher: colorMatcher, typeConstructor: Color },
  unit: { matcher: unitMatcher, typeConstructor: Unit },
  string: { matcher: stringMatcher, typeConstructor: NString },
  integer: { matcher: intMatcher, typeConstructor: NInteger },
}
