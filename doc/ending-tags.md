### Ending tags

Some MJML components are "ending tags". These are mostly the components that will contain text content, like `mj-text` or `mj-button`.

These components can contain both text and HTML content, which will remain unprocessed by the MJML engine. You cannot use other MJML components.

Since the content is not processed, this means that any text won't be escaped, so if you use characters that are used to define html tags in your text, like `<` or `>`, you should use the encoded characters `&lt;` and `&lt;`.

There can also be issues if you use the `minify` option, `mj-html-attributes` or an inline `mj-style`, because these require the HTML to be re-parsed internally.

If you're just using the `minify` option, and need to use the `< >` characters, e.g for a templating language, you can also avoid this problem by wrapping the troublesome content between two `<!-- htmlmin:ignore -->` tags.

Here is the list of all ending tags :

- `mj-accordion-text`
- `mj-accordion-title`
- `mj-button`
- `mj-navbar-link`
- `mj-raw`
- `mj-social-element`
- `mj-text`
- `mj-table`
