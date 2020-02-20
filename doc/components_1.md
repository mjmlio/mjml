# Components

Components are the core of MJML. A component is an abstraction of a more complex email-responsive HTML layout. It exposes attributes, enabling you to interact with the final component visual aspect.

MJML comes out of the box with a set of standard components to help you build easily your first templates without having to reinvent the wheel.

For instance, the `mj-button` component is, on the inside, a complex HTML layout:

``` html
<!-- MJML -->
<mj-button href="#">
    Hello There!
</mj-button>

<!-- HTML -->
<table cellpadding="0" cellspacing="0"
       style="border:none;border-radius:3px;" align="center">
  <tbody>
    <tr>
      <td style="background-color:#414141;border-radius:3px;color:#ffffff;cursor:auto;" align="center" valign="middle" bgcolor="#414141">
				<a class="mj-content" href="#" style="display:inline-block;text-decoration:none;background-color:#414141;border:1px solid #414141;border-radius:3px;color:#ffffff;font-size:13px;font-weight:bold;padding:15px 30px;" target="_blank">
					Hello There!
				</a>
			</td>
		</tr>
	</tbody>
</table>
```

#### Attribute lists

MJML authors use _attributes_ to specify custom behavior of MJML components.
Our documentation has _attribute lists_ for each component describing each 
  supported attribute.
The lists have four columns.
The first attribute list is just below, under the ["mjml" heading](#mjml).

The _attribute_ column is a complete list of attributes a component supports.
An examples of syntax for using a attributes appears just below here
  in discussion of the `mjml` tag and its `lang` attribute.

<aside class="notice">
In general, if MJML has an attribute of the same name as an HTML attribute,
  the two operate similarly.
</aside>

The _unit_ column specifies whether the attribute must be, for instance,
  a string, a number, or other unit.
There's a little more on this later in this section.

The _description_ column explains the purpose of the attribute
  and what the developer can achieve with it.
Sometimes, it indicates equivalence with the same-name HTML attribute. 

The _default value_ column specifies the default value for the attribute.
Attributes without a default value have _n/a_ here.

<aside class="notice">
MJML syntax for <em>HTML</em> attributes differs from syntax for <em>MJML</em> attributes.
MJML "css-class" attributes introduce HTML attributes in MJML components;
  they refer to [mj-style](#mj-style) definitions.
MJML attributes use the same syntax in MJML tags as HTML attributes in HTML tags.
</aside>

<aside class="notice">
MJML can support both an HTML attribute and an MJML attribute
  with the same spelling and different values.
In such code, MJML uses the HTML attribute
  inside an MJML "css-class" attribute and
  in raw HTML inside a "class" attribute.
It uses the MJML attribute otherwise.
</aside>

<aside class="notice">
Use caution in choosing attributes and attribute values for email.
Some widely used email clients don't support
  some popular attributes or some attribute values.
Or support them differently than other clients.
https://www.caniemail.com/ might have valuable advice.
As [one Email Design Reference](https://templates.mailchimp.com/)
  (accessed 2019-12-23) said, "Coding an HTML email isn't much different than
  coding a website was back in the late '90s."
In many cases, MJML will handle attributes that don't work
  to give developers a "decent" rendering, even if different than intended.
We do what we can. Developers take it from there.
</aside>


## mjml

An MJML document starts with an `<mjml>` tag.
It can contain only `<mj-head>` and `<mj-body>` tags.
Both have the same purpose of `<head>` and `<body>` in an HTML document.

attribute | unit | description | default value
----------|------|-------------|---------------
owa | string | If set to "desktop", will force desktop display on outlook. Otherwise outlook will display mobile version since it ignores media queries. | n/a
lang | string | same as HTML's `<html lang="">` | n/a

## mj-head

`mj-head` contains head components, related to the document such as style and meta elements (see [head components](#standard-head-components)).

`mj-head` is optional.
