import { Component, OnInit } from '@angular/core';
import { CovidService } from 'app/services/covid.service';
import { CasesTimeSeries, GrowthFactor } from 'app/layouts/modals/model';
import { SeriesOptionsType } from 'highcharts';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private _covid: CovidService ) { }

  timeLine: CasesTimeSeries[];

  growthFactor: GrowthFactor[];
  growthFactorSeriesOptions: SeriesOptionsType[];
  XRange: string[];

  recoveredVsDeathSeriesOptions: SeriesOptionsType[];
  ngOnInit(): void {
    this.loadGrowthFactor();
  }

  loadGrowthFactor() {
    this._covid.getDashBoardData().subscribe(response => {
      this.timeLine = response.cases_time_series;
      this.prepareGrowthFactor();
      this.loadRecoveredVsDeathGraph();
    })
  }
  prepareGrowthFactor() {
    this.growthFactor = this.timeLine.map((v, index) => {
      return {
        date: v.date,
        newCases: Number(v.dailyconfirmed),
        growthFactor: this.timeLine[index - 1] ? (Number(this.timeLine[index].totalconfirmed)/ Number(this.timeLine[index-1].totalconfirmed)) : 0
      }
    });
    this.prepareGrowthFactorGrapghData();
  }
  prepareGrowthFactorGrapghData() {
    this.growthFactorSeriesOptions = [
      {
        type:'line',
        data: this.growthFactor.map(v => {
          return (Math.round(v.growthFactor * 100) / 100);
        }),
        name:'Growth Factor'
      }
    ];

    this.XRange = this.growthFactor.map(v => {
      return v.date.replace(' ','').substring(0,5);
    })
  }

  loadRecoveredVsDeathGraph() {
    this.recoveredVsDeathSeriesOptions = [
      {
        type: 'line',
        name: 'Recovered',
        data:  this.timeLine.map(v => {
          return Number(v.totalrecovered)
        }),
        color : 'green'
      },
      {
        type: 'line',
        name: 'Death',
        data:  this.timeLine.map(v => {
          return Number(v.totaldeceased)
        }),
        color: 'red'
      }
    ]
  }
}
