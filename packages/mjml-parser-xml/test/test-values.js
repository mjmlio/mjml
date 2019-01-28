/* eslint-disable comma-dangle */
module.exports = [
  {
    test: 'Special characters',
    mjml: `
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
    `,
    validJson: {
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
  },
  {
    test: 'Similar tags',
    mjml: `
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
    `,
    validJson: {
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
  },
  {
    test: 'Self closing tags',
    mjml: `
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
    `,
    validJson: {
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
  },
  // Input that matches most of the CDATAs regex but not all, potentially resulting in regex timeout
  {
    test: 'Regex timeout',
    mjml: `
<mj-section>
  <mj-text font-family="Arial" />
  <mj-column background-color="#ffffff" css-class="column1"></mj-column>
</mj-section>
    `,
    validJson: {
      "file": ".",
      "line": 2,
      "includedIn": [],
      "tagName": "mj-section",
      "children": [
        {
          "file": ".",
          "line": 3,
          "includedIn": [],
          "tagName": "mj-text",
          "attributes": {
            "font-family": "Arial"
          }
        },
        {
          "file": ".",
          "line": 4,
          "includedIn": [],
          "tagName": "mj-column",
          "attributes": {
            "background-color": "#ffffff",
            "css-class": "column1"
          }
        }
      ],
      "attributes": {}
    }
  },
  {
    test: 'Multiline attributes',
    mjml: `
<mj-text
    padding-left="16px"

    padding-right="16px">
    <a href="https://www.test.com" style="color: #60788c">View blog ]]post</a>
</mj-text>
    `,
    validJson: {
      "file": ".",
      "line": 2,
      "includedIn": [],
      "tagName": "mj-text",
      "attributes": {
        "padding-left": "16px",
        "padding-right": "16px"
      },
      "content": "<a href=\"https://www.test.com\" style=\"color: #60788c\">View blog ]]post</a>"
    }
  },
  {
    test: 'Self closing Ending Tags',
    mjml: `
      <mjml>
        <mj-head>
          <mj-title></mj-title>
          <mj-attributes>
            <mj-text font-size="27px" />
          </mj-attributes>
        </mj-head>
        <mj-body>
          <mj-section>
            <mj-column width="65%">
              <mj-text mj-class="small" align="left" font-family="Helvetica" color="#000000" padding-top="20px">
                coin
                <a href="https://test" style="text-decoration:underline;color:#336666;font-weight:bold" class="mobile-small-letters">Majors and Minors</a>
                bla
                <a href="https://test" style="text-decoration:underline;color:#336666;font-weight:bold" class="mobile-small-letters">Majors and Minors</a>
                <mj-raw>
                  coin
                </mj-raw>
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `,
    validJson: {
      file: '.',
      line: 2,
      includedIn: [],
      tagName: 'mjml',
      children:
       [ { file: '.',
           line: 3,
           includedIn: [],
           tagName: 'mj-head',
           children:
            [ { file: '.',
                line: 4,
                includedIn: [],
                tagName: 'mj-title',
                attributes: {} },
              { file: '.',
                line: 5,
                includedIn: [],
                tagName: 'mj-attributes',
                children:
                 [ { file: '.',
                     line: 6,
                     includedIn: [],
                     tagName: 'mj-text',
                     attributes: { 'font-size': '27px' } } ],
                attributes: {} } ],
           attributes: {} },
         { file: '.',
           line: 9,
           includedIn: [],
           tagName: 'mj-body',
           children:
            [ { file: '.',
                line: 10,
                includedIn: [],
                tagName: 'mj-section',
                children:
                 [ { file: '.',
                     line: 11,
                     includedIn: [],
                     tagName: 'mj-column',
                     attributes: { width: '65%' },
                     children:
                      [ { file: '.',
                          line: 12,
                          includedIn: [],
                          tagName: 'mj-text',
                          attributes:
                           { 'mj-class': 'small',
                             align: 'left',
                             'font-family': 'Helvetica',
                             color: '#000000',
                             'padding-top': '20px' },
                          content: 'coin\n                <a href="https://test" style="text-decoration:underline;color:#336666;font-weight:bold" class="mobile-small-letters">Majors and Minors</a>\n                bla\n                <a href="https://test" style="text-decoration:underline;color:#336666;font-weight:bold" class="mobile-small-letters">Majors and Minors</a>\n                <mj-raw>\n                  coin\n                </mj-raw>' } ] } ],
                attributes: {} } ],
           attributes: {} } ],
      attributes: {}
    }
  },
  {
    test: 'Include',
    mjml: `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-include path="./test/incl.mjml" />
          </mj-section>
        </mj-body>
      </mjml>
    `,
    validJson: {
      file: '.',
      line: 2,
      includedIn: [],
      tagName: 'mjml',
      children:
       [ { file: '.',
           line: 3,
           includedIn: [],
           tagName: 'mj-body',
           children:
            [ { file: '.',
                line: 4,
                includedIn: [],
                tagName: 'mj-section',
                children:
                 [ { file: '.',
                     line: 1,
                     includedIn:
                      [ { file: '.',
                          line: 5 } ],
                     tagName: 'mj-column',
                     children:
                      [ { file: '.',
                          line: 2,
                          includedIn:
                           [ { file: '.',
                               line: 5 } ],
                          tagName: 'mj-text',
                          attributes: { 'font-size': '22px' },
                          content: 'COIN\n    <a src="test">aze</a>' },
                        { file: '.',
                          line: 6,
                          includedIn:
                           [ { file: '.',
                               line: 5 } ],
                          tagName: 'mj-text',
                          attributes: { 'font-size': '22px' },
                          content: 'COIN2\n    <a src="test">aze2</a>' } ],
                     attributes: {} } ],
                attributes: {} } ],
           attributes: {} } ],
      attributes: {}
    }
  },
  {
    test: 'Single opening tag in endingTag, single and multi-line',
    mjml: `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-raw test="test"><?php endif ?></mj-raw>
              <mj-raw>
                <?php endif ?>
              </mj-raw>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `,
    validJson: { line: 2,
      includedIn: [],
      tagName: 'mjml',
      children:
       [ { line: 3,
           includedIn: [],
           tagName: 'mj-body',
           children:
            [ { line: 4,
                includedIn: [],
                tagName: 'mj-section',
                children:
                 [ { line: 5,
                     includedIn: [],
                     tagName: 'mj-column',
                     children:
                      [ { line: 6,
                          includedIn: [],
                          tagName: 'mj-raw',
                          attributes: { test: 'test' },
                          content: '<?php endif ?>' },
                        { line: 7,
                          includedIn: [],
                          tagName: 'mj-raw',
                          content: '<?php endif ?>',
                          attributes: {} } ],
                     attributes: {} } ],
                attributes: {} } ],
           attributes: {} } ],
      attributes: {} }
  }
]
/* eslint-enable comma-dangle */
