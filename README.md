<p>
  <a href="https://mjml.io" target="_blank">
    <img width="250" src="https://documentation.mjml.io/images/logo.svg" />
  </a>
</p>
<b>Developed by</b>
<p>
  <a href="https://mailjet.com" target="_blank">
    <img width="125" src="https://static.mailjet.com/mjml-website/github/sinch-mailjet-purple-on-white.png" style="vertical-align:middle"  />
  </a>
</p>

---

<p>
  <a href="https://github.com/mjmlio/mjml/actions">
    <img src="https://github.com/mjmlio/mjml/actions/workflows/mjml-workflow.yml/badge.svg" alt="github actions">
  </a>
</p>


<p>
  | <b><a href="#introduction">Introduction</a></b>
  | <b><a href="#installation">Installation</a></b>
  | <b><a href="#usage">Usage</a></b> |
</p>

---

# Introduction

**MJML** is a markup language created by [Mailjet](https://www.mailjet.com/) and designed to reduce the pain of coding a responsive email. Its semantic syntax makes the language easy and straightforward while its rich standard components library shortens your development time and lightens your email codebase. **MJML**’s open-source engine takes care of translating the **MJML** you wrote into responsive HTML.

<p>
  <a href="https://mjml.io" target="_blank">
    <img width="75%" src="https://cloud.githubusercontent.com/assets/6558790/12450760/ee034178-bf85-11e5-9dda-98d0c8f9f8d6.png">
  </a>
</p>


# Installation

You can install **MJML** with NPM to use it with NodeJS or the Command Line Interface. If you're not sure what those are, head over to <a href="#usage">Usage</a> for other ways to use **MJML**.

```bash
npm install mjml
```

# Development

To work on **MJML**, make changes and create pull requests, download and install [yarn](https://yarnpkg.com/lang/en/docs/install/) for easy development.

```bash
git clone https://github.com/mjmlio/mjml.git && cd mjml
yarn
yarn build
```

You can also run `yarn build:watch` to rebuild the package as you code.

# Usage

## Online

Don't want to install anything? Use the free online editor!

<p>
  <a href="https://mjml.io/try-it-live" target="_blank"><img src="https://cloud.githubusercontent.com/assets/6558790/12195421/58a40618-b5f7-11e5-9ed3-80463874ab14.png" alt="try it live" width="75%"></a>
</p>

## Applications and plugins

**MJML** comes with tools and plugins, check out:
- [Visual Studio Code plugin](https://github.com/mjmlio/vscode-mjml) (**MJML** is included). <br>Also available at [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mjmlio.vscode-mjml) and the [Open VSX Registry](https://open-vsx.org/extension/mjmlio/vscode-mjml) or in the extensions tab of the Visual Studio Code app.
- [Sublime Text plugin](https://packagecontrol.io/packages/MJML-syntax) (**MJML** needs to be installed separately)

For more tools, check the [Community](https://mjml.io/community) page.

## Command line interface

> Compiles the file and outputs the HTML generated in `output.html`

```bash
mjml input.mjml -o output.html
```

You can pass optional `arguments` to the CLI and combine them.

| argument                         | description                                            | default value |
| -------------------------------- | ------------------------------------------------------ | ------------- |
| `mjml [input] -o [output]`       | Writes the output to [output]                          |               |
| `mjml [input] -s`                | Writes the output to `stdout`                          |               |
| `mjml [input] -s --noStdoutFileComment` | Writes the output to `stdout` without file comment in the first line |               |
| `mjml -w [input]`                | Watches the changes made to `[input]` (file or folder) |               |
| `mjml [input] --config.allowIncludes` | Enables `mj-include` processing (`true` or `false`) | `false` |
| `mjml [input] --config.allowMixedSyntax` | Allows mixing block and CSS variable syntax when `sanitizeStyles` is enabled (`true` or `false`) | `false` |
| `mjml [input] --config.beautify` | Beautifies the output (`true` or `false`)              | `true`        |
| `mjml [input] --config.includePath` | Adds allowlisted include root(s), as a string path or JSON array of paths |               |
| `mjml [input] --config.minify`   | Minifies the output (`true` or `false`)                | `false`       |
| `mjml [input] --config.minifyOptions` | Options for HTML minifier, use `minifyCss` to control CSS minification | See [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) |
| `mjml [input] --config.juicePreserveTags` | Preserve some tags when inlining CSS | See [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) |
| `mjml [input] --config.mjmlConfigPath` | Path to `.mjmlconfig` file for custom components | current working directory |
| `mjml [input] --config.sanitizeStyles` | Sanitizes template variables inside CSS before minification (`true` or `false`) | `false` |
| `mjml [input] --config.useMjmlConfigOptions` | Allows to use the `options` attribute from `.mjmlconfig` file | `false` |
| `mjml [input] --config.templateSyntax` | Sets custom template delimiters as JSON array (`[{"prefix":"{{","suffix":"}}"}]`) | `[{"prefix":"{{","suffix":"}}"},{"prefix":"[[","suffix":"]]"}]` |

See [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) for more information about config options.

## Inside Node.js

```javascript
import mjml2html from 'mjml'

/*
  Compile an mjml string
*/
async function renderMjml() {
  const htmlOutput = await mjml2html(`
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>
              Hello World!
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `, options)

  /*
    Print the responsive HTML generated and MJML errors if any
  */
  console.log(htmlOutput)
}

renderMjml()
```

You can pass optional `options` as an object to the `mjml2html` function:

| option               | unit               | description                                                                                                                                              | default value                                                                                           |
| -------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| allowMixedSyntax     | boolean            | Allows mixed block/value/property template syntaxes during CSS sanitization                                                                               | `false`                                                                                                 |
| beautify             | boolean            | Option to beautify the HTML output                                                                                                                       | `false`                                                                                                 |
| filePath             | string             | Path of file, used for relative paths in `mj-include` instances                                                                                          | `.`                                                                                                     |
| fonts                | object             | Default fonts imported in the HTML rendered by MJML                                                                                                      | See in [index.js](https://github.com/mjmlio/mjml/blob/master/packages/mjml-core/src/index.js) |
| ignoreIncludes       | boolean            | Option to ignore `mj-include` instances                                                                                                                  | `true`                                                                                                  |
| includePath          | string or string[] | Additional allowlisted include root(s), used when `ignoreIncludes` is `false`                                                                            |                                                                                                         |
| juicePreserveTags    | object             | Preserve some tags when inlining CSS, see [documentation](https://documentation.mjml.io/#inside-node-js) for more info |                                                                                                         |
| keepComments         | boolean            | Option to keep comments in the HTML output                                                                                                               | `true`                                                                                                  |
| minify               | boolean            | Option to minify the HTML output                                                                                                                         | `false`                                                                                                 |
| minifyOptions        | object             | Options for htmlnano minification (including `minifyCss`), see [documentation](https://documentation.mjml.io/#inside-node-js) for more info |                                                                                                         |
| mjmlConfigPath       | string             | The path or directory of the `.mjmlconfig` file (for custom components use)                                                                              | `process.cwd()`                                                                                         |
| preprocessors        | array of functions | Preprocessors applied to the xml before parsing. Input must be xml, not json. Functions must be `(xml: string) => string`                                | `[]`                                                                                                    |
| sanitizeStyles       | boolean            | Sanitizes template variables in CSS before minification                                                                                                   | `false`                                                                                                 |
| templateSyntax       | array of objects   | Custom template delimiters used by sanitization (`[{ prefix, suffix }]`)                                                                                | `[{"prefix":"{{","suffix":"}}"},{"prefix":"[[","suffix":"]]"}]`                       |
| useMjmlConfigOptions | boolean            | Allows to use the `options` attribute from `.mjmlconfig` file                                                                                            | `false`                                                                                                 |
| validationLevel      | string             | Available values for the [validator](https://documentation.mjml.io/#validating-mjml): `strict`, `soft`, `skip`       | `soft`.                                                                                                 |

## Client-side (in browser)

```javascript
var mjml2html = require('mjml-browser')

/*
  Compile a mjml string
*/
mjml2html(`
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>
            Hello World!
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`, options).then(function (htmlOutput) {
  /*
    Print the responsive HTML generated and MJML errors if any
  */
  console.log(htmlOutput)
})
```

## API

A free-to-use **MJML** API is available to make it easy to integrate **MJML** in your application. Head over here to [learn more about the API](https://mjml.io/api).

# MJML Slack

**MJML** wouldn't be as cool without its amazing community. Head over the [Community Slack](https://join.slack.com/t/mjml/shared_invite/zt-gqmwfwmr-kPBnfuuB7wof5httaTcXxg) to meet fellow **MJML**'ers.
