import merge from 'lodash/merge'

export const registerDependencies = dep => merge(dependencies, dep)

const dependencies = {}

export default dependencies
