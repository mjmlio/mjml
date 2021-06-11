## MJML Browser build

This package allows MJML to be used client-side.

### Usage

It can be used as the regular mjml package :  

```javascript
var mjml2html = require('mjml-browser')

var result = mjml2html(mjml, options)
```

### Unavailable features  

- `mj-include` tags are unavailable and will be ignored.
- features involving the `.mjmlconfig` file are unavailable, which means no custom components.
