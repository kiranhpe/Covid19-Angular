import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { PieChartOptions } from 'app/shared/pie-chart.options';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, OnChanges{
  @Input() series;
  constructor() { }

  highcharts = Highcharts;
  chartOptions: any = new PieChartOptions().chartOptions;

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(): void {
    this.createChart();
  }


  createChart() {
    console.log(this.series)
    this.chartOptions = {
      ...this.chartOptions,
      legend: {
        enabled: true
      },
      series:[
        {
          data: this.series
        }
      ],
    };
  }
}
