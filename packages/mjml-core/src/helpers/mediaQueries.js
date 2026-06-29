import { isEmpty } from 'lodash'

function groupMediaQueries(mediaQueries, prefix = '') {
  const grouped = Object.entries(mediaQueries).reduce(
    (result, [className, mediaQuery]) => {
      const selector = `${prefix}.${className}`

      if (!result[mediaQuery]) {
        result[mediaQuery] = []
      }

      result[mediaQuery].push(selector)

      return result
    },
    {},
  )

  return Object.entries(grouped).map(
    ([mediaQuery, selectors]) => `${selectors.join(', ')} ${mediaQuery}`,
  )
}

// eslint-disable-next-line import/prefer-default-export
export default function buildMediaQueriesTags(
  breakpoint,
  mediaQueries = {},
  options = {},
) {
  if (isEmpty(mediaQueries)) {
    return ''
  }

  const { forceOWADesktop = false, printerSupport = false } = options

  const baseMediaQueries = groupMediaQueries(mediaQueries)
  const thunderbirdMediaQueries = groupMediaQueries(mediaQueries, '.moz-text-html ')
  const owaQueries = baseMediaQueries.map((mq) => `[owa] ${mq}`)

  return `
    <style type="text/css">
      @media only screen and (min-width:${breakpoint}) {
        ${baseMediaQueries.join('\n')}
      }
    </style>
    <style media="screen and (min-width:${breakpoint})">
      ${thunderbirdMediaQueries.join('\n')}
    </style>
    ${
      printerSupport
        ? `<style type="text/css">
            @media only print {
              ${baseMediaQueries.join('\n')}
            }
          </style>`
        : ``
    }
    ${
      forceOWADesktop
        ? `<style type="text/css">\n${owaQueries.join('\n')}\n</style>`
        : ``
    }
  `
}
