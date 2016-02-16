import MJMLColumnElement from './decorators/MJMLColumnElement'
import React, { Component } from 'react'
import _ from 'lodash'

@MJMLColumnElement({
  tagName: 'mj-social',
  attributes: {
    'facebook-content': 'Share',
    'facebook-href': '[[SHORT_PERMALINK]]',
    'facebook-icon-color' : '#3b5998',
    'font-family': 'Ubuntu, Helvetica, Arial, sans-serif',
    'font-size': '13px',
    'google-content': '+1',
    'google-href': '[[SHORT_PERMALINK]]',
    'google-icon-color': '#dc4e41',
    'icon-size': '20px',
    'instagram-content': 'Share',
    'instagram-href': '[[SHORT_PERMALINK]]',
    'instagram-icon-color': '#3f729b',
    'line-height': '22px',
    'linkedin-content': 'Share',
    'linkedin-href': '[[SHORT_PERMALINK]]',
    'linkedin-icon-color' : '#0077b5',
    'padding': '10 25',
    'mode': 'horizontal',
    'pinterest-content': 'Pin it',
    'pinterest-href': '[[SHORT_PERMALINK]]',
    'pinterest-icon-color': '#bd081c',
    'text-decoration': 'none',
    'text-mode': true,
    'twitter-content': 'Tweet',
    'twitter-href': '[[SHORT_PERMALINK]]',
    'twitter-icon-color': '#55acee',
    'align': 'center',
    'color': '#333333',
    'facebook': true,
    'google': true,
    'instagram': true,
    'linkedin': true,
    'pinterest': true,
    'twitter': true
  }
})
class Social extends Component {

  static baseStyles = {
    a: {
      textDecoration: 'none'
    },
    td1: {
      paddingRight: '16px',
      paddingBottom: '16px'
    },
    td2: {
      paddingLeft: '8px'
    }
  };

  static buttonDefinitions = {
    facebook: {
      linkAttribute: 'https://www.facebook.com/sharer/sharer.php?u=[[URL]]',
      icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png',
      textModeContent: 'Share'
    },
    twitter: {
      linkAttribute: 'https://twitter.com/home?status=[[URL]]',
      icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/twitter.png',
      textModeContent: 'Tweet'
    },
    google: {
      linkAttribute: 'https://plus.google.com/share?url=[[URL]]',
      icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/google-plus.png',
      textModeContent: '+1'
    },
    pinterest: {
      linkAttribute: 'https://pinterest.com/pin/create/button/?url=[[URL]]&ampmedia=&ampdescription=',
      icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/pinterest.png',
      textModeContent: 'Pin it'
    },
    linkedin: {
      linkAttribute: 'https://www.linkedin.com/shareArticle?mini=true&ampurl=[[URL]]&amptitle=&ampsummary=&ampsource=',
      icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/linkedin.png',
      textModeContent: 'Share'
    },
    instagram: {
      linkAttribute: '[[URL]]',
      icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/instagram.png',
      textModeContent: 'Share'
    }
  };

  getStyles() {
    const { mjAttribute } = this.props

    return _.merge({}, this.constructor.baseStyles, {
      a: {
        color: mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize: mjAttribute('font-size'),
        fontStyle: mjAttribute('font-style'),
        fontWeight: mjAttribute('font-weight'),
        lineHeight: mjAttribute('line-height'),
        textDecoration: mjAttribute('text-decoration')
      },
      td1: {
        paddingRight: !this.isInTextMode() ? '8px' : null
      }
    })
  }

  isButtonVisible(platform) {
    const { mjAttribute } = this.props

    return mjAttribute(platform) == true || mjAttribute(platform) == 'true'
  }

  isInTextMode() {
    const { mjAttribute } = this.props

    return mjAttribute('text-mode') == true || mjAttribute('text-mode') == 'true'
  }

  renderSocialButtons() {
    const { mjAttribute } = this.props

    const renderedButtons = []

    for (const platform in this.constructor.buttonDefinitions) {
      if (!this.isButtonVisible(platform)) {
        continue
      }

      const definition = this.constructor.buttonDefinitions[platform]
      const iconStyle = {
        backgroundColor: mjAttribute(`${platform}-icon-color`),
        width: mjAttribute('icon-size'),
        borderRadius: 3
      }

      const renderedButton = (
        <table
          border="0"
          cellPadding="0"
          cellSpacing="0"
          data-legacy-align="left"
          key={platform}>
          <tbody>
            <tr>
              <td style={this.styles.td1}>
                <table
                  border="0"
                  cellPadding="0"
                  cellSpacing="0">
                  <tbody>
                    <tr>
                      <td data-legacy-valign="middle">
                        <a
                          href={definition.linkAttribute.replace('[[URL]]', mjAttribute(`${platform}-href`))}
                          style={this.styles.a}>
                          <img
                            alt={mjAttribute(`${platform}-content`)}
                            src={definition.icon}
                            style={iconStyle} />
                        </a>
                      </td>
                      { this.isInTextMode() &&
                        <td
                          data-legacy-valign="middle"
                          style={this.styles.td2}>
                          <a
                            dangerouslySetInnerHTML={{ __html: mjAttribute(`${platform}-content`) }}
                            href={definition.linkAttribute.replace('[[URL]]', mjAttribute(`${platform}-href`))}
                            style={this.styles.a} />
                        </td> }
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      )

      if (mjAttribute('mode') == 'vertical') {
        renderedButtons.push(<div key={`${platform}-container`}>{renderedButton}</div>)
      }
      else {
        renderedButtons.push(renderedButton)
      }
    }

    return renderedButtons
  }

  render() {
    const { mjAttribute } = this.props

    this.styles = this.getStyles()

    return (
      <table
        border="0"
        cellPadding="0"
        cellSpacing="0"
        data-legacy-align={mjAttribute('align')}>
        <tbody>
          <tr>
            <td
              data-legacy-align={mjAttribute('align')}
              data-legacy-valign="middle">
              {this.renderSocialButtons()}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

}

export default Social
