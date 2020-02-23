---
title: API Reference

language_tabs:
  - html : MJML

toc_footers:
  - <a href='https://github.com/mjmlio/mjml'>Fork me on Github</a>
  - <a href='https://github.com/mjmlio/mjml/issues'>Submit an Issue</a>

search: true
---


# MJML Guides

MJML is a markup language designed to reduce the pain of coding responsive email.
Its semantic syntax makes it easy and straightforward.
Its rich standard components library speeds up your development time
    and lightens your email codebase.
MJML’s open-source engine generates high-quality
    and responsive HTML that demonstrates the use of industry best practices.


## Overview

MJML includes everything Mailjet has learned about HTML email design
    and abstracts the whole complex layer of responsive email design
    for you to easily use.

Boost your speed and productivity with MJML’s semantic syntax.
Say goodbye to endless HTML table nesting
    or CSS specific to individual email clients.
Easily build a responsive email with tags like `<mj-section>` and `<mj-column>`.

MJML's design delivers responsiveness.
Its abstraction simplifies programming.
Our regular updates guarantee you to always be up-to-date
    with the best industry practices
    and to deliver attractive and responsive emails.
Email clients update their specs and requirements regularly.
We geek about that stuff &mdash; we’ll stay on top of it.
You can spend less time reading up on the latest email client updates
    and more time designing beautiful email.
Your email won't necessarily render the same on all email clients.
However. it'll render reasonably on the email clients our many customers tell us
    are most important to them.

``` html
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-image width="100px" src="https://mjml.io/assets/img/logo-small.png" />
        <mj-divider border-color="#F45E43" />
        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">
          Hello World
        </mj-text>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

Here's code for a simple email.

<p align="center"><br /><br /><br /><a href="/try-it-live/intro"><img width="100px" 
src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" /></a></p>

<aside class="notice">
  Notice our closures on tags "mj-image" and "mj-divider" in the example code.
  The XML standard allows self-closing a start tag ("/>")
      when elements don't require content between the start tag and an end tag.
  MJML elements allow the same.
</aside>
