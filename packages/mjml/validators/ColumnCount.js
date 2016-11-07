const tagName = 'mj-column';
const columnLimit = 4;
const formatValidationError = require('../lib').formatValidationError

module.exports = function ColumnCount (element) {
  const typeCount = {};

  for (let i = 0; typeof element.children == 'object' && element.children.length > 0 && i < element.children.length; i++) {
    const child = element.children[i];

    if (child.tagName == tagName) {
      try {
        if (typeCount[element.lineNumber][tagName] == 'undefined') {
          typeCount[element.lineNumber][tagName] = 0;
        }
      } catch (e) {
        typeCount[element.lineNumber] = {};
        typeCount[element.lineNumber][tagName] = 0;
      }

      typeCount[element.lineNumber][tagName]++;

      if (typeCount[element.lineNumber][tagName] > columnLimit) {
        return formatValidationError('Column count exceeded', element);
      }
    }
  }
  return;
}
