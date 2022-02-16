## mjml-msobutton

Button that also use the [VML](https://docs.microsoft.com/en-us/windows/win32/vml/shape-element--vml) solution for radius.

This component can be usefull if you want to try an outlook proof adventure.
The msobutton has exactly the same behaviours of the classic button but add three more attributes.

attribute                   | unit        | description                                      | default value
----------------------------|-------------|--------------------------------------------------|---------------------
mso-proof                   | boolean     | Active the bulletproof mode                      | false
mso-width                   | px          | The width of the VML solution                    | 200px
mso-height                  | px          | The height of the VML solution                   | 40px

More important, these 3 new attributes allow mjml to generate a bulletproof button with radius and stroke with the same method that you can see [here](https://buttons.cm/), including the alignment.

It's available on [Github](https://github.com/adrien-zinger/mjml-mso-button) and [NPM](https://www.npmjs.com/package/mjml-msobutton).

**Usage**

Use it like an mj-button:
```html
<mj-msobutton mso-proof="true">Click !</mj-msobutton>
```

**Problems that you should know**

This outlook solution isn't really bulletproof.
1. This cannot be used with an image in background
2. It creates a duplication of code in the HTML
3. The width and the height cannot be used with the *auto* value

> Sample project on github [here](https://github.com/adrien-zinger/mjml-msobutton-sample)
