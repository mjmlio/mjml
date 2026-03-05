import { negate, isNil } from 'lodash'
import { buildFontsTags } from './fonts'
import buildMediaQueriesTags from './mediaQueries'
import { buildStyleFromComponents, buildStyleFromTags } from './styles'

export default function skeleton(options) {
  const {
    beforeDoctype = '',
    breakpoint = '480px',
    content = '',
    fonts = {},
    mediaQueries = {},
    headStyle = {},
    componentsHeadStyle = [],
    headRaw = [],
    title = '',
    style = [],
    forceOWADesktop,
    printerSupport,
    inlineStyle,
    lang,
    dir,
    supportDarkMode = false,
    supportOutlookClassic = true,
    usesVML = false,
  } = options

  return `${beforeDoctype ? `${beforeDoctype}\n` : ''}<!doctype html>
<html lang="${lang}" dir="${dir}"${
    supportOutlookClassic && usesVML
      ? ' xmlns:v="urn:schemas-microsoft-com:vml"'
      : ''
  }${supportOutlookClassic ? ' xmlns:o="urn:schemas-microsoft-com:office:office"' : ''}>
  <head>
    <title>${title}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
    <meta name="x-apple-disable-message-reformatting">
    ${
      supportDarkMode
        ? '<meta name="color-scheme" content="light dark">\n    <meta name="supported-color-schemes" content="light dark">'
        : ''
    }
    ${[
      buildFontsTags(content, inlineStyle, fonts),
    ]
      .filter((s) => s && String(s).trim().length > 0)
      .join('\n')
    }
    <style>
      #outlook a { padding:0; }
      body { margin:0;padding:0;text-size-adjust:100%;${supportOutlookClassic ? ' -ms-text-size-adjust:100%;' : ''} }
      table, td { border-collapse:collapse;${supportOutlookClassic ? ' mso-table-lspace:0pt;mso-table-rspace:0pt;' : ''}}
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;${supportOutlookClassic ? ' -ms-interpolation-mode:bicubic;' : ''}}
      p { display:block;margin:1em 0; }
      ${
      supportDarkMode
        ? ':root { color-scheme: light dark; supported-color-schemes:light dark; }'
        : ''
      }
    </style>
    ${[
      buildMediaQueriesTags(breakpoint, mediaQueries, {
        forceOWADesktop,
        printerSupport,
      }),
      buildStyleFromComponents(breakpoint, componentsHeadStyle, headStyle),
      buildStyleFromTags(breakpoint, style),
      headRaw.filter(negate(isNil)).join('\n'),
    ]
      .filter((s) => s && String(s).trim().length > 0)
      .join('\n')
    }
    ${
      supportOutlookClassic
        ? `<!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->`
        : ''
    }
  </head>
  ${content}
</html>`
}
