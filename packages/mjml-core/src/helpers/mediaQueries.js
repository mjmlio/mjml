import _ from 'lodash'

export function buildMediaQueriesTags (mediaQueries = {}) {
  return !_.isEmpty(mediaQueries) ? `
    <style type="text/css">
      @media only screen and (min-width:480px) {
        ${_.map(mediaQueries, (mediaQuery, className) => `.${className} ${mediaQuery}`).join('\n')}
      }
    </style>
  ` :
  ''
}
