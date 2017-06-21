import _ from 'lodash'

export default function traverseMJML(mjml, predicate = _.noop) {
  const traverse = (mjml, predicate) => _.map(mjml.children, (child) => {
    if (predicate(child)) {
      return child
    }

    return traverse(child, predicate)
  })

  return _.head(_.flattenDeep(traverse(mjml, predicate)))
}
