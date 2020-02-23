# Components

Components are the core of MJML.
A component is an abstraction of a more complex email-responsive HTML layout.
It exposes attributes, enabling you to interact with the final component visual aspect.

MJML comes out of the box with a set of standard components to help you
    easily build your first templates without starting from scratch.

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
      <td style="background-color:#414141;border-radius:3px;color:#ffffff;cursor:auto;"
          align="center" valign="middle" bgcolor="#414141">
		<a class="mj-content" href="#" 
            style="display:inline-block;text-decoration:none;background-color:#414141
;border:1px solid #414141;border-radius:3px;color:#ffffff;font-size:13px;font-weight:bold;padding:15px 30px;"
            target="_blank">
		  Hello There!
		</a>
	  </td>
	</tr>
  </tbody>
</table>
```

#### Attribute lists

Our documentation has _attribute lists_ for each component describing each 
    supported attribute.
The first column of each list is a complete list of the MJML attributes
    for the element.
The linter is likely to complain about any other.

<aside class="notice">
  Within MJML, HTML attributes apply only to HTML elements and
      MJML attributes apply only to MJML elements.
  Many MJML attributes are spelled the same as HTML attributes
      (and usually operate similarly).
  Still, MJML attributes do not support some HTML attribute values.
  These choices reflect spotty support by email clients.
</aside>

<aside class="notice">
  If you wonder whether a given CSS attribute or value has good support
      in email clients, [caniemail.com](https://www.caniemail.com/)
      often has valuable advice.
</aside>


## mjml

An MJML document is an `<mjml>` element
    (start tag, end tag, and material between them).
Only `<mj-head>` and `<mj-body>` elements may be direct children.
Those two have the same purposes as the HTML `<head>` and `<body>` elements.

attribute | unit   | description                     | default value
----------|--------|---------------------------------|---------------
owa       | string | If set to "desktop", will force desktop display on Outlook. Otherwise Outlook will display mobile version since it ignores media queries.      | n/a
lang      | string | same as HTML's `<html lang="">` | n/a


## mj-head

`mj-head` contains head components,
    related to the document such as style and meta elements
    (see [head components](#standard-head-components)).

`mj-head` is optional.
