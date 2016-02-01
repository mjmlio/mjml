export default `
  #outlook a { padding: 0; }
  .ReadMsgBody { width: 100%; }
  .ExternalClass { width: 100%; }
  .ExternalClass * { line-height:100%; }
	body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
	table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  p {
    display: block;
    margin: 13px 0;
  }
  @media only screen and (min-width:480px) {
    .mj-1column, * [aria-labelledby="mj-1column"] { width:100%!important; }
    .mj-2column, * [aria-labelledby="mj-2column"] { width:50%!important; }
    .mj-3column, * [aria-labelledby="mj-3column"] { width:33.3333%!important; }
    .mj-4column, * [aria-labelledby="mj-4column"] { width:25%!important; }
  }
`
