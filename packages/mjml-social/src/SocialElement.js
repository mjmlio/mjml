import { createBodyComponent } from 'mjml-core/lib/createComponent'

const defaultSocialNetworks = {
  facebook: {
    shareUrl: 'https://www.facebook.com/sharer/sharer.php?u=[[URL]]',
    icon: 'facebook.png'
  },
  twitter: {
    shareUrl: 'https://twitter.com/home?status=[[URL]]',
    icon: 'twitter.png'
  },
  google: {
    shareUrl: 'https://plus.google.com/share?url=[[URL]]',
    icon: 'google-plus.png'
  },
  pinterest: {
    shareUrl: 'https://pinterest.com/pin/create/button/?url=[[URL]]&media=&description=',
    icon: 'pinterest.png'
  },
  linkedin: {
    shareUrl: 'https://www.linkedin.com/shareArticle?mini=true&url=[[URL]]&title=&summary=&source=',
    icon: 'linkedin.png'
  },
  instagram: {
    shareUrl: '[[URL]]',
    icon: 'instagram.png'
  }
}

export default createBodyComponent('mj-social-element', {
  endingTag: true,
  allowedAttributes: {
    'align': 'enum(left,right,center)',
    'cellpadding': 'integer',
    'cellspacing': 'integer',
    'container-background-color': 'color',
    'color': 'color',
    'font-family': 'string',
    'font-size': 'unit(px,%)',
    'font-style': 'string',
    'font-weight': 'string',
    'line-height': 'unit(px,%)',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'padding': 'unit(px,%){1,4}',
    'table-layout': 'enum(auto,fixed)',
    'vertical-align': 'enum(top,bottom,middle)',
    'width': 'integer'
  },
  defaultAttributes: {
    'align': 'left',
    'cellpadding': '0',
    'cellspacing': '0',
    'color': '#000',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'padding': '10px 25px',
    'table-layout': 'auto',
    'width': '100%'
  },
  getStyles () {
    return {
      'cellpadding': this.getMjAttribute('cellspadding'),
      'cellspacing': this.getMjAttribute('cellspacing'),
      'color': this.getMjAttribute('color'),
      'font-family': this.getMjAttribute('font-family'),
      'font-size': this.getMjAttribute('font-size'),
      'line-height': this.getMjAttribute('line-height'),
      'table-layout': this.getMjAttribute('table-layout')
    }
  },
  render () {
    return `<tr><td>element</td></tr>`
  }
})
