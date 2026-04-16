## mjml-core

### Installation

```bash
npm install --save mjml-core
```

This is the core mjml library, composed by a set of functions for both parsing, and rendering mjml

### Usage

```javascript
import mjml2html from 'mjml'

async function example() {
  const result = await mjml2html(`code`)
  console.log(result)
}

example()
```
