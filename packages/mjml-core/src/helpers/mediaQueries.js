import _ from 'lodash'

export function buildMediaQueriesTags(breakpoint, mediaQueries = {}) {
  return !_.isEmpty(mediaQueries)
    ? `
    <style type="text/css">
      @media only screen and (min-width:${breakpoint}) {
        ${_.map(
          mediaQueries,
          (mediaQuery, className) => `.${className} ${mediaQuery}`,
        ).join('\n')}
      }
    </style>
  `
    : ''
}
