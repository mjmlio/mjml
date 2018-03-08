import { BodyComponent } from 'mjml-core'

const defaultSocialNetworks = {
  facebook: {
    'share-url': 'https://www.facebook.com/sharer/sharer.php?u=[[URL]]',
    'background-color': '#3b5998',
    src:
      'https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png',
  },
  twitter: {
    'share-url': 'https://twitter.com/home?status=[[URL]]',
    'background-color': '#55acee',
    src: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/twitter.png',
  },
  google: {
    'share-url': 'https://plus.google.com/share?url=[[URL]]',
    'background-color': '#dc4e41',
    src:
      'https://www.mailjet.com/images/theme/v1/icons/ico-social/google-plus.png',
  },
  pinterest: {
    'share-url':
      'https://pinterest.com/pin/create/button/?url=[[URL]]&media=&description=',
    'background-color': '#bd081c',
    src:
      'https://www.mailjet.com/images/theme/v1/icons/ico-social/pinterest.png',
  },
  linkedin: {
    'share-url':
      'https://www.linkedin.com/shareArticle?mini=true&url=[[URL]]&title=&summary=&source=',
    'background-color': '#0077b5',
    src:
      'https://www.mailjet.com/images/theme/v1/icons/ico-social/linkedin.png',
  },
  instagram: {
    'background-color': '#3f729b',
    src:
      'https://www.mailjet.com/images/theme/v1/icons/ico-social/instagram.png',
  },
}

export default class MjSocialElement extends BodyComponent {
  static endingTag = true

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    'background-color': 'color',
    color: 'color',
    'border-radius': 'unit(px)',
    'font-family': 'string',
    'font-size': 'unit(px,%)',
    'font-style': 'string',
    'font-weight': 'string',
    href: 'string',
    'icon-size': 'unit(px,%)',
    'line-height': 'unit(px,%)',
    name: 'string',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    src: 'string',
    target: 'string',
    'text-decoration': 'string',
  }

  static defaultAttributes = {
    align: 'left',
    color: '#000',
    'border-radius': '3px',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '1',
    padding: '4px',
    target: '_blank',
    'text-decoration': 'none',
  }

  getStyles() {
    const {
      'icon-size': iconSize,
      'background-color': backgroundColor,
    } = this.getSocialAttributes()

    return {
      td: {
        padding: this.getAttribute('padding'),
      },
      table: {
        background: backgroundColor,
        'border-radius': this.getAttribute('border-radius'),
        width: iconSize,
      },
      icon: {
        'font-size': '0',
        height: iconSize,
        'vertical-align': 'middle',
        width: iconSize,
      },
      img: {
        'border-radius': this.getAttribute('border-radius'),
      },
      tdText: {
        'vertical-align': 'middle',
        padding: '4px 4px 4px 0',
      },
      text: {
        color: this.getAttribute('color'),
        'font-size': this.getAttribute('font-size'),
        'font-family': this.getAttribute('font-family'),
        'line-height': this.getAttribute('line-height'),
        'text-decoration': this.getAttribute('text-decoration'),
      },
    }
  }

  getSocialAttributes() {
    const socialNetwork = {
      ...defaultSocialNetworks[this.getAttribute('name')],
    }

    if (socialNetwork['share-url']) {
      socialNetwork.href = socialNetwork['share-url'].replace(
        '[[URL]]',
        this.getAttribute('href'),
      )
    }

    return ['icon-size', 'href', 'src', 'background-color'].reduce(
      (r, attr) => ({
        ...r,
        [attr]: socialNetwork[attr] || this.getAttribute(attr),
      }),
      {},
    )
  }

  render() {
    const { src, href, 'icon-size': iconSize } = this.getSocialAttributes()

    return `
      <tr
        ${this.htmlAttributes({
          class: this.getAttribute('css-class'),
        })}
      >
        <td ${this.htmlAttributes({ style: 'td' })}>
          <table
            ${this.htmlAttributes({
              border: '0',
              cellpadding: '0',
              cellspacing: '0',
              role: 'presentation',
              style: 'table',
            })}
          >
            <tr>
              <td ${this.htmlAttributes({ style: 'icon' })}>
                <a ${this.htmlAttributes({
                  href,
                  rel: this.getAttribute('rel'),
                })}>
                    <img
                      ${this.htmlAttributes({
                        alt: this.getAttribute('alt'),
                        height: parseInt(iconSize, 10),
                        src,
                        style: 'img',
                        width: parseInt(iconSize, 10),
                      })}
                    />
                  </a>
                </td>
              </tr>
          </table>
          ${this.getContent()
            ? `
            <td ${this.htmlAttributes({ style: 'tdText' })} >
              <a
                ${this.htmlAttributes({
                  href,
                  style: 'text',
                  rel: this.getAttribute('rel'),
                })}>
                ${this.getContent()}
              </a>
            </td>
            `
            : ''}
        </td>
      </tr>
    `
  }
}
