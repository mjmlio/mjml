const mjml = require('../lib/index.js')
const chai = require('chai')
const spies = require('chai-spies')

chai.use(spies)

const {
  HeadComponent,
  registerComponent,
} = require('../../mjml-core/lib/index')


const addStyle = chai.spy(
  (breakpoint) => `
    @media only screen and (max-width:${breakpoint}) {
      h1 {
        font-size: 20px;
      }
    }
  `,
)

class HeadComponentWithFunctionStyle extends HeadComponent {
  static componentName = 'mj-head-component-with-function-style'
  static endingTag = true
  static allowedAttributes = {}

  handler() {
    const { add } = this.context
    add('style', addStyle)
  }
}

registerComponent(HeadComponentWithFunctionStyle)

mjml(`
<mjml>
  <mj-head>
    <mj-head-component-with-function-style />
    <mj-breakpoint width="300px" />
  </mj-head>
  <mj-body>
  </mj-body>
</mjml>
`)

chai.expect(addStyle).to.have.been.called.with('300px')
