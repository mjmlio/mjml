# Validating MJML

MJML provides a validation layer that helps you building your email. It can detect if you misplaced or mispelled a MJML component, or if you used any unauthorised attribute on a specific component. It supports 3 levels of validation:

* `skip`: your document is rendered without going through validation
* `soft`: your document is going through validation and is rendered, even if it has errors
* `strict`: your document is going through validation and is not rendered if it has any error

By default, the level is set to `soft`.

## In CLI

When using the `mjml` command line, you can add the option `-l` or `--level` with the validation level you want.

> Validates the file without rendering it

```bash
mjml --validate template.mjml
```

> Sets the validation level to `skip` (so that the file is not validated) and renders the file

```bash
mjml -l skip -r template.mjml
```

## In Javascript

In Javascript, you can provide the level through the `options` parameters on `MJMLRenderer`. Ex: `new MJMLRenderer(inputMJML, { level: strict })`

`strict` will raise a `MJMLValidationError` exception. This object has 2 methods:
* `getErrors` returns an array of objects with `line`, `message`, `tagName` as well as a `formattedMessage` which contains the `line`, `message` and `tagName` concatenated in a sentence.
* `getMessages` returns an array of `formattedMessage`.

When using `soft`, no exception will be raised. You can get the errors using the object returned by the `render` method `errors`. It is the same object returned by `getErrors` on strict mode.

### Use of .mjmlconfig file
If not exists, add a .mjmlconfig file at the root of your project (where you execute the mjml command).
Add the following key to the json:

```json
{
    ...
    "validators": [
        "validateTag",
        "validateAttribute",
        "validChildren",
        "./validators/ColumnCount.js",
    ]
}
```

`"validateTag"`, `"validateAttribute"` and `"validChildren"` are the default validation rules.
If you want to add custom rules, you can add the path to the file where the validtion function resides.
