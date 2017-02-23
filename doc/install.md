
# Installation

``` bash
# Install with npm
npm i mjml

# In the folder where you installed MJML you can now run:
$> ./node_modules/.bin/mjml -V

# To avoid typing ./node_modules/.bin/, add it to your PATH (add it to .bashrc or .zshrc so you don't have to export it anymore):
$> export PATH="$PATH:./node_modules/.bin"

# You can now run MJML directly, in that folder:
$> mjml -V
```

MJML engine is written in [NodeJS](https://nodejs.org/en/), leveraging [ReactJS](https://facebook.github.io/react/). We recommend installing and using MJML locally from [NPM](https://www.npmjs.com/package/mjml).

# Command Line Interface

In addition to the translation engine, which converts MJML to email HTML, we've bundled a Command Line Interface (CLI) helping you to achieve the basic features it offers and integrate it seamlessly in your development flow.

### Render a single file

```

$> mjml input.mjml

```

It will output an HTML file called `a.html`.

### Render and redirect the result to a file

```

$> mjml input.mjml -o my-email.html

# or

$> mjml input.mjml --output my-email.html
```

You can output the resulting email responsive HTML in a file. If the file does not exist, it will be created.

### Watch changes on a file

```

$> mjml -w input.mjml

# or

$> mjml --watch input.mjml

```

If you like live-coding, you might want to use the `-w` option that enables you to re-render your file every time you save it.
It can be time-saving when you can just split you screen and see the HTML output modified when you modify your MJML.

Of course, the `-w` option can be used with an `--output` option too.
