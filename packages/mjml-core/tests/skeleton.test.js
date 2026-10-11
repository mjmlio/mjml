const chai = require('chai')
const { load } = require('cheerio')
const skeleton = require('../lib/helpers/skeleton')

describe('skeleton', () => {
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

  testValues.forEach(({ options, outputStyleCount }, index) => {
    it(`renders expected <style> tag count (case ${index + 1})`, () => {
      const $ = load(skeleton(options))

      chai
        .expect($('head style').get().length, 'Unexpected number of style tags')
        .to.equal(outputStyleCount)
    })
  })

  it('renders accordion style in its own type="text/css" block', () => {
    const $ = load(
      skeleton({
        headStyle: {
          'custom-component': () => '.custom-component { background: orange; }',
          'mj-accordion': () => '@goodbye { @gmail }',
        },
      }),
    )

    chai.expect($('head style').get().length).to.equal(3)
    chai.expect($('head style[type="text/css"]').get().length).to.equal(1)
  })

  describe('dark mode support', () => {
    it('is opt-in: no meta tags by default', () => {
      const $ = load(skeleton({}))

      chai.expect($('meta[name="color-scheme"]').get().length).to.equal(0)
      chai
        .expect($('meta[name="supported-color-schemes"]').get().length)
        .to.equal(0)
    })

    it('adds meta tags when supportDarkMode is true', () => {
      const $ = load(skeleton({ supportDarkMode: true }))

      chai.expect($('meta[name="color-scheme"]').get().length).to.equal(1)
      chai
        .expect($('meta[name="supported-color-schemes"]').get().length)
        .to.equal(1)
    })
  })

  describe('gmail force light mode', () => {
    const getColorSchemeMeta = ($) =>
      $('meta[name="color-scheme"]').attr('content')

    const hasRootColorScheme = ($) =>
      $('head style')
        .text()
        .includes(':root { color-scheme: light dark;')

    it('uses "light dark" meta when only supportDarkMode is true', () => {
      const $ = load(skeleton({ supportDarkMode: true }))

      chai.expect(getColorSchemeMeta($)).to.equal('light dark')
      chai.expect(hasRootColorScheme($)).to.equal(true)
    })

    it('uses only the "light only" meta but keeps :root dark mode CSS when both are true', () => {
      const $ = load(skeleton({ supportDarkMode: true, gmailForceLightMode: true }))

      chai.expect($('meta[name="color-scheme"]').get().length).to.equal(1)
      chai.expect(getColorSchemeMeta($)).to.equal('light only')
      chai
        .expect($('meta[name="supported-color-schemes"]').get().length)
        .to.equal(0)
      chai.expect(hasRootColorScheme($)).to.equal(true)
    })

    it('uses "light only" meta without dark mode CSS when only gmailForceLightMode is true', () => {
      const $ = load(skeleton({ gmailForceLightMode: true }))

      chai.expect(getColorSchemeMeta($)).to.equal('light only')
      chai
        .expect($('meta[name="supported-color-schemes"]').get().length)
        .to.equal(0)
      chai.expect(hasRootColorScheme($)).to.equal(false)
    })
  })
})
