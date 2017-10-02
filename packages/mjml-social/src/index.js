import { MJMLElement, helpers } from 'mjml-core'
import tap from 'lodash/tap'
import clone from 'lodash/clone'
import React, { Component } from 'react'

const tagName = 'mj-social'
const parentTag = ['mj-column', 'mj-hero-content']
const selfClosingTag = true
const defaultMJMLDefinition = {
  attributes: {
    'align': 'center',
    'base-url': 'https://www.mailjet.com/images/theme/v1/icons/ico-social/',
    'border-radius': '3px',
    'color': '#333333',
    'container-background-color': null,
    'display': 'facebook:share twitter:share google:share',
    'facebook-content': 'Share',
    'facebook-href': '[[SHORT_PERMALINK]]',
    'facebook-rel': null,
    'facebook-icon-color' : '#3b5998',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'google-content': '+1',
    'google-href': '[[SHORT_PERMALINK]]',
    'google-rel': null,
    'google-icon-color': '#dc4e41',
    'icon-size': '20px',
    'inner-padding': null,
    'instagram-content': 'Share',
    'instagram-href': '[[SHORT_PERMALINK]]',
    'instagram-rel': null,
    'instagram-icon-color': '#3f729b',
    'line-height': '22px',
    'linkedin-content': 'Share',
    'linkedin-href': '[[SHORT_PERMALINK]]',
    'linkedin-rel': null,
    'linkedin-icon-color' : '#0077b5',
    'mode': 'horizontal',
    'padding-bottom': null,
    'padding-left': null,
    'padding-right': null,
    'padding-top': null,
    'padding': '10px 25px',
    'pinterest-content': 'Pin it',
    'pinterest-href': '[[SHORT_PERMALINK]]',
    'pinterest-rel': null,
    'pinterest-icon-color': '#bd081c',
    'text-decoration': 'none',
    'text-mode': true,
    'twitter-content': 'Tweet',
    'twitter-href': '[[SHORT_PERMALINK]]',
    'twitter-rel': null,
    'twitter-icon-color': '#55acee',
    'vertical-align': null
  }
}
const baseStyles = {
  tableHorizontal: {
    float: 'none',
    display: 'inline-table'
  },
  tableVertical: {
    margin: '0px'
  },
  td1: {
    padding: '4px',
    verticalAlign: 'middle'
  },
  td2:  {
    fontSize: '0',
    verticalAlign: 'middle'
  },
  tdText: {
    padding: '4px 4px 4px 0',
    verticalAlign: 'middle'
  },
  a: {
    textDecoration: 'none',
    textAlign: 'left',
    display: 'block'
  },
  img: {
    display: 'block'
  }
}
const buttonDefinitions = {
  facebook: {
    linkAttribute: 'https://www.facebook.com/sharer/sharer.php?u=[[URL]]',
    icon: 'facebook.png'
  },
  twitter: {
    linkAttribute: 'https://twitter.com/home?status=[[URL]]',
    icon: 'twitter.png'
  },
  google: {
    linkAttribute: 'https://plus.google.com/share?url=[[URL]]',
    icon: 'google-plus.png'
  },
  pinterest: {
    linkAttribute: 'https://pinterest.com/pin/create/button/?url=[[URL]]&amp;media=&amp;description=',
    icon: 'pinterest.png'
  },
  linkedin: {
    linkAttribute: 'https://www.linkedin.com/shareArticle?mini=true&amp;url=[[URL]]&amp;title=&amp;summary=&amp;source=',
    icon: 'linkedin.png'
  },
  instagram: {
    linkAttribute: '[[URL]]',
    icon: 'instagram.png'
  }
}
const postRender = $ => {
  $('.mj-social-outlook-open').each(function () {
    $(this).replaceWith(`${helpers.startConditionalTag}
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="${$(this).attr('align')}"><tr><td>
      ${helpers.endConditionalTag}`)
  })

  $('.mj-social-outlook-line').each(function () {
    $(this).replaceWith(`${helpers.startConditionalTag}
      </td><td>
      ${helpers.endConditionalTag}`)
  })

  $('.mj-social-outlook-close').each(function () {
    $(this).replaceWith(`${helpers.startConditionalTag}
      </td></tr></table>
      ${helpers.endConditionalTag}`)
  })

  return $
}

@MJMLElement
class Social extends Component {

  styles = this.getStyles()

