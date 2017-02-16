import {MJMLElement, helpers} from 'mjml-core'
import React, {Component} from 'react'

const tagName               = 'mj-button';
const parentTag             = ['mj-column', 'mj-hero-content'];
const endingTag             = true;
const defaultMJMLDefinition = {
  content:    '',
  attributes: {
    'align':            'center',
    'background-color': 'DimGray',
    'border':           null,
    'border-top':       null,
    'border-right':     null,
    'border-bottom':    null,
    'border-left':      null,
    'border-radius':    '3px',
    'box-shadow':       'none',
    'color':            '#fff',
    'font-family':      'Ubuntu,Helvetica,Arial,sans-serif',
    'font-size':        '16px',
    'font-style':       null,
    'font-weight':      '400',
    'line-height':      '21px',
    'margin':           '0 0 15px 0',
    'margin-top':       null,
    'margin-right':     null,
    'margin-bottom':    null,
    'margin-left':      null,
    'padding':          '10px 25px',
    'padding-top':      null,
    'padding-right':    null,
    'padding-bottom':   null,
    'padding-left':     null,
    'text-align':       'center',
    'text-decoration':  'none',
    'text-transform':   'none',
    'width':            '100%'
  }
};
const baseStyles            = {
  table: {
    borderCollapse: 'collapse',
    borderSpacing:  '0',
    padding:        '0',
    textAlign:      'left'
  },
  tr:    {
    padding:   0,
    textAlign: 'left'
  },
  td:    {
    border:         'none',
    borderCollapse: 'collapse',
    hyphens:        'auto',
    margin:         '0',
    MozHyphens:     'auto',
    padding:        '0',
    WebkitHyphens:  'auto',
    wordWrap:       'break-word'
  },
  typo:  {
    margin:  '0',
    padding: '0'
  },
  p:     {
    margin: '0'
  },
  a:     {
    display:       'block',
    textTransform: 'none'
  }
};

@MJMLElement
class Button extends Component {

  styles = this.getStyles();

  getStyles () {
    const {mjAttribute} = this.props;

    return helpers.merge({}, baseStyles, {
      table: {
        margin:       mjAttribute('margin'),
        marginTop:    mjAttribute('margin-top'),
        marginRight:  mjAttribute('margin-right'),
        marginBottom: mjAttribute('margin-bottom'),
        marginLeft:   mjAttribute('margin-left')
      },
      td:    {
        color:      mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize:   mjAttribute('font-size'),
        fontWeight: mjAttribute('font-weight'),
        lineHeight: mjAttribute('line-height'),
        textAlign:  mjAttribute('text-align'),
        width:      mjAttribute('width')
      },
      typo:  {
        color:      mjAttribute('color'),
        fontFamily: mjAttribute('font-family'),
        fontSize:   mjAttribute('font-size'),
        fontStyle:  mjAttribute('font-style'),
        fontWeight: mjAttribute('font-weight'),
        lineHeight: mjAttribute('line-height'),
        textAlign:  mjAttribute('text-align')
      },
      box:   {
        backgroundColor: mjAttribute('background-color'),
        border:          mjAttribute('border'),
        borderRadius:    mjAttribute('border-radius'),
        borderTop:       mjAttribute('border-top'),
        borderRight:     mjAttribute('border-right'),
        borderBottom:    mjAttribute('border-bottom'),
        borderLeft:      mjAttribute('border-left'),
        boxShadow:       mjAttribute('box-shadow'),
        padding:         mjAttribute('padding'),
        paddingTop:      mjAttribute('padding-top'),
        paddingRight:    mjAttribute('padding-right'),
        paddingBottom:   mjAttribute('padding-bottom'),
        paddingLeft:     mjAttribute('padding-left')
      },
      a:     {
        textDecoration: mjAttribute('text-decoration')
      }
    })
  }

  renderButton () {
    const {mjContent, mjAttribute} = this.props;
    if (mjAttribute('href')) {
      return (
        <a href={mjAttribute('href')} style={this.styles.a} target="_blank">
          <table style={{borderCollapse: 'separate', width: '100%'}}>
            <tbody>
              <tr>
                <td style={this.styles.box}>
                  <p dangerouslySetInnerHTML={{__html: mjContent()}} style={this.styles.typo} />
                </td>
              </tr>
            </tbody>
          </table>
        </a>)
    }
    return (
      <table style={{borderCollapse: 'separate', width: '100%'}}>
        <tbody>
          <tr>
            <td style={this.styles.box}>
              <p dangerouslySetInnerHTML={{__html: mjContent()}} style={this.styles.typo} />
            </td>
          </tr>
        </tbody>
      </table>)
  }

  render () {
    const {mjAttribute} = this.props;
    return (
      <div align="center">
        <table role="presentation" cellPadding="0" cellSpacing="0" align={mjAttribute('align')} data-legacy-align={mjAttribute('align')} data-legacy-border="0" style={this.styles.table}>
          <tbody>
            <tr style={{padding: '0', textAlign: 'left', verticalAlign: 'top'}}>
              <td style={{Margin: '0', margin: '0', padding: '0', borderCollapse: 'collapse', textAlign: 'left', verticalAlign: 'top'}}>
                <table style={{ borderCollapse: 'separate', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                  <tbody>
                    <tr style={this.styles.tr}>
                      <td style={this.styles.td}>
                        {this.renderButton()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

Button.tagName               = tagName;
Button.parentTag             = parentTag;
Button.endingTag             = endingTag;
Button.defaultMJMLDefinition = defaultMJMLDefinition;
Button.baseStyles            = baseStyles;

export default Button;
