import { Component, OnInit, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { LineBarChartOptions } from 'app/shared/line-bar-chart.options';

@Component({
  selector: 'app-line-bar-chart',
  templateUrl: './line-bar-chart.component.html',
  styleUrls: ['./line-bar-chart.component.css'],
})
export class LineBarChartComponent implements OnInit, OnChanges {
  highcharts = Highcharts;
  chartOptions = new LineBarChartOptions().chartOptions;
  constructor() {}

  ngOnInit(): void {
     this.demo();
  }
  ngOnChanges() {
     this.demo();
  }

  demo() {

   let data = [];
   for(let i= 0; i< 10; i++) {
      data.push(i)
   }
    this.chartOptions = {
      ...this.chartOptions,
      yAxis: {
         ...this.chartOptions.yAxis,
         min:0,
         max: null,
      },
      xAxis: {
         categories: [],
        
      },
      series: [
      //   {
      //     type: 'line',
      //     data: data,
      //     color: 'white'
      //   },
        {
           name:'yt',
         type: 'column',
         data: data,
         color: 'white'
       },
      ],
    };
  }
}
