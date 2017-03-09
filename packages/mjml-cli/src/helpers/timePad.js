import padStart from 'lodash/padStart'
import curryRight from 'lodash/curryRight'

export default curryRight(padStart)('0')(2)
