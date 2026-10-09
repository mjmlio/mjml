# MJML 6.0.0-alpha.1 - Upgrade guide


## Highlights

- Refreshed the underlying HTML to modernise where possible and reduce code bloat
- Added support for:
  - Dark mode via specific `--dark` modifier attributes
  - Responsive layout changes via specific `--responsive` modifier attributes
  - Accessibility ARIA attributes
- Upgraded Node versions and relevant dependencies


## **⚠️** Breaking changes

- Node.js 22 or later is required
- Updated all default `font-size` to `16px` and `line-height` to `150%` (and auto added `mso-line-height` of `120%`)
- Removed `Helvetica` and `Arial` as fallback fonts
- Removed all `<tbody>` tags
- Changed default `<p>` `margin`in CSS  from `13px` to `1em`


---


## HTML


### Overview

We took a comprehensive look at the HTML tha was being compiled and reduced as much as possible to make savings. Benchmark testing cam in at about a 10-15% reduction in the components and templates we tested. Full details: [https://github.com/mjmlio/mjml/pull/3059](https://github.com/mjmlio/mjml/pull/3059)


### What Changed (specific hightlights)

- Added `support-outlook-classic` option to `mjml` tag to remove support for Outlook classic (removes ghost tables and other Outlook specific code. Set to `true` by default.
- Added option to `mj-preview` to add blank space after preview text using the attributes:
  - `fill-space` (default: `0`)
  - `fill-space-unit` (default: `&#847;`).
- Updated skeleton:
  - changed default `margin` from `13px` to `1em` **[⚠️BREAKING CHANGE]**
- From all `<table>`s:
  - removed all `<tbody>` tags **[⚠️BREAKING CHANGE]**
- From font-family declarations
  - removed `Helvetica` and `Arial` as fallbacks **[⚠️BREAKING CHANGE - as fonts will change to system default sans-serif font]**
- For body tag
  - added `xml:lang=“”` (populated from `globalData` language, declared on `mjml` tag)
- **mj-button**
  - set `display` to `block` and removed `mso-padding-alt` declaration to solve issue where the full button is not clickable when the `width` is set
    - added `multiline` option to allow users to negate issues with the above in Outlook classic when button text wraps
    - added function to remove 1px padding to compensate for the added border
  - removed default `cursor: auto` set on `<td>` and `margin: 0` set on `<a>`
- **mj-carousel**
  - removed `[owa]` class as no longer used
- **mj-carousel-image**
  - now respects `target` attribute
- **mj-divider**
  - now uses either `table` or `p` (based on `support-outlook-classic`) and only outputs one
- **mj-hero**
  - fixed issue where left padding disappeared in Outlook when background-url (VML) added
- **mj-navbar**
  - hamburger now takes set `font-family` / `font-size` / `line-height` when declaring in `mj-attributes` > `mj-all`. Previously it was using its own
  - removed hamburger CSS when hamburger is not set
- **mj-section**
  - changed `text-align` option to `column-align` as it was poorly named. Aliased the deprecated option for backwards compatibility
  - fixed issue where left padding disappeared in Outlook when background-url (VML) added
- **mj-social**
  - updated sharer URLs


---


## Dark mode


### Overview

Overhauls MJML dark-mode support across body components giving the user the option to support and attribute tools to make simple changes to colours and images in clients that support it. 

**Full details:** [https://github.com/mjmlio/mjml/pull/3068](https://github.com/mjmlio/mjml/pull/3068)


### What Changed

- Added option to support dark-mode via `<mjml support-dark-mode="true">` which adds both `<meta>` tags and CSS. Full details:
- Implemented/extended dark attributes using `--dark` attributes for the following:
  - **mj-accordion**:
    - `border-color--dark`
    - `container-background-color--dark`
    - `icon-wrapped-url--dark`
    - `icon-unwrapped-url--dark`
  - **mj-accordion-element**:
    - `background-color--dark`
    - `border-color--dark`
    - `icon-wrapped-url--dark`
    - `icon-unwrapped-url--dark`
  - **mj-accordion-title**:
    - `background-color--dark`
    - `color--dark`
  - **mj-accordion-text**:
    - `background-color--dark`
    - `color--dark`
  - **mj-body**
    - `background-color--dark`
  - **mj-button**:
    - `background-color--dark`
    - `border-color--dark`
    - `border-bottom-color--dark`
    - `border-left-color--dark`
    - `border-right-color--dark`
    - `border-top-color--dark`
    - `color--dark`
    - `container-background-color--dark`
  - **mj-carousel**:
    - `container-background-color--dark`
    - `left-icon--dark`
    - `right-icon--dark`
    - `support-dark-mode-image="outlook"`
    - `tb-border-color--dark`
    - `tb-hover-border-color--dark`
    - `tb-selected-border-color--dark`
  - **mj-carousel-image**:
    - `src--dark`
    - `support-dark-mode-image="outlook"`
    - `tb-border-color--dark`
    - `thumbnails-src--dark`
  - **mj-column**:
    - `background-color--dark`
    - `border-color--dark`
    - `border-bottom-color--dark`
    - `border-left-color--dark`
    - `border-right-color--dark`
    - `border-top-color--dark`
    - `inner-background-color--dark`
    - `inner-border-color--dark`
    - `inner-border-bottom-color--dark`
    - `inner-left-bottom-color--dark`
    - `inner-right-bottom-color--dark`
    - `inner-top-bottom-color--dark`
  - **mj-divider**
    - `border-color--dark`
    - `container-background-color--dark`
  - **mj-group**:
    - `background-color--dark`
  - **mj-hero**:
    - `background-color--dark`
    - `background-url--dark`
    - `inner-background-color--dark`
  - **mj-image**:
    - `border-color--dark`
    - `border-bottom-color--dark`
    - `border-left-color--dark`
    - `border-right-color--dark`
    - `border-top-color--dark`
    - `container-background-color--dark`
    - `src--dark`
    - `support-dark-mode-image="outlook"`
  - **mj-navbar**:
    - `container-background-color--dark`
    - `ico-color--dark`
  - **mj-navbar-link**:
    - `color--dark`
  - **mj-section**:
    - `background-color--dark`
    - `background-url--dark`
    - `border-color--dark`
    - `border-bottom-color--dark`
    - `border-left-color--dark`
    - `border-right-color--dark`
    - `border-top-color--dark`
  - **mj-social**:
    - `color--dark`
    - `container-background-color--dark`
  - **mj-social-element**:
    - `background-color--dark`
    - `color--dark`
    - `src--dark`
    - `support-dark-mode-image="outlook"`
  - **mj-spacer**:
    - `container-background-color--dark`
  - **mj-table**:
    - `border-color--dark`
    - `color--dark`
    - `container-background-color--dark`
  - **mj-text**:
    - `color--dark`
    - `container-background-color--dark`
  - **mj-wrapper**:
    - `background-color--dark`
    - `background-url--dark`
    - `border-color--dark`
    - `border-bottom-color--dark`
    - `border-left-color--dark`
    - `border-right-color--dark`
    - `border-top-color--dark`
- Added validator rule that warns when dark-mode attributes are used without root `support-dark-mode="true"`.

**Note:** Additional `support-dark-mode-image="outlook"`for images is supported in various (not all) Outlook clients


---


## Responsive


### Overview

Overhauls MJML responsive-mode support across body components giving the user the option to support and attribute tools to make simple changes to desktop vs mobile display in clients that support it. 

**Full details:** [https://github.com/mjmlio/mjml/pull/3117](https://github.com/mjmlio/mjml/pull/3117)


### What Changed

- Implemented/extended responsive attributes using `--responsive` attributes for the following:
  - **mj-accordion**:
    - `icon-height--responsive`
    - `icon-width--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
  - **mj-accordion-element**:
    - `icon-height--responsive`
    - `icon-width--responsive`
  - **mj-accordion-title**:
    - `font-size--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
  - **mj-accordion-text**:
    - `font-size--responsive`
    - `line-height--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
  - **mj-button**:
    - `align--responsive`
    - `font-size--responsive`
    - `height--responsive`
    - `inner-padding--responsive`
    - `line-height--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
    - `width--responsive`
  - **mj-carousel**:
    - `align--responsive`
    - `icon-width--responsive``
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
    - `tb-width--responsive`
  - **mj-column**:
    - `direction--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
    - `width--responsive`
  - **mj-divider**
    - `align--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
    - `width--responsive`
  - **mj-group**:
    - `direction--responsive`
    - `width--responsive`
  - **mj-hero**:
    - `background-height--responsive`
    - `background-position--responsive`
    - `background-width--responsive`
    - `height--responsive`
    - `inner-padding--responsive`
    - `inner-padding-bottom--responsive`
    - `inner-padding-left--responsive`
    - `inner-padding-right--responsive`
    - `inner-padding-top--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
  - **mj-image**:
    - `align--responsive`
    - `font-size--responsive`
    - `height--responsive`
    - `max-height--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
    - `width--responsive`
  - **mj-navbar**:
    - `align--responsive`
    - `layout--responsive` [Options `stack` - stacks links below the breakpoint]
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
  - **mj-navbar-link**:
    - `font-size--responsive`
    - `line-height--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
  - **mj-section**:
    - `background-postion--responsive`
    - `background-postion-x--responsive`
    - `background-postion-y--responsive`
    - `background-repeat--responsive`
    - `background-size--responsive`
    - `column-align--responsive` [replaces `text-align` which is mapped in the background]
    - `gutter--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
  - **mj-social**:
    - `align--responsive`
    - `font-size--responsive`
    - `gutter--responsive`
    - `icon-height--responsive`
    - `icon-padding--responsive`
    - `icon-size--responsive`
    - `layout--responsive` [Options `stack` - stacks links below the breakpoint in horizontal mode]
    - `line-height--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
    - `text-spacing--responsive`
  - **mj-social-element**:
    - `align--responsive`
    - `font-size--responsive`
    - `icon-height--responsive`
    - `icon-padding--responsive`
    - `icon-size--responsive`
    - `line-height--responsive`
  - **mj-spacer**:
    - `height--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
    - `text-spacing--responsive`
  - **mj-table**:
    - `align--responsive`
    - `font-size--responsive`
    - `line-height--responsive`
    - `layout--responsive` [Options `stack` - stacks table rows in a 'card' format (Apple only) or `stack` - adds horizontal scroll in most mobile clients]
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
    - `width--responsive`
  - **mj-text**:
    - `align--responsive`
    - `font-size--responsive`
    - `height--responsive`
    - `line-height--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`
    - `width--responsive`
  - **mj-wrapper**:
    - `background-postion--responsive`
    - `background-postion-x--responsive`
    - `background-postion-y--responsive`
    - `background-repeat--responsive`
    - `background-size--responsive`
    - `gap--responsive`
    - `padding--responsive`
    - `padding-bottom--responsive`
    - `padding-left--responsive`
    - `padding-right--responsive`
    - `padding-top--responsive`


---


## Accessibility


### Overview

Overhauls MJML accessibility support across body components giving the user the option to support and attribute tools to make simple changes to accessibility display in clients that support it. 

**Full details:** [https://github.com/mjmlio/mjml/pull/3117](https://github.com/mjmlio/mjml/pull/3117)


### What's changed

The following attributes have been included on these components:

- **mj-accordion**
  - `aria-label`
  - `aria-roledescription`
  - `role`
- **mj-accordion-text**
  - `role` [default: `region`]
- **mj-carousel**
  - `aria-label`
  - `aria-roledescription`
  - `role`
- **mj-carousel-image**
  - `aria-label` [default: `slide`]
  - `aria-roledescription` [default: `X of Y`]
  - `role` [default: `group`]
- **mj-column**
  - `aria-label`
  - `aria-roledescription`
  - `role`
- **mj-divider**
  - `aria-hidden`
- **mj-group**
  - `aria-label`
  - `aria-roledescription`
  - `role`
- **mj-hero**
  - `aria-label`
  - `aria-roledescription`
  - `role`
- **mj-image**
  - `aria-hidden`
- **mj-navbar**
  - `aria-label`
  - `aria-roledescription`
  - `role`
- **mj-section**
  - `aria-label`
  - `aria-roledescription`
  - `role`
- **mj-spacer**
  - `aria-hidden`
- **mj-table**
  - `aria-label`
  - `aria-roledescription`
  - `role`[updated to accept `table`]
- **mj-wrapper**
  - `aria-label`
  - `aria-roledescription`
  - `role`
- Added `normalize-elements` attribute to `mj-text` to normalize rendering of lists (`ul`, `ol`). Can be overwritten inline (except Outlook classic)
- Added keyboard accessibility to `mj-accordion` `mj-carousel`, and `mj-navbar`
- Updated `mj-divider` to use a semantic `<hr>`
- Updated all default `font-size` to `16px` and `line-height` to `150%` (and auto added `mso-line-height` of `120%`) **[⚠️BREAKING CHANGE]**


---


## Other

**Full details:** [https://github.com/mjmlio/mjml/pull/3129](https://github.com/mjmlio/mjml/pull/3129)

- Added `container-border-radius` attribute to 10 components:
  - `mj-accordion`
  - `mj-button`
  - `mj-carousel`
  - `mj-divider`
  - `mj-image`
  - `mj-navbar` - Also added missing `container-background-color`
  - `mj-social`
  - `mj-spacer`
  - `mj-table`
  - `mj-text`
- Updated mj-social padding attributes to be more logical:
  - Removed `inner-padding` and replaced with `gutter` which applies all around the icon and text
  - Removed `text-padding` and replaced with `text-spacing` which applies between the icon and text
  - Removed these padding override options `for mj-social-element`
- `mj-table` `cellpadding` / `cellspacing` now use the `integer(px)` type

`cellpadding` and `cellspacing` now accept a plain integer or an integer followed by `px`. Valid `px` values are output as unitless integers:

`<mj-table cellpadding="6px" cellspacing="4px">
<!-- renders as -->
<table cellpadding="6" cellspacing="4" ...>`Any other value is now reported as invalid. With `validationLevel: 'strict'`, templates using these values will no longer compile.


| Value | Before | Now |
| :--- | :--- | :--- |
| `6` | ✅ | ✅ |
| `6px` | ✅ (rendered as `6px`) | ✅ (rendered as `6`) |
| `6PX`, `6 px`, `1.5px`, `-6px` | ✅ | ❌ |
| `10%`, `6em`, `1.5`, `-6`, `abc5` | ✅ | ❌ |

Notes:

- `%` is intentionally not supported. Email clients handle it inconsistently: some treat it as a percentage, others drop the unit and treat it as px.
- Units are case-sensitive (`6PX` is rejected). This matches the existing `unit` type.
- Stricter`integer` validation for custom components

Previously, the `integer` type only checked whether a value *contained* a digit, so values like `6px`, `10%` or `abc5` passed. It now accepts whole non-negative integers only (`0`, `6`, `42`). Custom components that declare `integer` attributes may now get validation errors for values that used to pass. No other core component uses `integer`.

With `soft` or `skip` validation, invalid values still render unchanged, as before.

- `htmlnano 3.5.0` and CSS minification

  - `htmlnano` 3.3.1 → 3.5.0.
  - htmlnano 3.3.1 declared a `cssnano ^8` peer, while `mjml-core` uses `cssnano ^7`. 3.5.0 accepts `cssnano ^7 || ^8 || ^9`.
  - MJML now sets htmlnano's `minifyCharacterReferences: false` by default.
  - **Impact**
    - **Fixes CSS minification silently turning off with npm.** With MJML 5.4.1, after the first `npm install`, later `npm install` / `npm ci` runs left htmlnano without `cssnano`. Minified builds printed `You have to install "cssnano" in order to use htmlnano's "minifyCss" module` to stderr, exited 0, and kept the CSS unminified.
    - Fixes installation with strict peer dependency checks (npm `--strict-peer-deps`, pnpm strict mode).
    - Minified output keeps `&nbsp;` and `&#8202;` as entities, as in MJML 5. Converting them to raw characters can break ESP template engines and transports that re-encode the payload.
  - **What to do**
    - If you had added `cssnano@8` or an `overrides` / `resolutions` entry to work around the peer conflict, you can remove it.
    - To have minification decode character references, opt in:
- CLI: UTF-8 input from stdin
  - **What changed**
    - `mjml -i` now decodes stdin as UTF-8 and reports stream errors instead of hanging.
  - **Impact**
    - Fixes multi-byte characters (accented letters, emoji, CJK…) being replaced with `�` when they were split across chunks of piped input. This affected large inputs and predates Node 26.


---


## Node.js 22 or later is required (⚠️ Breaking change)


### What changed

- All published packages (except `mjml-browser`) now declare `"engines": { "node": ">=22" }`.
- CI tests Node 22, 24 and 26. Node 20 is no longer tested.


### Impact

- Node 20 reached end-of-life in April 2026 and is no longer supported.
- With Yarn classic (v1), installing on Node < 22 fails with an engine error. npm prints a warning but installs.
- On **Node 22.0 – 22.17**, the same error or warning can come from MJML's dependencies (`cosmiconfig@10` requires `^22.18 || >=24`, `commander@15` requires `>=22.12`)


### What to do

- Upgrade to the latest Node 22 release (22.18 or later), or to Node 24 or 26.


---


## ES module config, custom components


### What changed

- Since Node 22.12, `require()` can load ES modules, but it returns `{ default: ... }` instead of the exported value. MJML now unwraps the default export when loading `.mjmlconfig.js`
- Exports that are not objects (for example `export const VERSION = '1.0'`) are skipped when registering custom components, instead of throwing a `RangeError`.


### Impact

- An ESM `.mjmlconfig.js` file on Node >22.12 was silently ignored: custom components were not registered and the build still exited with code 0.
- CommonJS and JSON config files are unchanged.

`// .mjmlconfig.js — now works
export default { packages: ['./my-component.js'] }`

---

## For contributors

- Local development uses Node 26 (`.nvmrc`). Run `nvm use` in the repository root.
- The test runner moved from `mocha` 10 to 12.
- CI installs with `yarn install --frozen-lockfile`. PRs that change dependencies must commit the updated `yarn.lock`.
- Obsolete `resolutions` were removed.

