# MJML Browser

Browser build of MJML - convert MJML to responsive HTML in the browser.

## Build

```bash
yarn build
```

This creates `index.js` - a UMD bundle that can be used in any browser.

## Usage

### In Browser (UMD)

```html
<!doctype html>
<html>
  <body>
    <div id="output"></div>

    <script src="path/to/mjml-browser/index.js"></script>
    <script>
      const mjmlTemplate = `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>Hello World!</mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `

      // mjml returns a Promise
      mjml(mjmlTemplate).then((result) => {
        console.log(result.html)
        document.getElementById('output').innerHTML = result.html
      })
    </script>
  </body>
</html>
```

### With Module Bundler

```javascript
const mjml2html = require('mjml-browser')

// Returns a Promise
mjml2html(mjmlString, options).then((result) => {
  console.log(result.html)
})

// Or with async/await
const result = await mjml2html(mjmlString, options)
console.log(result.html)
```

## Unavailable Features

- `mj-include` tags are unavailable and will be ignored
- Features involving the `.mjmlconfig` file are unavailable (no custom components)
- HTML minification is disabled (htmlnano is stubbed out)
- File system operations are not available

## API

The function returns a Promise that resolves to an object with:

```javascript
{
  html: string,      // The generated HTML
  errors: array,     // Array of validation errors
  json: object       // MJML structure as JSON
}
```
