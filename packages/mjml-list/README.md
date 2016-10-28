## mjml-list

`mj-list` enables you to create unordered lists and enables you to wrap `li`s tag.

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-list>
            <li>Go to the store</li>
            <li>sleep</li>
            <li>eat</li>
            <li>sleep again</li>
          </mj-list>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```

<aside class="warning">
  This component will soon be <b>deprecated</b>. To create a list, simply use HTML leveraging the `ul` and `li` tags inside a `mj-text`.
</aside>

<p align="center">
  <a href="https://mjml.io/try-it-live/components/list">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

attribute        | unit        | description                    | default value
-----------------|-------------|--------------------------------|-------------------------------------------
color            | color       | text color                     | #000000
font-family      | string      | font name                      | Ubuntu, Helvetica, Arial, sans-serif
font-size        | px          | text size                      | 13px
line-height      | percent/px  | space between lines            | 22px
padding          | px          | generate space around content  | 10px 25px
padding-top      | px          | top offset                     | n/a
padding-bottom   | px          | bottom offset                  | n/a
padding-left     | px          | left offset                    | n/a
padding-right    | px          | right offset                   | n/a
