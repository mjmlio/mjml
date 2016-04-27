import defaultStyle from './defaultStyle'

export default (options = {}) => {
  const { title = '', content = '', fonts = {} } = options

  return (`<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>${title}</title>
<style type="text/css">${defaultStyle}</style>
<!--[if !mso]><!-->${fonts.import || ''}
<style type="text/css">
  @media only screen and (max-width:480px) {
    @-ms-viewport { width:320px; }
    @viewport { width:320px; }
  }
</style>${fonts.link || ''}
<!--<![endif]-->
</head>
<body>
  ${content}
</body>
</html>`)
}
