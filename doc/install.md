## Installation

You can [install MJML](https://www.npmjs.com/package/mjml) with NPM to use it with NodeJS or the Command Line Interface. If you're not sure what those are,
[head over to Usage](#usage) for other ways to use MJML.

```bash
npm install mjml
```

## Development

To work on MJML, make changes and create merge requests, [download and
install yarn](https://yarnpkg.com/lang/en/docs/install/) for easy development.

```bash
git clone https://github.com/mjmlio/mjml.git && cd mjml
yarn
yarn build
```

You can also run `yarn build:watch` to rebuild the package as you code.

## Usage

### Online

Don't want to install anything? [Use the free online editor](https://mjml.io/try-it-live)!

<figure>
  <img src="https://static.mailjet.com/mjml-website/documentation/usage-online.png" alt="try it live" width="75%">
</figure>

<p class="cta-container"><a class="cta" href="https://mjml.io/try-it-live">Try it live</a></p>

### Applications and plugins

MJML comes with an ecosystem of tools and plugins, check out:

- The [MJML App](https://mjmlio.github.io/mjml-app/) (MJML is included)
- [Visual Studio Code plugin](https://github.com/mjmlio/vscode-mjml) (MJML is included)
- [Sublime Text plugin](https://packagecontrol.io/packages/MJML-syntax) (MJML needs to be installed separately)

For more information, [check the Tooling section](#tooling).  
For more tools, [check the Community page](https://mjml.io/community).

### Command line interface

> Compiles the file and outputs the HTML generated in `output.html`

```bash
mjml input.mjml -o output.html
```

You can pass optional `arguments` to the CLI and combine them.

| argument                                                | description                                                                                                                                              | default value                                                                      |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `mjml -m [input]`                                       | Migrates a v3 MJML file to the v4 syntax                                                                                                                 |                                                                                    |
| `mjml [input] -o [output]`                              | Writes the output to [output]                                                                                                                            |                                                                                    |
| `mjml [input] -s`                                       | Writes the output to `stdout`                                                                                                                            |                                                                                    |
| `mjml [input] -s --noStdoutFileComment`                 | Writes the output to `stdout` without an comment containing the source file in the first line                                                            | the outputs first line contains the file in the format `<!-- FILE: {filename} -->` |
| `mjml -w [input]`                                       | Watches the changes made to `[input]` (file or folder)                                                                                                   |                                                                                    |
| `mjml [input] --config.beautify`                        | Beautifies the output (`true` or `false`)                                                                                                                | `true`                                                                             |
| `mjml [input] --config.minify`                          | Minifies the output (`true` or `false`)                                                                                                                  | `false`                                                                            |
| `mjml [input] --config.juicePreserveTags`               | Preserve some tags when inlining css, see [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) for more info |                                                                                    |
| `mjml [input] --config.minifyOptions`                   | Options for html minifier, see [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) for more info            |                                                                                    |
| `mjml [input] --config.mjmlConfigPath [mjmlconfigPath]` | Uses the `.mjmlconfig` file in the specified path or directory to include custom components                                                              | _The `.mjmlconfig` file in the current working directory, if any_                  |
| `mjml [input] --config.useMjmlConfigOptions`            | Allows to use the `options` attribute from `.mjmlconfig` file                                                                                            | `false`                                                                            |
| `mjml [input] --config.validationLevel`                 | [Validation level](https://github.com/mjmlio/mjml/tree/master/packages/mjml-validator#validating-mjml): `strict`, `soft` or `skip`                       | `soft`                                                                             |

### Inside Node.js

```javascript
import mjml2html from 'mjml'

/*
  Compile an mjml string
*/
const htmlOutput = mjml2html(
  `
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
`,
  options,
)

/*
  Print the responsive HTML generated and MJML errors if any
*/
console.log(htmlOutput)
```

You can pass optional `options` as an object to the `mjml2html` function:

| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fonts                | object  | Default fonts imported in the HTML rendered by MJML                                                                                                    | See in [index.js](https://github.com/mjmlio/mjml/blob/master/packages/mjml-core/src/index.js#L100-L108)                                                                                                                                                                                                                                                                           |
| keepComments         | boolean | Option to keep comments in the HTML output                                                                                                             | `true`                                                                                                                                                                                                                                                                                                                                                                            |
| beautify             | boolean | Option to beautify the HTML output                                                                                                                     | `false`                                                                                                                                                                                                                                                                                                                                                                           |
| minify               | boolean | Option to minify the HTML output                                                                                                                       | `false`                                                                                                                                                                                                                                                                                                                                                                           |
| validationLevel      | string  | Available values for the [validator](https://github.com/mjmlio/mjml/tree/master/packages/mjml-validator#validating-mjml): `strict` `soft` `skip`       | `soft`                                                                                                                                                                                                                                                                                                                                                                            |
| filePath             | string  | Full path of the specified file to use when resolving paths from [`mj-include` components](#mj-include)                                                | `.`                                                                                                                                                                                                                                                                                                                                                                               |
| mjmlConfigPath       | string  | The path or directory of the [`.mjmlconfig` file](#community-components)                                                                               | `process.cwd()`                                                                                                                                                                                                                                                                                                                                                                   |
| useMjmlConfigOptions | boolean | Allows to use the `options` attribute from `.mjmlconfig` file                                                                                          | `false`                                                                                                                                                                                                                                                                                                                                                                           |
| minifyOptions        | object  | Options for HTML minifier, see [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) for more info          | `{"collapseWhitespace": true, "minifyCss": false, "removeEmptyAttributes": true}` <br><br> `minifyCss` can take a value of `false` or one of the two preset options `lite` or `default`. Within either preset, you can specify specific options from cssnano, for example `minifyCss: { options: { preset: [ 'default', { minifyFontValues: { removeQuotes: false }, }, ], }, },` |
| juicePreserveTags    | boolean | Optional setting when inlining CSS, see [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) for more info |                                                                                                                                                                                                                                                                                                                                                                                   |

### API

A free-to-use MJML API is available to make it easy to integrate MJML in your application. Head
over here to [learn more about the API](https://mjml.io/api).
