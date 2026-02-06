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

| argument                                                | description                                                                                                                                                                                                                        | default value                                                                      |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `mjml -m [input]`                                       | Migrates a v3 MJML file to the v4 syntax                                                                                                                                                                                           |                                                                                    |
| `mjml [input] -o [output]`                              | Writes the output to [output]                                                                                                                                                                                                      |                                                                                    |
| `mjml [input] -s`                                       | Writes the output to `stdout`                                                                                                                                                                                                      |                                                                                    |
| `mjml [input] -s --noStdoutFileComment`                 | Writes the output to `stdout` without an comment containing the source file in the first line                                                                                                                                      | the outputs first line contains the file in the format `<!-- FILE: {filename} -->` |
| `mjml -w [input]`                                       | Watches the changes made to `[input]` (file or folder)                                                                                                                                                                             |                                                                                    |
| `mjml [input] --config.beautify`                        | Beautifies the output (`true` or `false`)                                                                                                                                                                                          | `true`                                                                             |
| `mjml [input] --config.minify`                          | Minifies the output (`true` or `false`)                                                                                                                                                                                            | `false`                                                                            |
| `mjml [input] --config.juicePreserveTags`               | Preserve some tags when inlining css, see [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) for more info                                                                           |                                                                                    |
| `mjml [input] --config.minifyOptions`                   | Options for HTML minifier. Use `minifyCss` to control CSS minification (legacy: `minifyCSS` is still accepted). See [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) for more info |                                                                                    |
| `mjml [input] --config.templateSyntax`                  | JSON array of `{ prefix, suffix }` objects to declare templating delimiters (used by sanitization and restore)                                                                                                                     |                                                                                    |
| `mjml [input] --config.allowMixedSyntax`                | Allow mixing block tokens (e.g. `{%...%}`) with CSS tokens (e.g. `color: {{...}}`) in the same document                                                                                                                            | `false`                                                                            |
| `mjml [input] --config.mjmlConfigPath [mjmlconfigPath]` | Uses the `.mjmlconfig` file in the specified path or directory to include custom components                                                                                                                                        | _The `.mjmlconfig` file in the current working directory, if any_                  |
| `mjml [input] --config.sanitizeStyles`                  | Optional setting when using templating syntax to sanitize the input to PostCSS preventing (`true` or `false`) errors                                                                                                               | `false`                                                                            |
| `mjml [input] --config.useMjmlConfigOptions`            | Allows to use the `options` attribute from `.mjmlconfig` file                                                                                                                                                                      | `false`                                                                            |
| `mjml [input] --config.validationLevel`                 | [Validation level](https://github.com/mjmlio/mjml/tree/master/packages/mjml-validator#validating-mjml): `strict`, `soft` or `skip`                                                                                                 | `soft`                                                                             |

#### Minify options compatibility

CSS minification is controlled via `minifyCss`. For backward compatibility, the legacy `minifyCSS` key is still accepted and mapped internally:

- Disable CSS minification:

```bash
mjml input.mjml -o output.html --config.minify true --config.minifyOptions '{"minifyCss": false}'
# legacy:
mjml input.mjml -o output.html --config.minify true --config.minifyOptions '{"minifyCSS": false}'
```

- Enable CSS minification with presets or options:

```bash
# lite preset
mjml input.mjml -o output.html --config.minify true --config.minifyOptions '{"minifyCss": "lite"}'
# legacy equivalent (maps to lite)
mjml input.mjml -o output.html --config.minify true --config.minifyOptions '{"minifyCSS": true}'
# default preset with single quotes for strings
mjml input.mjml -o output.html --config.minify true --config.minifyOptions '{"minifyCss": {"preset":["default", {"normalizeString":{"preferredQuote":"single"}}]}}'
```



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

| option               | accepts                    | description                                                                                                                                            | default value                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| allowMixedSyntax     | boolean                    | Allow mixing block tokens and CSS tokens within the same document when sanitizing/minifying CSS                                                        | `false`                                                                                                                                                                                                                                                                                                                                                                           |
| beautify             | boolean                    | Option to beautify the HTML output                                                                                                                     | `false`                                                                                                                                                                                                                                                                                                                                                                           |
| filePath             | string                     | Path of the input file or a base directory; determines the default include sandbox (includes are allowed only under this directory when enabled)       | '.'                                                                                                                                                                                                                                                                                                                                                                               |
| includePath          | string or array of strings | One or more explicit directories where includes are allowed, in addition to `filePath`. Paths outside these directories are denied.                    |                                                                                                                                                                                                                                                                                                                                                                                   |
| fonts                | object                     | Default fonts imported in the HTML rendered by MJML                                                                                                    | See in [index.js](https://github.com/mjmlio/mjml/blob/master/packages/mjml-core/src/index.js#L100-L108)                                                                                                                                                                                                                                                                           |
| juicePreserveTags    | boolean                    | Optional setting when inlining CSS, see [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) for more info |                                                                                                                                                                                                                                                                                                                                                                                   |
| keepComments         | boolean                    | Option to keep comments in the HTML output                                                                                                             | `true`                                                                                                                                                                                                                                                                                                                                                                            |
| minify               | boolean                    | Option to minify the HTML output                                                                                                                       | `false`                                                                                                                                                                                                                                                                                                                                                                           |
| minifyOptions        | object                     | Options for HTML minifier, see [mjml-cli documentation](https://github.com/mjmlio/mjml/blob/master/packages/mjml-cli/README.md) for more info          | `{"collapseWhitespace": true, "minifyCss": false, "removeEmptyAttributes": true}` <br><br> `minifyCss` can take a value of `false` or one of the two preset options `lite` or `default`. Within either preset, you can specify specific options from cssnano, for example `minifyCss: { options: { preset: [ 'default', { minifyFontValues: { removeQuotes: false }, }, ], }, },` |
| mjmlConfigPath       | string                     | The path or directory of the [`.mjmlconfig` file](#community-components)                                                                               | `process.cwd()`                                                                                                                                                                                                                                                                                                                                                                   |
| sanitizeStyles       | boolean                    | Optional setting when using templating syntax to sanitize the input to PostCSS preventing errors                                                       | `false`                                                                                                                                                                                                                                                                                                                                                                           |
| templateSyntax       | array of objects           | When `sanitizeStyles` is `true`, you can pass optional syntax e.g. `templateSyntax: [{prefix: '{{',suffix: '}}',},{prefix: '{=',suffix: '=}',},]`      | `{{}}`                                                                                                                                                                                                                                                                                                                                                                            |
| useMjmlConfigOptions | boolean                    | Allows to use the `options` attribute from `.mjmlconfig` file                                                                                          | `false`                                                                                                                                                                                                                                                                                                                                                                           |
| validationLevel      | string                     | Available values for the [validator](https://github.com/mjmlio/mjml/tree/master/packages/mjml-validator#validating-mjml): `strict` `soft` `skip`       | `soft`                                                                                                                                                                                                                                                                                                                                                                            |

#### Include path examples

Includes are ignored by default for security (`ignoreIncludes: true`). Enable them explicitly and scope allowed folders with `includePath`.

CLI example:

```bash
$> mjml template.mjml \
  --config.filePath /project/templates/newsletter \
  --config.allowIncludes true \
  --config.includePath '["../_common","../vendor"]'
```

- Single include directory

```js
import mjml2html from 'mjml'

const { html, errors } = mjml2html(source, {
  ignoreIncludes: false,
  filePath: '/project/templates/campaignA/email1.mjml',
  includePath: '/project/templates/_common',
})
```

- Multiple include directories

```js
const { html, errors } = mjml2html(source, {
  ignoreIncludes: false,
  filePath: '/project/templates/campaignA/email1.mjml',
  includePath: ['/project/templates/_common', '/project/templates/_footers'],
})
```

Security notes:

- Includes are ignored by default (`ignoreIncludes: true`). Enable explicitly and scope allowed folders with `includePath`.
- Paths are fully URL-decoded before validation (handles double/triple encoding like `%252F`).
- Early rejects: absolute paths, UNC-style paths (`//server/...` or `\\server\\...`), Windows drive letters (`C:\...`), and null bytes (`%00`).
- Canonical boundary checks: we resolve and follow symlinks with `realpath` and require the target to stay inside `filePath` or any `includePath` roots.
### Best practices for shared partials

- Project templates root: Set `filePath` to your templates root and write includes relative to that base (e.g., `./_common/header.mjml`). Simple setup; templates must use base-relative paths.
- Explicit allowlist: Keep template-relative paths (e.g., `../_common/header.mjml`) and declare `includePath` with sibling/shared folders. No template changes; supports multiple shared roots.
- Security: Only files under `filePath` and `includePath` are allowed. Absolute paths outside these roots and `..` escapes are denied.

### API

A free-to-use MJML API is available to make it easy to integrate MJML in your application. Head
over here to [learn more about the API](https://mjml.io/api).
