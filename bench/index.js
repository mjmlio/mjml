var Benchmark = require('benchmark')
var fs = require('fs')
var mjml = require('../lib/index')
var path = require('path')
var template = fs.readFileSync(path.resolve(__dirname, './template.mjml')).toString()

var bench = new Benchmark('mjml2html', function () {
  mjml.mjml2html(template)
}, {
  minSamples: 100,
  onComplete: function (e) {
    console.log(String(e.target))
  }
})

bench.run()
