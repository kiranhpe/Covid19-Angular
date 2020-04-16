import { Component, OnInit, OnChanges, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { LineBarChartOptions } from 'app/shared/line-bar-chart.options';

@Component({
  selector: 'app-line-bar-chart',
  templateUrl: './line-bar-chart.component.html',
  styleUrls: ['./line-bar-chart.component.css'],
})
export class LineBarChartComponent implements OnInit, OnChanges {
  @Input() series: any[];
  @Input() xMinMax: [number, number];
  @Input() yMinMax: [number, number];
  @Input() seriesType: string;

  highcharts = Highcharts;
  chartOptions = new LineBarChartOptions().chartOptions;
  constructor() {}

  ngOnInit(): void {
    this.createChart();
  }
  ngOnChanges() {
    this.createChart();
  }

  createChart() {
    let data = [];
    for (let i = 0; i < 10; i++) {
      data.push(i);
    }
    this.chartOptions = {
      ...this.chartOptions,
      yAxis: {
        ...this.chartOptions.yAxis,
        min: 0,
        max: null,
      },
      xAxis: {
        categories: [],
      },
      series: this.series
        ? this.series
        : [
            {
              type: 'column',
              data: [1, 2, 4, 7, 2],
              color: 'white',
            },
          ],
    };
  }
}
