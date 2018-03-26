const MJMLParser = require('../lib/index.js')
const { components } = require('mjml-core')
const chai = require('chai')
const { displayDiff, omitDeepLodash } = require('./test-utils')

const mjml = `
<mjml>
  <mj-body>
    <mj-section background-color="#CCCCCC" full-width="full-width">
      <mj-button href="<% dynamic %>" pouf="$2">
        &end<br />
        Blu & end $1
        &amp;
        lorem
      </mj-button>
      <mj-button href="http://mjml.io?encodedUrl=http%3A%2F%2Fmjml.io&coin=coi">
        Blu
      </mj-button>
      <mj-button href="&é(§&è!çà)">http%3A%2F%2Fmjml.io</mj-button>
      <mj-raw>
        <coin color="#CCCCCC">bla</coin>
      </mj-raw>
    </mj-section>
  </mj-body>
</mjml>
`

const validJson = {
  "file": ".",
  "line": 2,
  "includedIn": [],
  "tagName": "mjml",
  "children": [
    {
      "file": ".",
      "line": 3,
      "includedIn": [],
      "tagName": "mj-body",
      "children": [
        {
          "file": ".",
          "line": 4,
          "includedIn": [],
          "tagName": "mj-section",
          "attributes": {
            "background-color": "#CCCCCC",
            "full-width": "full-width"
          },
          "children": [
            {
              "file": ".",
              "line": 5,
              "includedIn": [],
              "tagName": "mj-button",
              "attributes": {
                "href": "<% dynamic %>",
                "pouf": "$2"
              },
              "children": [
                {
                  "file": ".",
                  "line": 6,
                  "includedIn": [],
                  "tagName": "br",
                  "attributes": {}
                }
              ],
              "content": "&end\n        Blu & end $1\n        &amp;\n        lorem"
            },
            {
              "file": ".",
              "line": 11,
              "includedIn": [],
              "tagName": "mj-button",
              "attributes": {
                "href": "http://mjml.io?encodedUrl=http%3A%2F%2Fmjml.io&coin=coi"
              },
              "content": "Blu"
            },
            {
              "file": ".",
              "line": 14,
              "includedIn": [],
              "tagName": "mj-button",
              "attributes": {
                "href": "&é(§&è!çà)"
              },
              "content": "http%3A%2F%2Fmjml.io"
            },
            {
              "file": ".",
              "line": 15,
              "includedIn": [],
              "tagName": "mj-raw",
              "children": [
                {
                  "file": ".",
                  "line": 16,
                  "includedIn": [],
                  "tagName": "coin",
                  "attributes": {
                    "color": "#CCCCCC"
                  },
                  "content": "bla"
                }
              ],
              "attributes": {}
            }
          ]
        }
      ],
      "attributes": {}
    }
  ],
  "attributes": {}
}

const json = MJMLParser(mjml, {
  keepComments: true,
  components,
  filePath: '.'
})

displayDiff(validJson, omitDeepLodash(json, 'absoluteFilePath'))

chai.expect(validJson)
    .to.deep.equal(omitDeepLodash(json, 'absoluteFilePath'))
