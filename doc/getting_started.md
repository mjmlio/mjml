
# Getting Started
This is a responsive email

<p align="center">
  <img width="300px" src="https://cloud.githubusercontent.com/assets/6558790/12751054/322b2c8c-c9bb-11e5-98b9-942f6ea4d585.png" alt="layout">
</p>

Like a regular HTML template, we can split this one into different parts to fit in a grid.

The body of your email, represented by the `mj-container` tag contains the entire content of your document:

<p align="center">
  <img width="300px" src="https://cloud.githubusercontent.com/assets/6558790/12751043/1fd499c4-c9bb-11e5-828f-e0e6e18180b8.png" alt="body">
</p>

From here, you can first define your sections:

<p align="center">
  <img width="300px" src="https://cloud.githubusercontent.com/assets/6558790/12751042/1fd191b6-c9bb-11e5-9450-cc15acec72b4.png" alt="sections">
</p>

Inside any section, there should be columns. Columns are what makes MJML responsive.
They automatically re-organize themselves to fit perfectly on mobile and desktop.

<aside class="warning">
  For aesthetics purposes, MJML currently supports a maximum of 4 columns per section.
</aside>

<p align="center">
  <img width="300px" src="https://cloud.githubusercontent.com/assets/6558790/12751041/1fd112d6-c9bb-11e5-97e7-d9c93c743c4d.png" alt="columns">
</p>

Below, you'll find some basic rules of MJML to keep in mind for later. We'll remind them when useful but better start learning them early on.

## Column sizing

### Auto sizing
As we mentioned earlier, sections are made of columns (up to 4 at this stage).

The default behavior of the MJML translation engine is to divide the section space (max 600px) in as many columns as you declare (always up to 4).

<aside class="warning">
  Any mj-element included in a column will have a width equivalent to 100% of this column's width.
</aside>

Let's take the following layout to illustrate this:
```html
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <!-- First column content -->
        </mj-column>
        <mj-column>
          <!-- Second column content -->
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```

Since the first section defines only 2 columns, the engine will translate that in a layout where each column takes 50% of the total space (300px each). If we add a third one, it goes down to 33%, and with a fourth one to 25%.

### Manual sizing
If you need to go above 4 or manually set the column size, it is possible but the auto sizing mechanism described above does not apply anymore, meaning that the engine won't automatically adapt the remaining space.

Let's take the following layout to illustrate this:
```html
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column width="300px">
          <!-- First column content -->
        </mj-column>
        <mj-column>
          <!-- Second column content -->
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```
In that case, the engine won't set the second column width to 300px as one could expect. Once you decide to set manually the size of at least one column, you have to set manually each column size. Always keep in mind that the maximum space to end up with a responsive layout is 600px. This is a known limitation of the engine at the moment that we're working to improve in a future release.

## Nesting

```html
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <!-- Column content -->
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```
As we'll discover in the next section, a basic MJML layout is:

Inside a column, you can include any standard component, or the ones you've defined and registered, but you can't include columns or sections. This is a known limitation of the engine at the moment that we're working to improve in a future release.

## Tag styling
As we'll discover later on in this documentation, each MJML tag (component) defines a set of attributes allowing you to change their final visual aspect.
Since an MJML tag (component) translates into 1 to N HTML tags, it is not an easy task to match all the CSS rules one would like to define. This is the reason why components only offer a limited set of known attributes to modify their visual aspect and not the full range of CSS properties.

Following the [Don't Repeat Yourself DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle, you might not want to repeat the styling in each tag. You might simply want to define the style once and have it apply everywhere you decide (like CSS rules).
For now, you must repeat for each tag the style you want to apply on it. Another way to achieve this is to create your own component, sub-classing a standard one and have your styles defined by default.

At this stage, the translation engine does not support to define styling attributes once in the layout and refer to it later and accept a larger range of CSS rules. These are improvements we're working on for future releases.
