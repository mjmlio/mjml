## mjml-chart

Thanks a lot to [image-charts](https://image-charts.com/) for their contribution with this component. It's available on [Github](https://github.com/image-charts/mjml-charts) and [NPM](https://www.npmjs.com/package/mjml-chart).

<p align="center">
  <img src="https://puu.sh/tjIVp/cd01defdac.png" alt="mjml-charts" />
</p>

Displays charts as images in your email. Note that the chart can be animated (gif) when the `chan` attribute is specified.

```xml
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-chart chs="300x200" chd="t:10,20,30|15,25,35" cht="bvs" chxt="x,y" chxl="0:|A|B|C" />
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
```


| attribute                                                                      | description                                    | value examples                                  |
| ------------------------------------------------------------------------------ | ---------------------------------------------- | ----------------------------------------------- |
| [cht](https://image-charts.com/documentation#chart-type)                       | chart type                                     | `bvg`, `p`                                      |
| [chd](https://image-charts.com/documentation#data-format)                      | chart data                                     | `t:10,20,30|15,25,35`                           |
| [chds](https://image-charts.com/documentation#text-format-with-custom-scaling) | text format custom scaling                     | `-80,140`                                       |
| [chof](https://image-charts.com/documentation#output-format)                   | output fake format                             | `.png`                                          |
| [chs](https://image-charts.com/documentation#chart-size)                       | chart size                                     | `400x400`                                       |
| [chdl](https://image-charts.com/documentation#chart-legend-text-and-style)     | text for each series, to display in the legend | `NASDAQ|FTSE100|DOW`                            |
| [chdls](https://image-charts.com/documentation#chart-legend-text-and-style)    | chart legend text and style                    | `9e9e9e,17`                                     |
| [chg](https://image-charts.com/documentation#grid-lines)                       | grid lines                                     | `1,1`, `0,1,1,5`                                |
| [chco](https://image-charts.com/documentation#series-colors)                   | series colors                                  | `FFC48C`, `FF0000,00FF00,0000FF`                |
| [chtt](https://image-charts.com/documentation)                                 | chart title                                    | `My beautiful chart`                            |
| [chts](https://image-charts.com/documentation)                                 | chart title colors and font size               | `00FF00,17`                                     |
| [chxt](https://image-charts.com/documentation)                                 | axis to apply labels to                        | `y`, `x,y`                                      |
| [chxl](https://image-charts.com/documentation)                                 | custom axis labels                             | `0:|Jan|July|Jan`, `0:|Jan|July|Jan|1|10|20|30` |
| [chm](https://image-charts.com/documentation)                                  | line fills                                     |                                                 |
| [chls](https://image-charts.com/documentation#line-styles)                     | line thickness and solid/dashed style          | `10`, `3,6,3|5`                                 |
| [chl](https://image-charts.com/documentation#labels)                           | pie chart labels                               | `label1|label2`                                 |
| [chf](https://image-charts.com/documentation#background-fills)                 | Background Fills                               | `b0,lg,0,f44336,0.3,03a9f4,0.8`                 |
| [chan](https://image-charts.com/documentation#chart-gif-animation)             | gif configuration                              | `1200`, `1300|easeInOutSine`                    |
| [chli](https://image-charts.com/documentation#inside-label)                    | doughnut chart inside label                    | `95K€`, `45%`                                   |
| [icac](https://image-charts.com/documentation#enterprise-version)              | image-charts enterprise `account_id`           | `accountId`                                     |
| [ichm](https://image-charts.com/documentation#enterprise-version)              | HMAC-SHA256 signature                          | `0785cf22a0381c2e0239e27c126de4181f501d11…`     |


Since `mjml-chart` is a wrapper for `mjml-image`, `mjml-image` attributes are also available:

| attribute                                 | default values |
| ----------------------------------------- | -------------- |
| [align](#mjml-image)                      | center         |
| [alt](#mjml-image)                        | n/a            |
| [border](#mjml-image)                     | none           |
| [border-radius](#mjml-image)              | n/a            |
| [container-background-color](#mjml-image) | n/a            |
| [padding-bottom](#mjml-image)             | n/a            |
| [padding-left](#mjml-image)               | n/a            |
| [padding-right](#mjml-image)              | n/a            |
| [padding-top](#mjml-image)                | n/a            |
| [padding](#mjml-image)                    | 10px 25px      |
| [title](#mjml-image)                      | n/a            |
| [vertical-align](#mjml-image)             | n/a            |


Note:
- `src` attribute is not customizable, it's generated by `mjml-chart`
- `width` and `height` are automatically generated by `mjml-chart` based on the `chs` attribute
