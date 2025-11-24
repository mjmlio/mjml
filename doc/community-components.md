## Community components

In addition to the standard components available in MJML, our awesome community is contributing by creating their own components.

To use a community component, proceed as follows:

- Install MJML locally with `npm install mjml` in a folder
- Install the community component with `npm install {component-name}` in the same folder
- Create a `.mjmlconfig` file in the same folder with this code:

```json
{
  "packages": ["component-name/path-to-js-file"]
}
```

You can now use the component in an MJML file, for example `index.mjml`, and run MJML locally in your terminal. Ensure that you’re in the folder where you installed MJML and the community component, e.g.: `./node_modules/.bin/mjml index.mjml`.
