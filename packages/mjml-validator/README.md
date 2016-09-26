# mjml-validator

MJML provide a validation layer that help you building your email. It can detects if you misplaced or mispelled an element, same with attributes. It supports 3 level of validation :
- skip : your document is not validated at all
- soft (default) : your document is validated, but even if it has errors it will be rendered
- strict : your document is validated but if it has errors it will not render anything

## In cli

In `mjml` command line you can add a `-l` or `--level` with validation level you want. Ex: `mjml -l strict -r my_template.mjml`

## In Javascript

In Javascript you can provide the level through the `options` params on `MJMLRenderer`. Ex: `new MJMLRenderer(inputMJML, { level: strict })`

`strict` will raise an `MJMLValidationError` exception. This object has 2 methods:
- `getErrors` that returns you an array of object with `line`, `message` and `tagName` and a `formattedMessage`.
- `getMessages` that returns you an array of `formattedMessage`.

`soft` will not raise an exception, instead you can find errors inside the object returned by `render` methods : `errors`. It the same object returned by `getErrors` on strict mode
