<!--
Thanks for contributing to MJML!

Before opening this Pull Request:
- Read CONTRIBUTING.md. For non-trivial changes, open (or link) an issue
  first so we can agree on the approach.
- Keep the Pull Request focused: one logical change. Unrelated refactors or
  formatting go in a separate Pull Request.
-->

## Summary

<!--
What does this Pull Request change, and what problem does it solve?
Link any related issue(s) using "Fixes #123" when it resolves an issue or "Refs #123" when it is related.
-->

## How to validate the changes

<!--
Give the reviewer what they need to check the change in a couple of
minutes, without reading your code first:

1. The smallest MJML input that shows the problem or the new feature.
2. How you rendered it (CLI command, code snippet, options used).
3. The relevant HTML fragment BEFORE and AFTER this change, produced by
   running the built code, not written by hand.

:information_source: Docs, CI or tooling only? Delete the blocks below and describe any steps needed to verify the change.
-->

**MJML input**

```xml
<mjml>
  <mj-body>
    <!-- minimal example -->
  </mj-body>
</mjml>
```

**Example usage** (how to reproduce / test this change)

<!-- Replace with whatever you used: CLI, mjml2html, etc. The CLI is shown as an example -->

```bash
yarn build
node packages/mjml/bin/mjml input.mjml -s
```

**Output before**

```html

```

**Output after**

```html

```

**Email clients checked**

<!--
Required if rendered HTML changes. Which clients did you check, and how did you test them (e.g. Litmus, Mailgun Inspect, Testi, native devices)? Screenshots are welcome.
-->

## Type of change

- [ ] Bug fix (patch)
- [ ] New feature / attribute / option. Existing default behaviour remains unchanged (minor)
- [ ] Breaking change (changes to existing default behaviour, rendered HTML structure or class names, removed/renamed API, stricter validation...)
- [ ] Docs, tests, tooling or CI only

## Checklist

- [ ] I added or updated tests that cover this change (a bug-fix test fails without the fix).
- [ ] `yarn ci` passes locally.
- [ ] I updated all relevant documentation (`doc/`, package `README.md` attribute tables and defaults), or no docs change is needed.
- [ ] I considered the security implications of this change.
- [ ] Commits follow the [commit convention](https://github.com/mjmlio/mjml/blob/master/CONTRIBUTING.md#how-to-submit-a-good-pull-request) and intermediate commits are squashed.

## AI assistance

<!--
Using AI tools is fine. Telling us helps reviewers know where to look
closely. Pick one option and, if AI was used, explain what
it did (e.g. "AI wrote the first draft of the fix and the
tests; I checked the output in Outlook").
-->

- [ ] No AI tools were used for this Pull Request.
- [ ] AI tools were used (complete the checklist below):
  - [ ] I have read and understand every line of this diff, and I can explain it and how it fits MJML without the AI tool.
  - [ ] I ran the code and the tests myself; the output above is real, not generated.
  - [ ] I removed generated noise (unrelated changes, needless comments, etc.).

## Release notes (optional)

<!-- Describe the impact for users: new feature, behaviour change, breaking change, etc.
Leave empty if there's no user-facing impact. -->

## Notes for reviewers

<!--
Optional: open questions, trade-offs, things you deliberately left out
(possible follow-ups), areas where you want a closer look.
-->
