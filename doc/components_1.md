# Components

Components are the core of MJML. 
A component is an abstraction of a more complex email-responsive HTML layout.
Like the HTML `element`, it exposes attributes.
Those enable developers to create the desired rendering.
MJML components make building emails easy.

For instance, MJML converts the simple `mj-button` code here
  to the longer HTML code here.
Rendering cannot be the same on all email clients.
The HTML code creates acceptable and responsive rendering
  with each of many clients.

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
            style="display:inline-block;text-decoration:none;background-color:#414141;border:1px solid #414141;border-radius:3px;color:#ffffff;font-size:13px;font-weight:bold;padding:15px 30px;"
            target="_blank">
		  Hello There!
		</a>
	  </td>
	</tr>
  </tbody>
</table>
```

## mjml

An MJML document starts with an `<mjml>` tag.
It can contain only `mj-head` and `mj-body` tags.
Each has the same purpose as `head` and `body` tags in an HTML document.

attribute | unit   | description                               | default value
----------|--------|-------------------------------------------|---------------
owa       | string | If set to "desktop", forces the desktop display on some versions of Outlook. Without this setting, these versions of Outlook always display the mobile version because they ignore media queries.  | none
lang      | string | sets the `<html lang="">` attribute       | none


## mj-head

See [head components](#standard-head-components).
