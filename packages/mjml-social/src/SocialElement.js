import { BodyComponent } from 'mjml-core'
import { get, each } from 'lodash'

const IMG_BASE_URL = 'https://www.mailjet.com/images/theme/v1/icons/ico-social/'

const defaultSocialNetworks = {
  facebook: {
    'share-url': 'https://www.facebook.com/sharer/sharer.php?u=[[URL]]',
    'background-color': '#3b5998',
    src: `${IMG_BASE_URL}facebook.png`,
  },
  twitter: {
    'share-url': 'https://twitter.com/intent/tweet?url=[[URL]]',
    'background-color': '#55acee',
    src: `${IMG_BASE_URL}twitter.png`,
  },
  google: {
    'share-url': 'https://plus.google.com/share?url=[[URL]]',
    'background-color': '#dc4e41',
    src: `${IMG_BASE_URL}google-plus.png`,
  },
  pinterest: {
    'share-url':
      'https://pinterest.com/pin/create/button/?url=[[URL]]&media=&description=',
    'background-color': '#bd081c',
    src: `${IMG_BASE_URL}pinterest.png`,
  },
  linkedin: {
    'share-url':
      'https://www.linkedin.com/shareArticle?mini=true&url=[[URL]]&title=&summary=&source=',
    'background-color': '#0077b5',
    src: `${IMG_BASE_URL}linkedin.png`,
  },
  instagram: {
    'background-color': '#3f729b',
    src: `${IMG_BASE_URL}instagram.png`,
  },
  web: {
    src: `${IMG_BASE_URL}web.png`,
    'background-color': '#4BADE9',
  },
  snapchat: {
    src: `${IMG_BASE_URL}snapchat.png`,
    'background-color': '#FFFA54',
  },
  youtube: {
    src: `${IMG_BASE_URL}youtube.png`,
    'background-color': '#EB3323',
  },
  tumblr: {
    src: `${IMG_BASE_URL}tumblr.png`,
    'share-url':
      'https://www.tumblr.com/widgets/share/tool?canonicalUrl=[[URL]]',
    'background-color': '#344356',
  },
  github: {
    src: `${IMG_BASE_URL}github.png`,
    'background-color': '#000000',
  },
  xing: {
    src: `${IMG_BASE_URL}xing.png`,
    'share-url': 'https://www.xing.com/app/user?op=share&url=[[URL]]',
    'background-color': '#296366',
  },
  vimeo: {
    src: `${IMG_BASE_URL}vimeo.png`,
    'background-color': '#53B4E7',
  },
  medium: {
    src: `${IMG_BASE_URL}medium.png`,
    'background-color': '#000000',
  },
  soundcloud: {
    src: `${IMG_BASE_URL}soundcloud.png`,
    'background-color': '#EF7F31',
  },
  dribbble: {
    src: `${IMG_BASE_URL}dribbble.png`,
    'background-color': '#D95988',
  },
}

each(defaultSocialNetworks, (val, key) => {
  defaultSocialNetworks[`${key}-noshare`] = {
    ...val,
    'share-url': '[[URL]]',
  }
})

export default class MjSocialElement extends BodyComponent {
  static componentName = 'mj-social-element'

  static endingTag = true

  static allowedAttributes = {
    align: 'enum(left,center,right)',
    'background-color': 'color',
    color: 'color',
    'border-radius': 'unit(px)',
    'font-family': 'string',
    'font-size': 'unit(px)',
    'font-style': 'string',
    'font-weight': 'string',
    href: 'string',
    'icon-size': 'unit(px,%)',
    'icon-height': 'unit(px,%)',
    'icon-padding': 'unit(px,%){1,4}',
    'line-height': 'unit(px,%,)',
    name: 'string',
    'padding-bottom': 'unit(px,%)',
    'padding-left': 'unit(px,%)',
    'padding-right': 'unit(px,%)',
    'padding-top': 'unit(px,%)',
    padding: 'unit(px,%){1,4}',
    'text-padding': 'unit(px,%){1,4}',
    rel: 'string',
    src: 'string',
    srcset: 'string',
    sizes: 'string',
    alt: 'string',
    title: 'string',
    target: 'string',
    'text-decoration': 'string',
    'vertical-align': 'enum(top,middle,bottom)',
  }

