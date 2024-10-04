import chai from 'chai'
import spies from 'chai-spies'
import mjml from '../src'
import { HeadComponent, registerComponent } from '../../mjml-core/src/index'

async function run() {
  chai.use(spies)

  const addStyle = chai.spy(
    breakpoint => `
      @media only screen and (max-width:${breakpoint}) {
        h1 {
          font-size: 20px;
        }
      }
    `
  )

  class HeadComponentWithFunctionStyle extends HeadComponent {
    handler() {
      const { add } = this.context
      add('style', addStyle)
    }
  }
  HeadComponentWithFunctionStyle.componentName = 'mj-head-component-with-function-style'
  HeadComponentWithFunctionStyle.endingTag = true
  HeadComponentWithFunctionStyle.allowedAttributes = {}

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
}

run()
