import merge from 'lodash/merge'

const dependencies = {}

export const registerDependencies = dep => merge(dependencies, dep)

export default dependencies
