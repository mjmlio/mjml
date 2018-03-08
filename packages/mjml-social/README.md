## mjml-social

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/6558790/12751360/0c78ce48-c9bd-11e5-98ca-4a2ac9e6341b.png" alt="desktop" style="width: 250px;"/>
</p>

Displays calls-to-action for various social networks with their associated logo. You can add social networks with the `mj-social-element` tag.

```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-social font-size="15px" icon-size="30px" mode="horizontal">
          <mj-social-element name="facebook" href="https://mjml.io/">
            Facebook
          </mj-social-element>
          <mj-social-element name="google" href="https://mjml.io/">
            Google
          </mj-social-element>
          <mj-social-element  name="instagram" href="https://mjml.io/">
            Instagram
          </mj-social-element>
        </mj-social>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

<aside class="notice">
  You can add any unsupported network like this:

```xml
    <mj-social-element href="url" background-color="#FF00FF" src="path-to-your-icon">
      Optional label
    </mj-social-element>
```
</aside>

<p align="center">
  <a href="https://mjml.io/try-it-live/components/social">
    <img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="try it live" />
  </a>
</p>

<!--
<aside class="notice">
  Note that you can disable default sharing option by adding <code class="prettyprint">:url</code> on any social network.
  Example: <code class="prettyprint">&lt;mj-social display="facebook" /&gt;</code> will render <code class="prettyprint">https://www.facebook.com/sharer/sharer.php?u=[[facebook-href]]</code> url, and <code class="prettyprint">&lt;mj-social display="facebook:url" /&gt;</code> will render <code class="prettyprint">[[facebook-href]]</code> url
</aside>
-->


attribute                   | unit        | description                   | default value
----------------------------|-------------|-------------------------------|---------------------------
border-radius               | px          | border radius                 | 3px
font-family                 | string      | font name                     | Ubuntu, Helvetica, Arial, sans-serif
font-size                   | px/em       | font size                     | 13px
icon-size                   | percent/px  | icon size                     | 20px
line-height                 | percent/px  | space between lines           | 22px
mode                        | string      | vertical/horizontal           | horizontal
text-decoration             | string      | underline/overline/none       | none
align                       | string      | left/right/center             | center
color                       | color       | text color                    | #333333
inner-padding               | px          | social network surrounding padding                 | 4px
padding                     | px          | supports up to 4 parameters                       | 10px 25px
padding-top                 | px          | top offset                         | n/a
padding-bottom              | px          | bottom offset                    | n/a
padding-left                | px          | left offset                      | n/a
padding-right               | px          | right offset                       | n/a
container-background-color  | color       | inner element background color                     | n/a

### mj-social-element

This component enables you to display a given social network inside `mj-social`.  
Note that default icons are transparent, which allows `background-color` to actually be the icon color.

attribute                   | unit        | description                   | default value
----------------------------|-------------|-------------------------------|---------------------------
border-radius               | px          | border radius                 | 3px
href                        | url         | button redirection url        | [[SHORT_PERMALINK]]
background-color            | color       | icon color                    | Each social `name` has its own default
font-family                 | string      | font name                     | Ubuntu, Helvetica, Arial, sans-serif
font-size                   | px/em       | font size                     | 13px
icon-size                   | percent/px  | icon size                     | 20px
line-height                 | percent/px  | space between lines           | 22px
mode                        | string      | vertical/horizontal           | horizontal
text-decoration             | string      | underline/overline/none       | none
text-mode                   | string      | display social network name   | true
align                       | string      | left/right/center             | center
color                       | color       | text color                    | #333333
name                        | string      | `facebook google instagram pinterest linkedin twitter` | N/A
src                         | url         | image source                  | Each social `name` has its own default
padding                     | px          | supports up to 4 parameters                       | 10px 25px
padding-top                 | px          | top offset                         | n/a
padding-bottom              | px          | bottom offset                    | n/a
padding-left                | px          | left offset                      | n/a
padding-right               | px          | right offset                       | n/a
target                      | string      | usual html link target              | \_blank
