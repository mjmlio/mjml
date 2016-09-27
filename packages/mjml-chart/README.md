## mjml-chart

Displays a responsive image in your email. It is similar to the HTML `<img />` tag.
Note that if no width is provided, the image will use the parent column width.

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

<p align="center">
  <a href="https://mjml.io/try-it-live/component/chart">
    <img width="100px" src="http://imgh.us/TRYITLIVE.svg" alt="sexy" />
  </a>
</p>

| attribute                                                                      | description                                    | value examples                              |
| ------------------------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------- |
| [cht](https://image-charts.com/documentationchart-type)                        | chart type                                     | `bvg`, `p`                                  |
| [chd](https://image-charts.com/documentation#data-format)                      | chart data                                     | `t:10,20,30|15,25,35`                       |
| [chds](https://image-charts.com/documentation#text-format-with-custom-scaling) | text format custom scaling                     | `-80,140`                                   |
| [chof](https://image-charts.com/documentation#output-format)                   | output fake format                             | `.png`                                      |
| [chs](https://image-charts.com/documentation#chart-size)                       | chart size                                     | `400x400`                                   |
| [chdl](https://image-charts.com/documentation#chart-legend-text-and-style)     | text for each series, to display in the legend | `NASDAQ|FTSE100|DOW`                        |
| [chdls](https://image-charts.com/documentation#chart-legend-text-and-style)    | chart legend text and style                    | `9e9e9e,17`                                 |
| [chg](https://image-charts.com/documentation#grid-lines)                       | grid lines                                     | `1,1`, `0,1,1,5`                            |
| [chco](https://image-charts.com/documentation#series-colors)                   | series colors                                  | `FFC48C`, `FF0000,00FF00,0000FF`            |
| [chtt](https://image-charts.com/documentation)                                 | chart title                                    | `My beautiful chart`                        |
| [chts](https://image-charts.com/documentation)                                 | chart title colors and font size               | `00FF00,17`                                 |
| [chls](https://image-charts.com/documentation#line-styles)                     | line thickness and solid/dashed style          | `10`, `3,6,3|5`                             |
| [chl](https://image-charts.com/documentation#labels)                           | pie chart labels                               | `label1|label2`                             |
| [chf](https://image-charts.com/documentation#background-fills)                 | Background Fills                               | `b0,lg,0,f44336,0.3,03a9f4,0.8`             |
| [chan](https://image-charts.com/documentation#chart-gif-animation)             | gif configuration                              | `1200`, `1300|easeInOutSine`                |
| [chli](https://image-charts.com/documentation#inside-label)                    | doughnut chart inside label                    | `95K€`, `45%`                               |
| [icac](https://image-charts.com/documentation#enterprise-version)              | image-charts enterprise `account_id`           | `accountId`                                 |
| [ichm](https://image-charts.com/documentation#enterprise-version)              | HMAC-SHA256 signature                          | `0785cf22a0381c2e0239e27c126de4181f501d11…` |
