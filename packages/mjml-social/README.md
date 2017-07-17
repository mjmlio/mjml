## mjml-social

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/6558790/12751360/0c78ce48-c9bd-11e5-98ca-4a2ac9e6341b.png" alt="desktop" style="width: 250px;"/>
</p>

Displays calls-to-action for various social networks with their associated logo.
You can activate/deactivate any icon, with `display` property.

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-social
            mode="vertical"
            display="google facebook"
            google-icon-color="#424242"
            facebook-icon-color="#424242"
            facebook-href="My facebook page"
            google-href="My google+ page" />
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```

<p align="center">
  <a href="https://mjml.io/try-it-live/components/social">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

<aside class="notice">
  Note that you can disable default sharing option by adding <code class="prettyprint">:url</code> on any social network.
  Example: <code class="prettyprint">&lt;mj-social display="facebook" /&gt;</code> will render <code class="prettyprint">https://www.facebook.com/sharer/sharer.php?u=[[facebook-href]]</code> url, and <code class="prettyprint">&lt;mj-social display="facebook:url" /&gt;</code> will render <code class="prettyprint">[[facebook-href]]</code> url
</aside>


<aside class="notice">
  If you want to add an unsupported network on <code class="prettyprint">mj-social</code> you have to write :
  <code class="prettyprint">
    &lt;mj-social display="facebook awesome-network"
    awesome-network-content="Share on a awesome network"
    awesome-network-href="http://awesome-network.com/my-company"
    awesome-network-icon-color="#FF00FF"
    awesome-network-icon="http://myicon.png" /&gt;
  </code>
  Note that <code class="prettyprint">content</code> is mandatory if <code class="prettyprint">text-mode</code> is set to <code class="prettyprint">true</code><br>
  <code class="prettyprint">base-url</code> will not be applied on a custom social network icon url
</aside>


attribute                   | unit        | description                                                              | default value
----------------------------|-------------|--------------------------------------------------------------------------|--------------------------------------------
border-radius               | px          | border radius                                                            | 3px
facebook-content            | string      | button text content                                                      | Share
facebook-href               | url         | button redirection url                                                   | [[SHORT_PERMALINK]]
facebook-rel                | string      | specify the rel attribute                                                | n/a
facebook-icon-color         | color       | icon color                                                               | #3b5998
font-family                 | string      | font name                                                                | Ubuntu, Helvetica, Arial, sans-serif
font-size                   | px/em       | font size                                                                | 13px
google-content              | string      | button text content                                                      | +1
google-href                 | url         | button redirection url                                                   | [[SHORT_PERMALINK]]
google-rel                  | string      | specify the rel attribute                                                | n/a
google-icon-color           | color       | icon color                                                               | #dc4e41
icon-size                   | percent/px  | icon size                                                                | 20px
instagram-content           | string      | button text content                                                      | Share
instagram-href              | url         | button redirection url                                                   | [[SHORT_PERMALINK]]
instagram-rel               | string      | specify the rel attribute                                                | n/a
instagram-icon-color        | color       | icon color                                                               | #3f729b
line-height                 | percent/px  | space between lines                                                      | 22px
linkedin-content            | string      | button text content                                                      | Share
linkedin-href               | url         | button redirection url                                                   | [[SHORT_PERMALINK]]
linkedin-rel                | string      | specify the rel attribute                                                | n/a
linkedin-icon-color         | color       | icon color                                                               | #0077b5
mode                        | string      | vertical/horizontal                                                      | horizontal
pinterest-content           | string      | button text content                                                      | Pin it
pinterest-href              | url         | button redirection url                                                   | [[SHORT_PERMALINK]]
pinterest-rel               | string      | specify the rel attribute                                                | n/a
pinterest-icon-color        | color       | icon color                                                               | #bd081c
text-decoration             | string      | underline/overline/none                                                  | none
text-mode                   | string      | display social network name                                              | true
twitter-content             | string      | button text content                                                      | Tweet
twitter-href                | url         | button redirection url                                                   | [[SHORT_PERMALINK]]
twitter-rel                 | string      | specify the rel attribute                                                | n/a
twitter-icon-color          | color       | icon color                                                               | #55acee
align                       | string      | left/right/center                                                        | center
color                       | color       | text color                                                               | #333333
base-url                    | string      | icon base url                                                            | https://www.mailjet.com/images/theme/v1/icons/ico-social/
display                     | string      | List of social icons to display separated by a space,                    | facebook twitter google
                            |             | available values: `facebook google instagram pinterest linkedin twitter` |
inner-padding               | px          | social network surrounding padding                                       | 4px
padding                     | px          | supports up to 4 parameters                                              | 10px 25px
padding-top                 | px          | top offset                                                               | n/a
padding-bottom              | px          | bottom offset                                                            | n/a
padding-left                | px          | left offset                                                              | n/a
padding-right               | px          | right offset                                                             | n/a
container-background-color  | color       | inner element background color                                           | n/a
css-class                   | string      | class name, added to the root HTML element created | n/a
