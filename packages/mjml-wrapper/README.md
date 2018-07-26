## mjml-wrapper

<p align="center">
  <img src="http://i.imgur.com/6YKq83B.png" alt="wrapper" />
</p>

Wrapper enables to wrap multiple sections together. It's especially useful to achieve nested layouts with shared border or background images across sections.

```xml
<mjml>
  <mj-body>
    <mj-wrapper border="1px solid #000000" padding="50px 30px">
      <mj-section border-top="1px solid #aaaaaa" border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px">
        <mj-column>
          <mj-image padding="0" src="https://placeholdit.imgix.net/~text?&w=350&h=150" />
        </mj-column>
      </mj-section>
      <mj-section border-left="1px solid #aaaaaa" border-right="1px solid #aaaaaa" padding="20px" border-bottom="1px solid #aaaaaa">
        <mj-column border="1px solid #dddddd">
          <mj-text padding="20px"> First line of text </mj-text>
          <mj-divider border-width="1px" border-style="dashed" border-color="lightgrey" padding="0 20px" />
          <mj-text padding="20px"> Second line of text </mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/wrapper">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>

The `full-width` property will be used to manage the background width.
By default, it will be 600px. With the `full-width` property on, it will be
changed to 100%.

<aside class="notice">
  You can't nest a full-width section inside a full-width wrapper, section will act as a non-full-width section.
</aside>

<aside class="notice">
  If you're using a background-url on a `mj-wrapper` then do not add one into a section within the mj-wrapper. Outlook Desktop doesn't support nested VML, so it will most likely break your email.
</aside>


attribute           | unit        | description                    | default value
--------------------|-------------|--------------------------------|---------------
full-width          | string      | make the wrapper full-width    | n/a
border              | string      | css border format              | none
border-bottom       | string      | css border format              | n/a
border-left         | string      | css border format              | n/a
border-right        | string      | css border format              | n/a
border-top          | string      | css border format              | n/a
border-radius       | px          | border radius                  | n/a
background-color    | color       | section color                  | n/a
background-url      | url         | background url                 | n/a
background-repeat   | string      | css background repeat          | repeat
background-size     | percent/px  | css background size            | auto
vertical-align      | string      | css vertical-align             | top
text-align          | string      | css text-align                 | center
padding             | px          | supports up to 4 parameters    | 20px 0
padding-top         | px          | section top offset             | n/a
padding-bottom      | px          | section bottom offset          | n/a
padding-left        | px          | section left offset            | n/a
padding-right       | px          | section right offset           | n/a
css-class           | string      | class name, added to the root HTML element created | n/a
