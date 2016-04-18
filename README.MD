<br>

<p align="center">
  <a href="http://mjml.io" target="_blank">
    <img width="250"src="https://cloud.githubusercontent.com/assets/6558790/12672296/7b66d8cc-c675-11e5-805d-c6d196320537.png">
  </a>
</p>

<p align="center">
  <a href="https://travis-ci.org/mjmlio/mjml">
    <img src="https://travis-ci.org/mjmlio/mjml.svg?branch=master" alt="travis">
  </a>
  <a href="https://www.codacy.com/app/gbadi/mjml">
    <img src="https://api.codacy.com/project/badge/grade/575339cb861f4ff4b0dbb3f9e1759c35"/>
  </a>
</p>

<br>

<p align="center">
  | <b><a href="#introduction">Introduction</a></b>
  | <b><a href="#installation">MJML-Core</a></b>
  | <b><a href="#show-me-the-code">Usage</a></b>
  | <b><a href="#contribute">Contribute</a></b> |
</p>

<br>

# Introduction

MJML is a markup language designed to reduce the pain of coding a responsive email. Its semantic syntax makes it easy and straightforward while its rich standard components library fastens your development time and lightens your email codebase. MJML’s open-source engine takes care of translating the MJML you wrote into responsive HTML.


#  MJML-core

MJML-Core contains the engine of MJML. You need to register component via interal API or a `.mjmlconfig` in order to render them. Take a look at [MJML-core's readme](https://github.com/mjmlio/mjml/tree/master/packages/mjml-core/README.MD)

## Installation

Launch `npm install` after cloning the repository, then `gulp install`.

From now you have to do `npm link` in each package, `npm link mjml-core` in each package that depends on `mjml-core`.

## Upcomming Features

Discuss and suggest MJML upcomming features in the [issue section](https://github.com/mjmlio/mjml/labels/RFC)
