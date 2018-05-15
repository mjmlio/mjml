const MJMLParser = require('../lib/index.js')
require('mjml')
const components = require('mjml-core').components
const chai = require('chai')
const displayDiff = require('./test-utils').displayDiff
const omitDeepLodash = require('./test-utils').omitDeepLodash

/*
  If test fails, run it with --debug to log the details of the diff
*/

const mjml1 = `
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

const validJson1 = {
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
              "content": "&end<br />\n        Blu & end $1\n        &amp;\n        lorem"
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
              "content": "<coin color=\"#CCCCCC\">bla</coin>",
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

const mjml2 = `
<mjml>
  <mj-body>
    <mj-text-test-wrapper>
      <mj-text>MJML</mj-text>
      <mj-text attr="val">FTW</mj-text>
    </mj-text-test-wrapper>
    <mj-text-test-wrapper>
      <mj-text attr="val">FTW</mj-text>
      <mj-text>MJML</mj-text>
    </mj-text-test-wrapper>
  </mj-body>
</mjml>
`

const validJson2 = {
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
          "tagName": "mj-text-test-wrapper",
          "children": [
            {
              "file": ".",
              "line": 5,
              "includedIn": [],
              "tagName": "mj-text",
              "content": "MJML",
              "attributes": {}
            },
            {
              "file": ".",
              "line": 6,
              "includedIn": [],
              "tagName": "mj-text",
              "attributes": {
                "attr": "val"
              },
              "content": "FTW"
            }
          ],
          "attributes": {}
        },
        {
          "file": ".",
          "line": 8,
          "includedIn": [],
          "tagName": "mj-text-test-wrapper",
          "children": [
            {
              "file": ".",
              "line": 9,
              "includedIn": [],
              "tagName": "mj-text",
              "attributes": {
                "attr": "val"
              },
              "content": "FTW"
            },
            {
              "file": ".",
              "line": 10,
              "includedIn": [],
              "tagName": "mj-text",
              "content": "MJML",
              "attributes": {}
            }
          ],
          "attributes": {}
        }
      ],
      "attributes": {}
    }
  ],
  "attributes": {}
}

const mjml3 = `
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-text color="blue" />
      <mj-text font-size="40px" />
    </mj-attributes>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          Hello !
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`

const validJson3 = {
  "file": ".",
  "line": 2,
  "includedIn": [],
  "tagName": "mjml",
  "children": [
    {
      "file": ".",
      "line": 3,
      "includedIn": [],
      "tagName": "mj-head",
      "children": [
        {
          "file": ".",
          "line": 4,
          "includedIn": [],
          "tagName": "mj-attributes",
          "children": [
            {
              "file": ".",
              "line": 5,
              "includedIn": [],
              "tagName": "mj-text",
              "attributes": {
                "color": "blue"
              }
            },
            {
              "file": ".",
              "line": 6,
              "includedIn": [],
              "tagName": "mj-text",
              "attributes": {
                "font-size": "40px"
              }
            }
          ],
          "attributes": {}
        }
      ],
      "attributes": {}
    },
    {
      "file": ".",
      "line": 9,
      "includedIn": [],
      "tagName": "mj-body",
      "children": [
        {
          "file": ".",
          "line": 10,
          "includedIn": [],
          "tagName": "mj-section",
          "children": [
            {
              "file": ".",
              "line": 11,
              "includedIn": [],
              "tagName": "mj-column",
              "children": [
                {
                  "file": ".",
                  "line": 12,
                  "includedIn": [],
                  "tagName": "mj-text",
                  "content": "Hello !",
                  "attributes": {}
                }
              ],
              "attributes": {}
            }
          ],
          "attributes": {}
        }
      ],
      "attributes": {}
    }
  ],
  "attributes": {}
}

const parse = mjml => MJMLParser(mjml, {
  keepComments: true,
  components,
  filePath: '.'
})

if (process.argv.indexOf('--debug') !== -1) {
  displayDiff(validJson1, omitDeepLodash(parse(mjml1), 'absoluteFilePath'))
  displayDiff(validJson2, omitDeepLodash(parse(mjml2), 'absoluteFilePath'))
  displayDiff(validJson3, omitDeepLodash(parse(mjml3), 'absoluteFilePath'))
}

chai.expect(validJson1, 'Special characters test failed')
    .to.deep.equal(omitDeepLodash(parse(mjml1), 'absoluteFilePath'))

chai.expect(validJson2, 'Similar tags test failed')
    .to.deep.equal(omitDeepLodash(parse(mjml2), 'absoluteFilePath'))

chai.expect(validJson3, 'Self closing tags test failed')
    .to.deep.equal(omitDeepLodash(parse(mjml3), 'absoluteFilePath'))
