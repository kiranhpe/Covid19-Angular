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
  @Input() xAxisCatogories: string[];
  @Input() xMinMax: [number, number];
  @Input() yMinMax: [number, number];
  @Input() seriesType: string;
  @Input() isLegendsEnabled: boolean;

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
    this.chartOptions = {
      ...this.chartOptions,
      legend: {
        enabled: this.isLegendsEnabled
      },
      yAxis: {
        ...this.chartOptions.yAxis,
        min: this.yMinMax ? this.yMinMax[0] : null,
        max: this.yMinMax ? this.yMinMax[1] : null,
      },
      xAxis: {
        categories: this.xAxisCatogories ? this.xAxisCatogories : null,
      },
      series: this.series
        ? this.series
        : [
            {
              type: 'line',
              data: [],
              color: 'white',
            },
            {
              type: 'line',
              data: [],
              color: 'green',
            },
          ],
    };
  }
}
