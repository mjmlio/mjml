export default `
  #outlook a { padding: 0; }
  .ReadMsgBody { width: 100%; }
  .ExternalClass { width: 100%; }
  .ExternalClass * { line-height:100%; }
  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  p { display: block; margin: 13px 0; }
  .mj-carousel noinput { display:block !important; }
  .mj-carousel noinput .mj-carousel-image-1 { display: block !important;  }
  .mj-carousel noinput .mj-carousel-arrows,
  .mj-carousel noinput .mj-carousel-thumbnails { display: none !important; }

  [owa] .mj-carousel-thumbnail { display: none !important; }

  @media screen yahoo {
    .mj-carousel-previous-icons,
    .mj-carousel-next-icons {
      display: none !important;
    }

    .mj-carousel-radio-1:checked + * + * + * + * + .mj-carousel-content .mj-carousel-thumbnail-1 {
      border-color: transparent;
    }
  }
`
