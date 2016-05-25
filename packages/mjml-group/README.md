## mjml-group

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-group>
          <mj-column padding="5px">
            <mj-text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat varius lacus quis ornare. Mauris elit est, finibus eget lectus a, semper dignissim tortor. Curabitur eget arcu lacinia metus.
            </mj-text>
            <mj-button href="http://mjml.io" background-color="#92F587" color="white">Subscribe</mj-button>
          </mj-column>
          <mj-column padding="5px">
            <mj-text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas placerat varius lacus quis ornare. Mauris elit est, finibus eget lectus a, semper dignissim tortor. Curabitur eget arcu lacinia metus.
            </mj-text>
            <mj-button href="http://mjml.io" background-color="#92F587" color="white">Subscribe</mj-button>
          </mj-column>
        </mj-group>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```

MJ-Group allows you to handle how the email will be displayed on mobile. Allowing 2 or more column in mobile.

<aside class="notice">
  You can have both column and group in a Section
</aside>

<aside class="notice">
  Column inside a group must have a width in percentage, not in pixel
</aside>

<p align="center">
  <a href="/try-it-live/component/group"><img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" /></a>
</p>

attribute           | unit        | description                    | default attributes
--------------------|-------------|--------------------------------|--------------------------------------
width               | percent/px  | group width                    | (100 / number of sibling in section)%
vertical-align      | string      | middle/top/bottom              | top
background-color    | string      | background color for a group   | n/a
