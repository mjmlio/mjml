## mjml-preset-core

### Installation

```bash
npm install --save mjml-preset-core
```

This is the set of mjml components bundled together for simple setup.

### Usage

```javascript
import mjml2html from 'mjml-core'
import presetCore from 'mjml-preset-core'

async function example() {
  const result = await mjml2html(`code`, { presets: [presetCore] })
  console.log(result)
}

example()
```
