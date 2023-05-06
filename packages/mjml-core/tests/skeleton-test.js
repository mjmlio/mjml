const chai = require('chai')
const { load } = require('cheerio')
const skeleton = require('../lib/helpers/skeleton')

// The conditional style tag for Outlook does not get parsed by cheerio,
// so each outputStyleCount excludes it
const testValues = [
  {
    options: {},
    outputStyleCount: 1,
  },
  {
    options: {
      componentsHeadStyle: [
        () => '.custom-component-1 .custom-child { background: red; }',
      ],
    },
    outputStyleCount: 2,
  },
  {
    options: {
      headStyle: {
        'custom-component': () =>
          '.custom-component .custom-child { background: orange; }',
      },
    },
    outputStyleCount: 2,
  },
  {
    options: {
      componentsHeadStyle: [
        () => '.custom-component-1 .custom-child { background: yellow; }',
      ],
      headStyle: {
        'custom-component': () =>
          '.custom-component .custom-child { background: green; }',
      },
    },
    outputStyleCount: 2,
  },
  {
    options: {
      style: ['#title { background: blue; }'],
    },
    outputStyleCount: 2,
  },
  {
    options: {
      componentsHeadStyle: [
        () => '.custom-component-1 .custom-child { background: purple; }',
      ],
      headStyle: {
        'custom-component': () =>
          '.custom-component .custom-child { background: black; }',
      },
      style: [() => '#title { background: white; }'],
    },
    outputStyleCount: 3,
  },
]

testValues.forEach((testUnit) => {
  const { options, outputStyleCount } = testUnit

  const $ = load(skeleton(options))

  chai
    .expect($('head style').get().length, 'Unexpected number of style tags')
    .to.equal(outputStyleCount)
})
