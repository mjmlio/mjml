export default function (content) {
  console.log('REACH !');
  if (content === '') {
    return ''
  }

  return `
    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
      ${content}
    </div>
  `
}
