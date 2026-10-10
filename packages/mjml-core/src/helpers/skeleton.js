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
    gmailForceLightMode = false,
    supportOutlookClassic = true,
    usesVML = false,
  } = options

  // gmail-force-light-mode only changes the meta tag (read by Gmail apps), so the
  // :root CSS and --dark styles from support-dark-mode still apply elsewhere
  let metaColorScheme = null
  if (gmailForceLightMode) {
    metaColorScheme = 'light only'
  } else if (supportDarkMode) {
    metaColorScheme = 'light dark'
  }

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
    ${[
      metaColorScheme
        ? `<meta name="color-scheme" content="${metaColorScheme}">`
        : '',
      supportDarkMode
        ? '<meta name="supported-color-schemes" content="light dark">'
        : '',
    ]
      .filter(Boolean)
      .join('\n    ')
    }
    ${[
      buildFontsTags(content, inlineStyle, fonts),
    ]
      .filter((s) => s && String(s).trim().length > 0)
      .join('\n')
    }
    <style>
      ${supportOutlookClassic ? '#outlook a { padding:0; }' : ''}
      body { margin:0;padding:0;text-size-adjust:100%;${supportOutlookClassic ? ' -ms-text-size-adjust:100%;' : ''} }
      table, td { border-collapse:collapse;${supportOutlookClassic ? ' mso-table-lspace:0pt;mso-table-rspace:0pt;' : ''}}
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;${supportOutlookClassic ? ' -ms-interpolation-mode:bicubic;' : ''}}
      p { display:block;margin:1em 0; }
      ${
      supportDarkMode
        ? ':root { color-scheme: light dark; supported-color-schemes:light dark; }'
        : ''
      }
      a[x-apple-data-detectors],
      u + #body a,
      #MessageViewBody a {
        color: inherit !important;
        text-decoration: none !important;
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
