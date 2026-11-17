---
name: Bug report
about: Create a report to help us improve
---

- [ ] I searched the [existing issues](https://github.com/mjmlio/mjml/issues?q=is%3Aissue) and checked the [FAQ](https://mjml.io/faq) and the [documentation](https://documentation.mjml.io/).

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**

<!--
The smallest MJML that reproduces the bug: remove everything that is not
needed to trigger it.
-->

MJML input:

```xml
<mjml>
  <mj-body>
    <!-- minimal example -->
  </mj-body>
</mjml>
```

How you rendered it (command or code, and the options used, e.g. `validationLevel`, `minify`, `beautify`, a `.mjmlconfig` file):

```bash
mjml input.mjml -s
```

Output: the relevant HTML fragment, and any errors or warnings:

```html

```

**Expected behavior**
A clear and concise description of what you expected to happen.

**MJML environment (please complete the following information):**

- OS: [e.g. macOS]
- MJML version: [e.g. 5.4.1]
- Node.js version: [e.g. 22.x]
- How MJML is run: [e.g. CLI, mjml2html, `mjml-browser`, try it live, other tool]

**Email sending environment (for rendering issues):**

- Platform used to send the email: [e.g. your email service provider, Testi@, Litmus, Mailgun Inspect]

**Affected email clients (for rendering issues):**

- Email client: [e.g. Gmail]
- OS: [e.g. Windows]
- Browser: [e.g. Google Chrome]

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Additional context**
Add any other context about the problem here.
