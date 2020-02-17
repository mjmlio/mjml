# What should I know before I get started?

## Code of Conduct

This project adheres to the Contributor Covenant [code of conduct](https://contributor-covenant.org/version/1/4/). By participating, you are expected to uphold this code. Please report unacceptable behavior to [support@mjml.io](mailto:support@mjml.io).

## Packages

MJML is made up of different [packages](https://github.com/mjmlio/mjml/tree/master/packages), which make it very modular but might also make it hard for you to know how it is organized.

There are 3 types of packages:

* `mjml-core`: the engine that renders mjml components

* `mjml-cli`: the client, base on the mjml-core interface

* `mjml`: a standalone client including the standard library of components

* one standalone package for each component

# How Can I Contribute?

## Reporting Bugs

Here are the guidelines to help maintainers and the community better understand and solve your issue.

## Before Submitting a Bug Report or Enhancement

* **Check the [FAQ](https://mjml.io/faq)** for a list of common questions and problems

* **Check the [documentation](https://mjml.io/documentation/)** for more details on how to use MJML, MJML components, how to create a custom component and more

* **Search [issues](https://github.com/mjmlio/mjml/issues?utf8=%E2%9C%93&q=is%3Aissue+)** and **[pull requests](https://github.com/mjmlio/mjml/pulls?utf8=%E2%9C%93&q=is%3Apr+)** to see if a similar one might have been already asked before

## How To Submit A Good Bug Report or Enhancement?

Explain the problem you’re facing and include as many details as you can to help maintainers reproduce the problem:

* **Use a clear and self-explanatory title**

* **Provide all the specific information that might be needed to reproduce the problem, such as:**

    * **How you’re using MJML** (whether you’re using the [try it live](https://mjml.io/try-it-live), [running it locally](https://github.com/mjmlio/mjml/releases), [using the app](https://github.com/mjmlio/mjml-app), or any other way)

    * The **version of MJML** you’re using

    * The **MJML code** you used to encounter this bug, as copy/pasteable snippets, using [Markdown Code Blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/)

    * The **name and version of the email client(s)** on which a bug is encountered

    * **Screenshots** of the issue / behaviour before enhancement on the **given email clients**

    * Explain why **what you encountered is a bug** / how your enhancement would **improve MJML**: what did you expect to see and why?

* If you want MJML to support a new styling attribute, **add screenshots **from Litmus or Email On Acid showing that this attribute is **supported for [email clients supported by MJML](https://mjml.io/faq#email-clients)**

## Template For Submitting Bug Reports

      [Short description of problem here]

      **Reproduction Steps:**

      1. [First Step]
      2. [Second Step]
      3. [Other Steps...]

      **Expected behavior:**

      [Describe expected behavior here]

      **Observed behavior:**

      [Describe observed behavior here]

      **Screenshots and GIFs**

      ![Screenshots and GIFs which follow reproduction steps to demonstrate the problem](url)

      **MJML version:**

      [Enter MJML version here]

      **Email clients the bug is seen on:**

      [Enter email clients names and versions here]

## Your First Code Contribution

If you’re not sure how you can contribute to MJML, start looking for the [beginner](https://github.com/mjmlio/mjml/labels/Beginner) and [help-wanted](https://github.com/mjmlio/mjml/labels/Community%20help%20wanted) labels.

## How to Submit A Good Pull Request

* Document your code
* Update the documentation (example: table of a component’s supported attributes if you add an attribute to this component)
* Test your pull request locally
* Include screenshots from [Litmus](https://litmus.com/) or [Email On Acid](https://www.emailonacid.com/) showing that your feature is supported for [email clients supported by MJML](https://mjml.io/faq#email-clients)
* Provide the MJML code you used to test locally and on the screenshots
* We suggest following the [React Styleguide](https://github.com/airbnb/javascript/tree/master/react) by Airbnb

# Additional Notes

## Discussions vs Bugs & Enhancements

## Tags categories

Type of issue and issue state

#### Type of Issue and Issue State

| Label name | Description |
| --- | --- |
| `Feature request` | Feature requests or improvements |
| `Bug` | Confirmed bugs or reports likely to be bugs |
| `Community-help-wanted` | The MJML team would appreciate help from the community in implementing these issues |
| `Beginner` | Less complex issues that would be good first issues to work on for users who want to contribute to MJML |
| `More information needed` | We need more information to solve this issue (see [How to submit a good bug report or enhancement]( https://github.com/mjmlio/mjml/blob/master/CONTRIBUTING.md#how-to-submit-a-good-bug-report-or-enhancement)) |
| `Needs reproduction` | Likely bugs we couldn’t reproduce |
| `Duplicate` | Issues that are duplicates of other issues |
| `Invalid` | Issues which aren’t valid (e.g user errors) |
| `Tooling idea` | Feature requests that might be good candidates for tools around MJML instead of extending MJML |

#### Topic categories

| Label name | Description |
| --- | --- |
| `Not rendering` | the engine won’t render a template without a valid reason |
| `General rendering issue` | the HTML rendered is not responsive while respecting MJML’s best practices |
| `Email client name` | The HTML rendered is not responsive for a specific email client |
| `CLI`| issues related to the MJML Command Line Interface |
| `Documentation` | issues related to the MJML documentation |

#### Pull Requests labels

| Label name | Description |
| --- | --- |
| `Work in progress` | PR which are still being worked on, more changes will follow |
| `Needs review `| Pull requests which need code review and approval |
| `Under review` | PR being reviewed |
| `Requires changes` | PR which need to be updated based on review comments and then reviewed again
| `Needs testing` | PRs which need testing on [Litmus](https://litmus.com/) or [Email On Acid](https://www.emailonacid.com/) |