  static defaultAttributes = {
    align: 'left',
    color: '#000',
    'border-radius': '3px',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'line-height': '1',
    padding: '4px',
    'text-padding': '4px 4px 4px 0',
    target: '_blank',
    'text-decoration': 'none',
    'vertical-align': 'middle',
  }

  getStyles() {
    const {
      'icon-size': iconSize,
      'icon-height': iconHeight,
      'background-color': backgroundColor,
    } = this.getSocialAttributes()

    return {
      td: {
        padding: this.getAttribute('padding'),
        'vertical-align': this.getAttribute('vertical-align'),
      },
      table: {
        background: backgroundColor,
        'border-radius': this.getAttribute('border-radius'),
        width: iconSize,
      },
      icon: {
        padding: this.getAttribute('icon-padding'),
        'font-size': '0',
        height: iconHeight || iconSize,
        'vertical-align': 'middle',
        width: iconSize,
      },
      img: {
        'border-radius': this.getAttribute('border-radius'),
        display: 'block',
      },
      tdText: {
        'vertical-align': 'middle',
        padding: this.getAttribute('text-padding'),
      },
      text: {
        color: this.getAttribute('color'),
        'font-size': this.getAttribute('font-size'),
        'font-weight': this.getAttribute('font-weight'),
        'font-style': this.getAttribute('font-style'),
        'font-family': this.getAttribute('font-family'),
        'line-height': this.getAttribute('line-height'),
        'text-decoration': this.getAttribute('text-decoration'),
      },
    }
  }

  getSocialAttributes() {
    const socialNetwork = defaultSocialNetworks[this.getAttribute('name')] || {}
    let href = this.getAttribute('href')

    if (href && get(socialNetwork, 'share-url')) {
      href = socialNetwork['share-url'].replace('[[URL]]', href)
    }

    const attrs = [
      'icon-size',
      'icon-height',
      'srcset',
      'sizes',
      'src',
      'background-color',
    ].reduce(
      (r, attr) => ({
        ...r,
        [attr]: this.getAttribute(attr) || socialNetwork[attr],
      }),
      {},
    )

    return {
      href,
      ...attrs,
    }
  }

  render() {
    const {
      src,
      srcset,
      sizes,
      href,
      'icon-size': iconSize,
      'icon-height': iconHeight,
    } = this.getSocialAttributes()

    const hasLink = !!this.getAttribute('href')

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
            <tbody>
              <tr>
                <td ${this.htmlAttributes({ style: 'icon' })}>
                  ${
                    hasLink
                      ? `<a ${this.htmlAttributes({
                          href,
                          rel: this.getAttribute('rel'),
                          target: this.getAttribute('target'),
                        })}>`
                      : ''
                  }
                    <img
                      ${this.htmlAttributes({
                        alt: this.getAttribute('alt'),
                        title: this.getAttribute('title'),
                        height: parseInt(iconHeight || iconSize, 10),
                        src,
                        style: 'img',
                        width: parseInt(iconSize, 10),
                        sizes,
                        srcset,
                      })}
                    />
                  ${hasLink ? `</a>` : ''}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        ${
          this.getContent()
            ? `
          <td ${this.htmlAttributes({ style: 'tdText' })}>
            ${
              hasLink
                ? `<a
                ${this.htmlAttributes({
                  href,
                  style: 'text',
                  rel: this.getAttribute('rel'),
                  target: this.getAttribute('target'),
                })}>`
                : `<span
                    ${this.htmlAttributes({
                      style: 'text',
                    })}>`
            }
              ${this.getContent()}
            ${hasLink ? `</a>` : '</span>'}
          </td>
          `
            : ''
        }
      </tr>
    `
  }
}
