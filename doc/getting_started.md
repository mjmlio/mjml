
# Getting Started
This is a responsive email

<p style="text-align: center;" >
  <img width="300px" src="https://static.mailjet.com/mjml-website/documentation/getting-started-1.png" alt="layout">
</p>

Like a regular HTML template, we can split this one into different parts to fit in a grid.

The body of your email, represented by the `mj-body` tag contains the entire content of your document:

<p style="text-align: center;" >
  <img width="300px" src="https://static.mailjet.com/mjml-website/documentation/getting-started-2.png" alt="body">
</p>

From here, you can first define your sections:

<p style="text-align: center;" >
  <img width="300px" src="https://static.mailjet.com/mjml-website/documentation/getting-started-3.png" alt="sections">
</p>

Inside any section, there should be columns (even if you need only one column). Columns are what makes MJML responsive.

<p style="text-align: center;" >
  <img width="300px" src="https://static.mailjet.com/mjml-website/documentation/getting-started-4.png" alt="columns">
</p>

Below, you'll find some basic rules of MJML to keep in mind for later. We'll remind them when useful but better start learning them early on.

## Column sizing

### Auto sizing

The default behavior of the MJML translation engine is to divide the section space (600px by default, but it can be changed with the `width` attribute on `mj-body`) in as many columns as you declare.

<aside class="warning">
  Any mj-element included in a column will have a width equivalent to 100% of this column's width.
</aside>

Let's take the following layout to illustrate this:

```html
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <!-- First column content -->
      </mj-column>
      <mj-column>
        <!-- Second column content -->
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

Since the first section defines only 2 columns, the engine will translate that in a layout where each column takes 50% of the total space (300px each). If we add a third one, it goes down to 33%, and with a fourth one to 25%.

<p>
  <br/><br/><br/><br/><br/><br/><br/><br/>
</p>

### Manual sizing
You can also manually set the size of your columns, in pixels or percentage, by using the `width` attribute on `mj-column`.

Let's take the following layout to illustrate this:

```html
<mjml>
  <mj-body>
    <mj-section>
      <mj-column width="200px">
        <!-- First column content -->
      </mj-column>
      <mj-column width="400px">
        <!-- Second column content -->
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```
