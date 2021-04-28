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
<table cellpadding="0" cellspacing="0" style="border:none;border-radius:3px;" align="center">
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

## mjml

A MJML document starts with a `<mjml>` tag, it can contain only `mj-head` and `mj-body` tags. Both have the same purpose of `head` and `body` in a HTML document.

attribute | unit | description | default value
----------|------|-------------|---------------
owa | string | if set to "desktop", will force desktop display on outlook. Otherwise outlook will display mobile version since it ignores media queries | none
lang | string | used as `<html lang="">` attribute | none


## mj-head

mj-head contains head components, related to the document such as style and meta elements (see [head components](#standard-head-components)).
