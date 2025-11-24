## Components

Components are the core of MJML. A component is an abstraction of a more complex responsive HTML layout. It exposes attributes, enabling you to create bespoke styling.

MJML comes out of the box with a set of standard components to help you easily build your first templates without having to reinvent the wheel.

For instance, the `mj-button` component is, on the inside, a complex HTML layout:

```html
<!-- MJML -->
<mj-button href="#"> Hello There! </mj-button>

<!-- HTML -->
<table
  cellpadding="0"
  cellspacing="0"
  style="border:none;border-radius:3px;"
  align="center"
>
  <tbody>
    <tr>
      <td
        style="background-color:#414141;border-radius:3px;color:#ffffff;cursor:auto;"
        align="center"
        valign="middle"
        bgcolor="#414141"
      >
        <a
          class="mj-content"
          href="#"
          style="display:inline-block;text-decoration:none;background-color:#414141;border:1px solid #414141;border-radius:3px;color:#ffffff;font-size:13px;font-weight:bold;padding:15px 30px;"
          target="_blank"
        >
          Hello There!
        </a>
      </td>
    </tr>
  </tbody>
</table>
```

### Which email clients/versions are supported?

For full details of component support, [please visit our support matrix](https://mjml.io/compatibility).

### mjml

An MJML document starts with an `mjml` tag. It can contain only `mj-head` and `mj-body` tags. Both have the same purpose of `head` and `body` in a HTML document.

#### Attributes

| attribute | accepts | description                                                                                                                                                                                              | default value |
| --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| owa       | string  | if set to `desktop`, this will force the desktop version for older (self-hosted) versions of Outlook.com that don't support media queries (cf. [this issue](https://github.com/mjmlio/mjml/issues/2241)) | `none`        |
| lang      | string  | adds a `lang` attribute in the `html` and `body > div` tags                                                                                                                                              | `und`         |
| dir       | string  | adds a `dir` attribute in the `html` and `body > div` tags                                                                                                                                               | `auto`        |

### mj-head

Contains components related to the document head such as style and meta elements (see [head components](#standard-head-components)).
