## mj-raw

Displays raw HTML that is not going to be parsed by the MJML engine. Anything left inside this tag should be raw, responsive HTML.
If placed inside `<mj-head>`, its content will be added at the end of the `<head>`.

```xml
<mjml>
  <mj-body>
    <mj-raw>
      <!-- Your content goes here -->
    </mj-raw>
  </mj-body>
</mjml>
```

<p style="text-align: center;" >
  <a target="_blank" href="https://mjml.io/try-it-live/components/raw">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>


If you use mj-raw to add templating language, and use the `minify` option, you might get a `Parsing error`, especially when using the `<` character. You can tell the minifier to ignore some content by wrapping it between two `<!-- htmlmin:ignore -->` tags.


<aside class="notice">
  `mj-raw` is an "ending tag", which means it can contain HTML code which will be left as it is, so it can contain HTML tags with attributes, but it cannot contain other MJML components. More information about ending tags <a href="#ending-tags">in this section</a>.
</aside>

```xml
<mjml>
  <mj-body>
    <mj-raw>
      <!-- htmlmin:ignore -->{% if foo < 5 %}<!-- htmlmin:ignore -->
    </mj-raw>
      <!-- Some mjml section -->
    <mj-raw>
      {% endif %}
    </mj-raw>
  </mj-body>
</mjml>
```
