## Tooling

In order to provide you with the best and most efficient experience using MJML, we've developed some tools to integrate it seamlessly into your development workflow:

### Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com/) is a free code editor made by [Microsoft](https://www.microsoft.com/). We recommend this package as it is among the most feature-rich MJML plugins for code editors; with live previews, syntax highlighting and linting, as well as export features including HTML and screenshots.

It is available [on Github](https://github.com/mjmlio/vscode-mjml) and through the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mjmlio.vscode-mjml).

### Sublime Text

[Sublime Text](https://www.sublimetext.com/) is a powerful text editor. We’ve provided you with a package to color MJML tags.

It is available [on Github](https://github.com/mjmlio/mjml-syntax) and through the [Sublime Package Control](https://packagecontrol.io/packages/MJML-syntax).

### Gulp

[Gulp](https://gulpjs.com/) is a tool designed to help you automate and enhance your workflow. Our plugin enables you to plug the MJML translation engine into your workflow, helping you to streamline your development workflow.

It is available here on [Github](https://github.com/mjmlio/gulp-mjml).

## Template Tokens in CSS

MJML can safely minify and beautify HTML and CSS while preserving template tokens embedded in CSS. This is useful when your templating system (Liquid, Handlebars, etc.) injects dynamic values into style attributes or `<style>` blocks.

- **Supported contexts:** CSS value tokens (`color: {{primary}}`) and CSS property-name tokens (`{{prop}}: {{value}}`), as well as block tokens inside style contexts.
- **Enable sanitization:** pass `sanitizeStyles: true` when you also enable `minify: true` or `beautify: true`. Configure token wrappers with `templateSyntax` (array of `{ prefix, suffix }` pairs, defaults to `{{…}}` and `[[…]]`).
- **Mixed syntax:** by default MJML disallows mixing block tokens with CSS tokens in the same document. Opt-in via `allowMixedSyntax: true` if you need to mix.
- **Broken delimiters pre-check:** MJML fails fast when it detects unbalanced token delimiters inside CSS (e.g. more `{{` than `}}`). Fix your tokens or disable CSS minification.

### CLI examples

- Preserve CSS tokens while minifying:

```bash
mjml input.mjml -o out.html --config.sanitizeStyles true --config.minify true
```

- Allow mixed syntax:

```bash
mjml input.mjml -o out.html --config.sanitizeStyles true --config.minify true --config.allowMixedSyntax true
```

- Disable CSS minification (to bypass token pre-check/minifier):

```bash
mjml input.mjml -o out.html --config.minify true --config.minifyOptions '{"minifyCss": false}'
```

### Programmatic usage

```js
async function example() {
	const { html } = await mjml(input, {
		minify: true,
		sanitizeStyles: true,
		templateS­yntax: [
			{ prefix: '{{', suffix: '}}' },
			{ prefix: '[[', suffix: ']]' },
		],
		allowMixedSyntax: false, // set true to allow block + CSS tokens together
		// Disable CSS minify if your tokens are broken or your minifier cannot parse them:
		minifyOptions: { minifyCss: false },
	})
	// use html variable
}

example()
```

For the canonical list of CLI flags and Node.js options, see [Usage](https://documentation.mjml.io/#usage)
