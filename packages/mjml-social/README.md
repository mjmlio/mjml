## MJ-SOCIAL

``` html

  <mjml>
    <content>
      <mj-social
        mode="vertical"
        display="google facebook"
        google-icon-color="#424242"
        facebook-icon-color="#424242"
        facebook-href="my facebook page"
        google-href="my google+ page"/>   
    </content>
  </mjml>
  
```

Displays calls-to-action for various social networks with their associated logo.
You can activate/deactivate any icon, with `display` property.

<aside class="notice">
Note that you can disable default sharing option by adding `:url` on any social network.
Example: `<mj-social display="facebook" />` will render `https://www.facebook.com/sharer/sharer.php?u=[[facebook-href]]` url, and `<mj-social display="facebook:url" />` will render `[[facebook-href]]` url
</aside>

<p align="center">
<img src="https://cloud.githubusercontent.com/assets/6558790/12751360/0c78ce48-c9bd-11e5-98ca-4a2ac9e6341b.png" alt="desktop" style="width: 250px;"/>
</p>

<p align="center">
  <a href="/try-it-live/social"><img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" /></a>
</p>

attribute                   | unit        | description                                                              | default value
----------------------------|-------------|--------------------------------------------------------------------------|--------------------------------------------
facebook-content            | string      | button text content                                                      | Share
facebook-href               | url         | button redirection url                                                   | [[SHORT_PERMALINK]]
facebook-icon-color         | color       | icon color                                                               | #3b5998
font-family                 | string      | font name                                                                | Ubuntu, Helvetica, Arial, sans-serif
font-size                   | px/em       | font size                                                                | 13px
google-content              | string      | button text content                                                      | +1
google-href                 | url         | button redirection url                                                   | [[SHORT_PERMALINK]]
google-icon-color           | color       | icon color                                                               | #dc4e41
icon-size                   | percent/px  | icon size                                                                | 20px
instagram-content           | string      | button text content                                                      | Share
instagram-href              | url         | button redirection url                                                   | [[SHORT_PERMALINK]]
instagram-icon-color        | color       | icon color                                                               | #3f729b
line-height                 | percent/px  | space between lines                                                      | 22px
linkedin-content            | string      | button text content                                                      | Share
linkedin-href               | url         | button redirection url                                                   | [[SHORT_PERMALINK]]
linkedin-icon-color         | color       | icon color                                                               | #0077b5
mode                        | string      | vertical/horizontal                                                      | horizontal
pinterest-content           | string      | button text content                                                      | Pin it
pinterest-href              | url         | button redirection url                                                   | [[SHORT_PERMALINK]]
pinterest-icon-color        | color       | icon color                                                               | #bd081c
text-decoration             | string      | underline/overline/none                                                  | none
text-mode                   | string      | vertical/horizontal                                                      | true
twitter-content             | string      | button text content                                                      | Tweet
twitter-href                | url         | button redirection url                                                   | [[SHORT_PERMALINK]]
twitter-icon-color          | color       | icon color                                                               | #55acee
align                       | string      | left/right/center                                                        | center
color                       | color       | text color                                                               | #333333
base-url                    | string      | icon base url                                                            | https://www.mailjet.com/images/theme/v1/icons/ico-social/
display                     | string      | List of social icons to display separated by a space,                    | facebook twitter google
                            |             | available values: `facebook google instagram pinterest linkedin twitter` |
padding                     | px          | supports up to 4 parameters                                              | 10px 25px
padding-top                 | px          | top offset                                                               | n/a
padding-bottom              | px          | bottom offset                                                            | n/a
padding-left                | px          | left offset                                                              | n/a
padding-right               | px          | right offset                                                             | n/a
