
## Basic layout example

In this section, you're going to learn how to code a basic email template using MJML.

Here‘s what we’re building:

<figure>
  <img width="350px" src="https://static.mailjet.com/mjml-website/documentation/basic-layout-example.png" alt="Basic email layout" />
</figure>

<p class="cta-container"><a class="cta" href="https://mjml.io/try-it-live/templates/basic">Try it live</a></p>

### Sections

```html
<mjml>
  <mj-body>
    <!-- Company Header -->
    <mj-section background-color="#f0f0f0"></mj-section>

    <!-- Image Header -->
    <mj-section background-color="#f0f0f0"></mj-section>

    <!-- Introduction Text -->
    <mj-section background-color="#fafafa"></mj-section>

    <!-- 2 columns section -->
    <mj-section background-color="white"></mj-section>

    <!-- Icons -->
    <mj-section background-color="#fbfbfb"></mj-section>

    <!-- Social icons -->
    <mj-section background-color="#f0f0f0"></mj-section>
  </mj-body>
</mjml>
```

First, we’ll create the basic structure, dividing the email into six sections.

#### Company Header

```html
<!-- Company Header -->
<mj-section background-color="#f0f0f0">
  <mj-column>
    <mj-text
      align="center"
      font-style="italic"
      font-size="20px"
      color="#626262"
    >
      My Company
    </mj-text>
  </mj-column>
</mj-section>
```

The first section of the email consists in a centered banner, containing only the company name. The following markup is the MJML representation of the layout we want to obtain.

<div class="alert alert-important" role="alert">
  <p>Important</p>
  <p>Remember everything has to be contained within the column.</p>
</div>

#### Image Header

```html
<!-- Image Header -->
<mj-section
  background-url="https://1.bp.blogspot.com/-TPrfhxbYpDY/Uh3Refzk02I/AAAAAAAALw8/5sUJ0UUGYuw/s1600/New+York+in+The+1960's+-+70's+(2).jpg"
  background-size="cover"
  background-repeat="no-repeat"
>
  <mj-column width="600px">
    <mj-text
      align="center"
      color="#fff"
      font-size="40px"
      font-family="Helvetica Neue"
    >
      Slogan here
    </mj-text>

    <mj-button background-color="#F63A4D" href="#"> Promotion </mj-button>
  </mj-column>
</mj-section>
```

Next comes a section with a background image and a block of text (representing the company slogan) and a button pointing to a page listing all the company promotions.

To add the image header, you will have to replace the section's `background-color` with a `background-url`.

Similarly to the first company header, you will have to center the text.

The button `href` sets where the button links to.

In order to have the background rendered full-width in the column, set the column width to 600px with `width="600px"`.

#### Introduction Text

```html
<!-- Intro text -->
<mj-section background-color="#fafafa">
  <mj-column width="400px">
    <mj-text
      font-style="italic"
      font-size="20px"
      font-family="Helvetica Neue"
      color="#626262"
    >
      My Awesome Text
    </mj-text>

    <mj-text color="#525252">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum enim
      eget magna efficitur, eu semper augue semper. Aliquam erat volutpat. Cras
      id dui lectus. Vestibulum sed finibus lectus, sit amet suscipit nibh.
      Proin nec commodo purus. Sed eget nulla elit. Nulla aliquet mollis
      faucibus.
    </mj-text>

    <mj-button background-color="#F45E43" href="#">Learn more</mj-button>
  </mj-column>
</mj-section>
```

The introduction text will consist of a heading, the main text and a button.
The title is a regular `mj-text` tag that can be styled as a heading.

#### 2 Columns Section

```html
<!-- Side image -->
<mj-section background-color="white">
  <!-- Left image -->
  <mj-column>
    <mj-image
      width="200px"
      src="https://designspell.files.wordpress.com/2012/01/sciolino-paris-bw.jpg"
    />
  </mj-column>

  <!-- right paragraph -->
  <mj-column>
    <mj-text
      font-style="italic"
      font-size="20px"
      font-family="Helvetica Neue"
      color="#626262"
    >
      Find amazing places
    </mj-text>

    <mj-text color="#525252">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum enim
      eget magna efficitur, eu semper augue semper. Aliquam erat volutpat. Cras
      id dui lectus. Vestibulum sed finibus lectus.</mj-text
    >
  </mj-column>
</mj-section>
```

This section is made up of two columns. One containing an image, the other containing text.

For the image, note that when a tag does not have any children, you can use the XML self-closing tag syntax: `<mj-image />`

For the text, you are going to use two `mj-text` tags like, as previously; one with a heading style, and the other one styled as regular text.

#### Icons

```html
<!-- Icons -->
<mj-section background-color="#fbfbfb">
  <mj-column>
    <mj-image
      padding="10px"
      width="100px"
      src="https://191n.mj.am/img/191n/3s/x0l.png"
    />
  </mj-column>
  <mj-column>
    <mj-image
      padding="10px"
      width="100px"
      src="https://191n.mj.am/img/191n/3s/x01.png"
    />
  </mj-column>
  <mj-column>
    <mj-image
      padding="10px"
      width="100px"
      src="https://191n.mj.am/img/191n/3s/x0s.png"
    />
  </mj-column>
</mj-section>
```
This section uses a 3-column layout to display the 3 icons horizontally across the email.


#### Social Icons

```html
<mj-section background-color="#e7e7e7">
  <mj-column>
    <mj-social>
      <mj-social-element name="facebook">Share</mj-social-element>
    </mj-social>
  </mj-column>
</mj-section>
```

MJML has an `mj-social` component as standard. Here, we're going to use `facebook` only, but there are several default social media sites to choose from, or you can add your own bespoke.
