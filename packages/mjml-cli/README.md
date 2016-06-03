## mjml-cli

# Installation

```bash
# with npm
npm i -g mjml
```

MJML is written with [NodeJS](https://nodejs.org/en/)
You can download and install the MJML engine from [NPM](https://www.npmjs.com).

# Command Line Interface

In addition to the translation engine, which converts MJML to email HTML, we've bundled a Command Line Interface (CLI) helping you to achieve the basic features it offers and integrate it seamlessly in your development flow.

### Rendering

```bash
$> mjml input.mjml
```

It will output an HTML file called `input.html`.

### Render and redirect the result to a file

```bash
$> mjml input.mjml -o my-email.html

# or

$> mjml input.mjml --output my-email.html
```

You can output the resulting email responsive HTML in a file. If the file does not exist, it will be created.

### Watch changes on a file

```bash
$> mjml -w input.mjml

# or

$> mjml --watch input.mjml
```

If you like live-coding, you might want to use the `-w` option that enables you to re-render your file every time you save it.
It can be time-saving when you can just split you screen and see the HTML output modified when you modify your MJML.

Of course, the `-w` option can be used with an `--output` option too.
