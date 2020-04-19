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

  growthFactorXRange: string[];
  recoveredVsDeathXRange: string[];
  recoveredVsDeathSeriesOptions: SeriesOptionsType[];

  isDaily = false;
  graphType = 'line'

  ngOnInit(): void {
   this.loadData()
  }

  loadData() {
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
        type: 'line',
        data: this.growthFactor.map(v => {
          return (Math.round(v.growthFactor * 100) / 100);
        }),
        name:'Growth Factor'
      },
      
      
    ];

    this.growthFactorXRange = this.growthFactor.map(v => {
      return v.date.replace(' ','').substring(0,5);
    })

    this.recoveredVsDeathXRange = this.growthFactorXRange;
    this.recoveredVsDeathXRange = this.isDaily ? this.recoveredVsDeathXRange.slice(this.recoveredVsDeathXRange.length - 14) : this.recoveredVsDeathXRange;
  }

  loadRecoveredVsDeathGraph() {
    this.recoveredVsDeathSeriesOptions = [
      {
        type: this.graphType === 'line' ? 'line' : 'column',
        name: 'Recovered',
        data:  this.timeLine.slice(this.isDaily ? this.timeLine.length - 14 : 0).map(v => {
          return Number(this.isDaily ? v.dailyrecovered : v.totalrecovered)
        }),
        color : 'green'
      },
      {
        type: this.graphType === 'line' ? 'line' : 'column',
        name: 'Death',
        data:  this.timeLine.slice(this.isDaily ? this.timeLine.length - 14 : 0).map(v => {
          return Number(this.isDaily ? v.dailydeceased : v.totaldeceased)
        }),
        color: 'red'
      }
    ]
  }

  onDailyChange(e) {
    if (e.checked) {
      this.isDaily = true;
      this.loadData();
    } else {
      this.isDaily = false;
      this.loadData();
    }
  }

  onGraphChange(e: any) {
    if (e.checked) {
      this.graphType = 'column';
      this.loadData();
    } else {
      this.graphType = this.graphType;
      this.loadData();
    }
  }
}
