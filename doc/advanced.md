
# Newsletter Layout

In this section, you're going to build a newsletter template.
The final result will look like this

<p align="center">
  <a href="/try-it-live/templates/hello-world"><img width="350px" src="https://cloud.githubusercontent.com/assets/6558790/12789753/6fd35f3e-ca9f-11e5-8ff0-a1e090a9bede.png" alt="sexy"></a>
</p>

<p align="center">
  <a href="/try-it-live/templates/newsletter"><img width="100px" src="https://mjml.io/assets/img/svg/TRYITLIVE.svg" alt="sexy" /></a>
</p>

## Structuring

``` html
<mjml>
  <mj-body>
    <mj-container>

      <!-- Header -->
      <mj-section></mj-section>

      <!-- Banner -->
      <mj-section></mj-section>

      <!-- Article -->
      <mj-section></mj-section>

      <!-- Editor Header -->
      <mj-section></mj-section>

      <!-- Editor Image -->
      <mj-section></mj-section>

      <!-- Article -->
      <mj-section></mj-section>

      <!-- Social -->
      <mj-section></mj-section>

    </mj-container>
  </mj-body>
</mjml>
```
Similarly to the basic layout above, you will have to first divide your template into sections.

## Header

``` html

<!-- Header -->
<mj-section padding-bottom="0" background-color="white">
  <mj-column width="100%">
    <mj-image src="https://avatars0.githubusercontent.com/u/16115896?v=3&s=200" width="50px"/>

      <mj-divider
          padding-top="20"
          padding-bottom="0"
          padding-left="0"
          padding-right="0"
          border-width="1px"
          border-color="#f8f8f8"/>
  </mj-column>
</mj-section>

```

The header can be easily done with a regular `mj-image`. We also want a thin border that can be added
with an `mj-divider`. This component acts as a CSS border. Notice that some components such
as the `mj-section` and `mj-divider` come with default padding values.


## Banner

``` html

<!-- Banner -->
<mj-section padding-bottom="0" background-color="#fcfcfc">
  <mj-column width="100%">
    <mj-text align="center" font-size="20" color="grey" font-family="Helvetica Neue" font-weight="200">
    Here is what you've missed
      </mj-text>
      <mj-divider
          padding-top="20"
          padding-bottom="0"
          padding-left="0"
          padding-right="0"
          border-width="1px"
          border-color="#f8f8f8"/>
  </mj-column>
</mj-section>

```

For the banner, we want the same divider, with an `mj-text`.

## Article

The article's columns need to be manually sized. By default, the values are considered to be in pixels (`px`).
The first column contains an image, while the second contains both the title and the paragraph.
the two `mj-text`s are aligned to the left.

## Editor

``` html

<!-- Editor -->
<mj-section padding-bottom="0">
  <mj-column>
    <mj-text font-size="20" color="rgb(165, 176, 184)">
        Explore our new features
      </mj-text>
  </mj-column>
</mj-section>

<mj-section padding-top="0">
  <mj-column width="600">
    <mj-image src="https://cloud.githubusercontent.com/assets/6558790/12450760/ee034178-bf85-11e5-9dda-98d0c8f9f8d6.png"/>
  </mj-column>
</mj-section>

```

Note here that colors can be expressed using different formats (rgb, hsl, hex etc.).

## Social

``` html

<mj-section background-color="#f3f3f3">
  <mj-column>
    <mj-text>Stay in touch!</mj-text>
      <mj-social
          mode="vertical"
          display="twitter facebook" />
  </mj-column>
</mj-section>

```

Finally, as our previous example, the social part will be a vertically aligned `mj-social`.