  getStyles () {
    const { mjAttribute, defaultUnit } = this.props

    return helpers.merge({}, baseStyles, {
      a: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: defaultUnit(mjAttribute('font-size'), 'px'),
        fontStyle: mjAttribute('font-style'),
        fontWeight: mjAttribute('font-weight'),
        lineHeight: mjAttribute('line-height'),
        textDecoration: mjAttribute('text-decoration'),
        borderRadius: defaultUnit(mjAttribute('border-radius'), 'px')
      },
      img: {
        borderRadius: defaultUnit(mjAttribute('border-radius'), 'px')
      },
      td1: {
        padding: defaultUnit(mjAttribute('inner-padding'))
      },
      td2: {
        width: defaultUnit(mjAttribute('icon-size'), 'px'),
        height: defaultUnit(mjAttribute('icon-size'), 'px')
      }
    })
  }

  isHorizontal () {
    const { mjAttribute } = this.props

    return mjAttribute('mode') == 'horizontal'
  }

  isInTextMode () {
    const { mjAttribute } = this.props

    return mjAttribute('text-mode') === true || mjAttribute('text-mode') === 'true'
  }

  renderSocialButton (platform, share) {
    const { mjAttribute } = this.props
    const definition = this.getDefinitionForPlatform(platform)

    const href = share ? definition.linkAttribute.replace('[[URL]]', mjAttribute(`${platform}-href`)) : mjAttribute(`${platform}-href`)
    const iconStyle = {
      background: mjAttribute(`${platform}-icon-color`),
      borderRadius: this.styles.img.borderRadius,
      width: mjAttribute('icon-size')
    }

    return (
      <tr key={platform}>
        <td style={this.styles.td1}>
          <table
            role="presentation"
            cellPadding="0"
            cellSpacing="0"
            data-legacy-border="0"
            style={iconStyle}>
            <tbody>
              <tr>
                <td
                  style={this.styles.td2}>
                  <a href={href} rel={mjAttribute(`${platform}-rel`)}>
                    <img
                      alt={platform}
                      height={parseInt(mjAttribute('icon-size'))}
                      src={definition.icon}
                      style={this.styles.img}
                      width={parseInt(mjAttribute('icon-size'))} />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        { this.isInTextMode() &&
          <td style={this.styles.tdText}>
            <a
              dangerouslySetInnerHTML={{ __html: mjAttribute(`${platform}-content`) }}
              href={href}
              style={this.styles.a} />
          </td> }
      </tr>
    )
  }

  getDefinitionForPlatform (platform) {
    const { mjAttribute } = this.props

    if (buttonDefinitions[platform]) {
      return tap(clone(buttonDefinitions[platform]), buttonDefinition => buttonDefinition.icon = mjAttribute('base-url') + buttonDefinition.icon)
    }

    if (!mjAttribute(`${platform}-icon-color`) || !mjAttribute(`${platform}-icon`) || !mjAttribute(`${platform}-href`) || (this.isInTextMode() && !mjAttribute(`${platform}-content`)) ) {
      return
    }

    return {
      linkAttribute: "[[URL]]",
      icon: mjAttribute(`${platform}-icon`)
    }
  }

  renderSocialButtons () {
    const { mjAttribute } = this.props
    const platforms = mjAttribute('display')

    if (!platforms) {
      return
    }

    return platforms.split(' ').map(label => {
      const platform = label.split(':')[0]
      const share = label.split(':')[1]

      if (!this.getDefinitionForPlatform(platform)) {
        return null
      }

      return this.renderSocialButton(platform, share !== 'url')
    })
  }

  renderHorizontal () {
    const { mjAttribute } = this.props
    const socialButtons = this.renderSocialButtons().map((socialButton, index) => {
      return (
        <table
          role="presentation"
          cellPadding="0"
          cellSpacing="0"
          data-legacy-align={mjAttribute('align')}
          data-legacy-border="0"
          key={`wrapped-social-button-${index}`} // eslint-disable-line react/no-array-index-key
          style={this.styles.tableHorizontal}>
          <tbody>
            {socialButton}
          </tbody>
        </table>
      )
    }).reduce((result, socialButton, index) => {
      result.push(socialButton)
      result.push((
        <div
          className="mj-social-outlook-line"
          key={`outlook-line-${index}`} // eslint-disable-line react/no-array-index-key
        />
      ))

      return result
    }, [<div className="mj-social-outlook-open" key="outlook-open" data-legacy-align={mjAttribute('align')} />])

    socialButtons[socialButtons.length - 1] = <div className="mj-social-outlook-close" key="outlook-close" />

    return socialButtons
  }

  renderVertical () {
    const { mjAttribute } = this.props

    return (
      <table
        role="presentation"
        cellPadding="0"
        cellSpacing="0"
        data-legacy-border="0"
        data-legacy-align={mjAttribute('align')}
        style={this.styles.tableVertical}>
        <tbody>
          {this.renderSocialButtons()}
        </tbody>
      </table>
    )
  }

  render () {
    return (
      <div>
        { this.isHorizontal() ? this.renderHorizontal() : this.renderVertical() }
      </div>
    )
  }

}

Social.tagName = tagName
Social.parentTag = parentTag
Social.selfClosingTag = selfClosingTag
Social.defaultMJMLDefinition = defaultMJMLDefinition
Social.baseStyles = baseStyles
Social.buttonDefinitions = buttonDefinitions
Social.postRender = postRender

export default Social
