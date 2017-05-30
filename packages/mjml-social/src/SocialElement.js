import { createBodyComponent } from 'mjml-core/lib/createComponent'

const defaultSocialNetworks = {
  facebook: {
    'share-url': 'https://www.facebook.com/sharer/sharer.php?u=[[URL]]',
    'background-color': '#3b5998',
    'src': 'https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png'
  },
  twitter: {
    'share-url': 'https://twitter.com/home?status=[[URL]]',
    'background-color': '#55acee',
    'src': 'https://www.mailjet.com/images/theme/v1/icons/ico-social/twitter.png'
  },
  google: {
    'share-url': 'https://plus.google.com/share?url=[[URL]]',
    'background-color': '#dc4e41',
    'src': 'https://www.mailjet.com/images/theme/v1/icons/ico-social/google-plus.png'
  },
  pinterest: {
    'share-url': 'https://pinterest.com/pin/create/button/?url=[[URL]]&media=&description=',
    'background-color': '#bd081c',
    'src': 'https://www.mailjet.com/images/theme/v1/icons/ico-social/pinterest.png'
  },
  linkedin: {
    'share-url': 'https://www.linkedin.com/shareArticle?mini=true&url=[[URL]]&title=&summary=&source=',
    'background-color': '#0077b5',
    'src': 'https://www.mailjet.com/images/theme/v1/icons/ico-social/linkedin.png'
  },
  instagram: {
    'background-color': '#3f729b',
    'src': 'https://www.mailjet.com/images/theme/v1/icons/ico-social/instagram.png'
  }
}

export default createBodyComponent('mj-social-element', {
  endingTag: true,
  allowedAttributes: {
    'align': 'enum(left,center,right)',
    'color': 'color',
    'border-radius': 'unit(px)',
    'font-family': 'string',
    'font-size': 'unit(px,%)',
    'font-style': 'string',
    'font-weight': 'string',
    'line-height': 'unit(px,%)',
    'name': 'string',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    'padding': 'unit(px,%){1,4}',
    'text-decoration': 'string',
    'width': 'integer'
  },
  defaultAttributes: {
    'align': 'left',
    'color': '#000',
    'border-radius': '3px',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '22px',
    'padding': '10px 25px',
    'text-decoration': 'none',
    'width': '100%'
  },
  getStyles () {
    const { 'icon-size': iconSize, 'background-color': backgroundColor } = this.getSocialAttributes()

    return {
      td: {
        'padding': this.getMjAttribute('inner-padding'),
      },
      table: {
        'background': backgroundColor,
        'border-radius': this.getMjAttribute('border-radius'),
        'width': iconSize,
      },
      icon: {
        'width': iconSize,
        'height': iconSize,
      },
      img: {
        'border-radius': this.getMjAttribute('border-radius'),
      },
      text: {
        'color': this.getMjAttribute('color'),
        'font-size': this.getMjAttribute('font-size'),
        'font-family': this.getMjAttribute('font-family'),
        'line-height': this.getMjAttribute('line-height'),
        'text-decoration': this.getMjAttribute('text-decoration'),
      }
    }
  },
  getSocialAttributes () {
    const socialNetwork = { ...defaultSocialNetworks[this.getMjAttribute('name')] }

    if (socialNetwork['share-url']) {
      socialNetwork['href'] = socialNetwork['share-url'].replace('[[URL]]', this.getMjAttribute('href'))
    }

    return ['icon-size', 'href', 'src', 'background-color'].reduce((r, attr) => {
      r[attr] = (socialNetwork[attr] || this.getMjAttribute(attr))

      return r
    }, {})
  },
  render () {
    const { src, href, 'icon-size': iconSize } = this.getSocialAttributes()
    return `
      <tr>
        <td ${this.generateHtmlAttributes({style: 'td'})}>
          <table
            ${this.generateHtmlAttributes({
              border: '0',
              cellpadding: '0',
              cellspacing: '0',
              role: 'presentation',
              style: 'table',
            })}
          >
            <tr>
              <td ${this.generateHtmlAttributes({style: 'icon'})}>
                <a ${this.generateHtmlAttributes({
                  href: href,
                  rel: this.getMjAttribute('rel'),
                })}>
                    <img
                      ${this.generateHtmlAttributes({
                        alt: this.getMjAttribute('alt'),
                        height: parseInt(iconSize),
                        src: src,
                        style: 'img',
                        width: parseInt(iconSize),
                      })}
                    />
                  </a>
                </td>
                ${this.getMjContent() ? `
                  <td>
                    <a
                      ${this.generateHtmlAttributes({
                        href: href,
                        style: 'text',
                        rel: this.getMjAttribute('rel'),
                      })}>
                      ${this.getMjContent()}
                    </a>
                  </td>
                  ` : ''
                }
              </tr>
          </table>
        </td>
      </tr>
    `
  }
})
