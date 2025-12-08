### mjml-msobutton

A button that uses the [VML](https://docs.microsoft.com/en-us/windows/win32/vml/shape-element--vml) solution for radius, which is supported in Outlook desktop

It uses the same attributes as the standard `mj-button` but includes three additional ones:

| attribute  | accepts | description                    | default value |
| ---------- | ------- | ------------------------------ | ------------- |
| mso-proof  | boolean | Active the bulletproof mode    | `false`       |
| mso-width  | `px`    | The width of the VML solution  | `200px`       |
| mso-height | `px`    | The height of the VML solution | `40px`        |

These new attributes allow MJML to generate a “bulletproof button“ which incorporates radius, stroke and alignment, [using this method](https://buttons.cm/),

It's available on [Github](https://github.com/adrien-zinger/mjml-mso-button) and [NPM](https://www.npmjs.com/package/mjml-msobutton).

**Usage**

Use it like a standard `mj-button`:

```html
<mj-msobutton mso-proof="true">Click !</mj-msobutton>
```

**Problems that you should know**

1. This cannot be used with an image in background
2. It creates a duplication of code in the HTML
3. The width and the height cannot be used with the auto value.

> Sample project on github [here](https://github.com/adrien-zinger/mjml-msobutton-sample)
