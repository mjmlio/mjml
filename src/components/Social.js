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
    'padding': '10px 25px',
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
    'display': 'facebook twitter google',
    'base-url': 'https://www.mailjet.com/images/theme/v1/icons/ico-social/'
  }
})
class Social extends Component {

  static baseStyles = {
    div: {
      textAlign: "center"
    },
    tableHorizontal: {
      float: "none",
      display: "inline-table"
    },
    tableVertical: {
      margin: "0 auto"
    },
    td1: {
      verticalAlign: "middle"
    },
    td2:  {
      textAlign: "center",
      verticalAlign: "middle"
    },
    tdText: {
      padding: "0 8px",
      verticalAlign: "middle"
    },
    a: {
      textDecoration: 'none',
      display: "block",
      borderRadius: "3px"
    },
    img: {
      display: 'block',
      borderRadius: '3px'
    }
  };

  static buttonDefinitions = {
    facebook: {
      linkAttribute: 'https://www.facebook.com/sharer/sharer.php?u=[[URL]]',
      icon: 'facebook.png',
      textModeContent: 'Share'
    },
    twitter: {
      linkAttribute: 'https://twitter.com/home?status=[[URL]]',
      icon: 'twitter.png',
      textModeContent: 'Tweet'
    },
    google: {
      linkAttribute: 'https://plus.google.com/share?url=[[URL]]',
      icon: 'google-plus.png',
      textModeContent: '+1'
    },
    pinterest: {
      linkAttribute: 'https://pinterest.com/pin/create/button/?url=[[URL]]&ampmedia=&ampdescription=',
      icon: 'pinterest.png',
      textModeContent: 'Pin it'
    },
    linkedin: {
      linkAttribute: 'https://www.linkedin.com/shareArticle?mini=true&ampurl=[[URL]]&amptitle=&ampsummary=&ampsource=',
      icon: 'linkedin.png',
      textModeContent: 'Share'
    },
    instagram: {
      linkAttribute: '[[URL]]',
      icon: 'instagram.png',
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
        padding: "8px 0"
      },
      td2: {
        width: mjAttribute('icon-size'),
        height: mjAttribute('icon-size')
      }
    })
  }

  isHorizontal() {
    const { mjAttribute } = this.props

    return mjAttribute('mode') == 'horizontal'
  }

  isInTextMode() {
    const { mjAttribute } = this.props

    return mjAttribute('text-mode') == true || mjAttribute('text-mode') == 'true'
  }

  renderSocialButton(platform) {
    const { mjAttribute } = this.props
    const definition = this.constructor.buttonDefinitions[platform]
    const href = definition.linkAttribute.replace('[[URL]]', mjAttribute(`${platform}-href`))
    const iconStyle = {
      background: mjAttribute(`${platform}-icon-color`),
      width: mjAttribute('icon-size'),
      borderRadius: 3
    }

    return (
      <tr key={platform}>
        <td style={this.styles.td1}>
          <table border="0" cellPadding="0" cellSpacing="0" style={iconStyle}>
            <tbody>
              <tr>
                <td style={this.styles.td2}>
                  <a href={href}>
                    <img src={mjAttribute('base-url') + definition.icon}
                        width={parseInt(mjAttribute('icon-size'))}
                        height={parseInt(mjAttribute('icon-size'))}
                        alt={platform}
                        border="0"
                        style={this.styles.img} />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        { this.isInTextMode() &&
        <td style={this.styles.tdText}>
          <a style={this.styles.a}
             dangerouslySetInnerHTML={{ __html: mjAttribute(`${platform}-content`) }}
             href={href}/>
         </td> }
      </tr>
    )
  }

  renderSocialButtons() {
    const { mjAttribute } = this.props
    const platforms = mjAttribute('display')

    if (!platforms) {
      return;
    }

    return platforms.split(' ').map( (platform) => {
      if (!this.constructor.buttonDefinitions[platform]) {
        return;
      }

      return this.renderSocialButton(platform)
    })
  }

  renderHorizontal() {
    const socialButtons = this.renderSocialButtons().map((socialButton, index) => {
      return (
        <table border="0" cellPadding="0" cellSpacing="0" data-legacy-align="left" style={this.styles.tableHorizontal} key={`wrapped-social-button-${index}`}>
          <tbody>
            {socialButton}
          </tbody>
        </table>
      )
    }).reduce((result, socialButton, index) => {
      result.push(socialButton)
      result.push(<div className="mj-social-outlook-line" key={`outlook-line-${index}`} />)

      return result
    }, [<div className="mj-social-outlook-open" key="outlook-open"/>])

    socialButtons[socialButtons.length - 1] = <div className="mj-social-outlook-close" key="outlook-close"/>

    return socialButtons
  }

  renderVertical() {
    return (
      <table border="0" cellPadding="0" cellSpacing="0" align="center" style={this.styles.tableVertical}>
        <tbody>
          {this.renderSocialButtons()}
        </tbody>
      </table>
    )
  }

  render() {
    this.styles = this.getStyles()

    return (
      <div style={this.styles.div}>
       { this.isHorizontal() ? this.renderHorizontal() : this.renderVertical() }
     </div>
   )
  }

}

export default Social
