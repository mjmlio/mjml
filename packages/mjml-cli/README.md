## mjml-cli

# Installation

We recommend installing and using MJML locally, in a project folder where you'll use MJML: 
```bash
$> npm install mjml
```
In the folder where you installed MJML you can now run:
```bash
$> ./node_modules/.bin/mjml input.mjml
```
To avoid typing `./node_modules/.bin/`, add it to your PATH:
```bash
$> export PATH="$PATH:./node_modules/.bin"
```
You can now run MJML directly, in that folder:
```bash
$> mjml input.mjml
```

MJML is written with [NodeJS](https://nodejs.org/en/)
You can download and install the MJML engine from [NPM](https://www.npmjs.com).

# Command Line Interface

In addition to the translation engine, which converts MJML to email HTML, we've bundled a Command Line Interface (CLI) helping you to achieve the basic features it offers and integrate it seamlessly in your development flow.

### Render MJML to HTML

```bash
$> mjml input.mjml
```

It will output a HTML file called `input.html`.

### Render and redirect the result to stdout

```bash
$> mjml -s input.mjml

# or

$> mjml --stdout input.mjml
```

### Render and minify the output HTML

```bash
$> mjml -m input.mjml

# or

$> mjml --min input.mjml
```

It will output a HTML file called `input.html`.

### Render and redirect the result to a file

```bash
$> mjml input.mjml -o my-email.html

# or

$> mjml input.mjml --output my-email.html
```

You can output the resulting email responsive HTML in a file. If the file does not exist, it will be created.

### Set the validation rule to `skip` so that the file is rendered without being validated.

```bash
$> mjml -l skip -r input.mjml
```

### Watch changes on a file

```bash
$> mjml -w input.mjml

# or

$> mjml --watch input.mjml
```

If you like live-coding, you might want to use the `-w` option that enables you to re-render your file every time you save it.
It can be time-saving when you can just split you screen and see the HTML output modified when you modify your MJML.

Of course, the `-w` option can be used with an `--output` option too.
