> <span style="color: red">!!!</span> This project under development now!

<p align="center">
 <img width="20%" height="20%" src="./logo.svg">
</p>

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)]()

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

### NPM

`npm install ngx-folio --save-dev`

### Yarn

`yarn add ngx-folio --dev`

## Usage

### Pagination segments

```
  [1] [2] [3] ... [15] [16] [17] ... [30] [31] [32]
  |         |     |            |     |            |
     start            cursor              end
```

### Custom styling

It's easy to override necessary styles:

1. Add custom class to the `ngx-folio` element.

```html

<ngx-folio class="custom-style" [collectionSize]="100" [pageSize]="10"></ngx-folio>
```

2. Use `::ng-deep` in a specific component or just override property in a global stylesheet file.

```scss
// my-cmp.component stylesheet
::ng-deep {
  .custom-style .ngx-folio__default-button_page {
    background-color: #ffa400;
  }
}

// global stylesheet
.custom-style .ngx-folio__default-button_page {
  background-color: #ffa400;
}
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/FFKL"><img src="https://avatars.githubusercontent.com/u/11336491?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dmitrii Korostelev</b></sub></a><br /><a href="https://github.com/FFKL/ngx-folio/commits?author=FFKL" title="Code">💻</a> <a href="#content-FFKL" title="Content">🖋</a> <a href="https://github.com/FFKL/ngx-folio/commits?author=FFKL" title="Documentation">📖</a> <a href="#maintenance-FFKL" title="Maintenance">🚧</a> <a href="https://github.com/FFKL/ngx-folio/commits?author=FFKL" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
Contributions of any kind welcome!

<div><a href="https://www.freepik.com/vectors/logo">Logo vector created by freepik - www.freepik.com</a></div>
