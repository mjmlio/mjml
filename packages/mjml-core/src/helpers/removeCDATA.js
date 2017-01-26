import isBrowser from './isBrowser'

const CDATARegexp = isBrowser ? /<!--\[CDATA\[([^]*?)\]\]-->/gm : /<!\[CDATA\[([^]*?)\]\]>/gm

export default str => str.replace(CDATARegexp, '$1')
