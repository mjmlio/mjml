import { reduce, negate, isNil } from 'lodash'
import buildPreview from './preview'
import { buildFontsTags } from './fonts'
import buildMediaQueriesTags from './mediaQueries'

export default function skeleton(options) {
  const {
    backgroundColor = '',
    breakpoint = '480px',
    content = '',
    fonts = {},
    mediaQueries = {},
    headStyle = [],
    componentsHeadStyle = {},
    headRaw = [],
    preview,
    title = '',
    style,
    forceOWADesktop,
    inlineStyle,
    lang,
  } = options

  const langAttribute = lang ? `lang="${lang}" ` : ''

  return `
    <!doctype html>
    <html ${langAttribute}xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <title>
          ${title}
        </title>
        <!--[if !mso]><!-- -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          #outlook a { padding:0; }
          body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
          table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
          img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
          p { display:block;margin:13px 0; }
        </style>
        <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
        ${buildFontsTags(content, inlineStyle, fonts)}
        ${buildMediaQueriesTags(breakpoint, mediaQueries, forceOWADesktop)}
        <style type="text/css">
        ${reduce(
          componentsHeadStyle,
          (result, compHeadStyle) => `${result}\n${compHeadStyle(breakpoint)}`,
          '',
        )}
        ${reduce(
          headStyle,
          (result, headStyle) => `${result}\n${headStyle(breakpoint)}`,
          '',
        )}
        </style>
        ${
          style && style.length > 0
            ? `<style type="text/css">${style.join('')}</style>`
            : ''
        }
        ${headRaw.filter(negate(isNil)).join('\n')}
      </head>
      <body${
        backgroundColor === ''
          ? ''
          : ` style="background-color:${backgroundColor};"`
      }>
        ${buildPreview(preview)}
        ${content}
      </body>
    </html>
  `
}
