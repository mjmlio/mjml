import _ from 'lodash'

import {
  createHeadComponent,
} from 'mjml-core/lib/createComponent'

export default createHeadComponent('mj-head', {
  handler () {
    this.handlerChildren()
  }
})
