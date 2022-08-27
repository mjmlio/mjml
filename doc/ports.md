# Ports and Language Bindings

MJML is available for other platforms. The community has created ports to other platforms and wrappers for the official Node implementation. These contributions are not officially supported by the MJML teams.

## Rust: MRML

This project is a reimplementation of the nice MJML markup language in Rust.

https://github.com/jdrouet/mrml

### Missing implementations / components:

- `mj-style[inline]`: not yet implemented. It requires parsing the generated html to apply the inline styles afterward (that's how it's done in mjml) which would kill the performances. Applying it at render time would improve the performance but it would still require to parse the CSS.
- `mj-include`: not yet implemented. It requires to handle loading remote templates when using mrml in a wasm (browser or server side) format, which implies being able to load from a different location (`file://`, `https://`, relative, etc).

## .NET: MJML.NET

A blazingly-fast unofficial port of MJML 4 to .NET 6.

https://github.com/SebastianStehle/mjml-net

### Missing implementations / components

- `mj-style[inline]`: not yet implemented for performance reasons.
- `mj-html-attributes`: not yet implemented for performance reasons.

## Elixir: MJML (Rust NIFs for Elixir)

Native Implemented Function (NIF) bindings for the MJML Rust implementation (mrml).

https://github.com/adoptoposs/mjml_nif

## Ruby: MRML Ruby

Ruby wrapper for MRML, the MJML markup language implementation in Rust.

https://github.com/hardpixel/mrml-ruby

## React: mjml-react

React components for MJML components.

https://github.com/wix-incubator/mjml-react

## Python / Django: django-mjml

The simplest way to use MJML in Django templates.

https://github.com/liminspace/django-mjml

## PHP / Laravel: Laravel MJML

Build responsive e-mails easily using MJML and Laravel Mailables.


https://github.com/asahasrabuddhe/laravel-mjml