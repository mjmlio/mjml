const Benchmark = require('benchmark')
const fs = require('fs')
const { MJMLRenderer } = require('../lib/index')
const path = require('path')
const template = fs.readFileSync(path.resolve(__dirname, './template.mjml')).toString()

const bench = new Benchmark('mjml2html', function () {
  new MJMLRenderer(template).render()
}, {
  minSamples: 100,
  onComplete: function (e) {
    console.log(String(e.target))
  }
})

bench.run()
