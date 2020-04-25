import { Component, OnInit } from '@angular/core';
import { CovidService } from 'app/services/covid.service';
import {
  CasesTimeSeries,
  GrowthFactor,
  Statewise,
} from 'app/layouts/modals/model';
import { SeriesOptionsType } from 'highcharts';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {

  isLoading = true;
  timeLine: CasesTimeSeries[];
  states: Statewise[];
  growthFactor: GrowthFactor[]=[];
  growthFactorSeriesOptions: SeriesOptionsType[];

  growthFactorXRange: string[];
  recoveredVsDeathXRange: string[];
  recoveredVsDeathSeriesOptions: SeriesOptionsType[];

  totalStatesPieChartData: any[];
  totalCasesPieChartData: any[];

  predictionGraphSeriesOptions: SeriesOptionsType[];
  predictionXRange: string[]=[];

  isDaily = false;
  graphType: any = 'line';

  avgGF = 0;
  constructor(private _covid: CovidService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this._covid.getDashBoardData().subscribe((response) => {
      this.timeLine = response.cases_time_series;
      this.states = response.statewise;
      this.prepareGrowthFactorGrapghData();
      this.loadRecoveredVsDeathGraph();
      this.loadTotalPieChart();
    });
  }
  prepareGrowthFactor(timeSeries: CasesTimeSeries[], status: string):GrowthFactor {
    return {
      status: status,
      stats: timeSeries.map((v, index) => {
        return {
            date: v.date,
            newCases: Number(v.dailyconfirmed),
            growthFactor: this.timeLine[index - 1]
              ? Number(this.timeLine[index][status]) /
                Number(this.timeLine[index - 1][status])
              : 0,
          
        };
      })
    }  
  }
  prepareGrowthFactorGrapghData() {

    this.growthFactor.push(this.prepareGrowthFactor(this.timeLine, 'totalconfirmed'));
    this.growthFactor.push(this.prepareGrowthFactor(this.timeLine, 'totalrecovered'));
    this.growthFactorSeriesOptions = [
      {
        type: 'line',
        data: this.growthFactor[0].stats.map((v) => {
          return Math.round(v.growthFactor * 100) / 100;
        }),
        name: 'Growth Factor Confirmed',
      },
      {
        type: 'line',
        data: this.growthFactor[1].stats.map((v) => {
          return Math.round(v.growthFactor * 100) / 100;
        }),
        name: 'Growth Factor Recoverd',
      },
    ];

    this.growthFactorXRange = this.growthFactor[0].stats.map((v) => {
      return v.date.replace(' ', '').substring(0, 5);
    });

    this.recoveredVsDeathXRange = this.growthFactorXRange;
    this.recoveredVsDeathXRange = this.isDaily
      ? this.recoveredVsDeathXRange.slice(
          this.recoveredVsDeathXRange.length - 14
        )
      : this.recoveredVsDeathXRange;

    this.preparePreditinGrapgh();
  }

  loadRecoveredVsDeathGraph() {
    this.recoveredVsDeathSeriesOptions = [
      {
        type: this.graphType === 'line' ? 'line' : 'column',
        name: 'Recovered',
        data: this.timeLine
          .slice(this.isDaily ? this.timeLine.length - 14 : 0)
          .map((v) => {
            return Number(this.isDaily ? v.dailyrecovered : v.totalrecovered);
          }),
        color: 'green',
      },
      {
        type: this.graphType === 'line' ? 'line' : 'column',
        name: 'Death',
        data: this.timeLine
          .slice(this.isDaily ? this.timeLine.length - 14 : 0)
          .map((v) => {
            return Number(this.isDaily ? v.dailydeceased : v.totaldeceased);
          }),
        color: 'red',
      },
    ];
  }

  loadTotalPieChart() {
    this.totalStatesPieChartData = this.states.splice(1).map((v) => {
      return [v.statecode, Number(v.confirmed)];
    });
    this.totalCasesPieChartData = [
      ['Actv', Number(this.states[0].active)],
      ['Rcvd', Number(this.states[0].recovered)],
      ['Dead', Number(this.states[0].deaths)],
    ];
    this.isLoading = false;
  }

  preparePreditinGrapgh() {
    this.avgGF = this.calcAvgGF(this.growthFactor);
    let data: number[] = [];
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const d = new Date();
    var lastDate = new Date();

    for (let i = 0; i < 31; i++) {
      data.push(
        this.predict(
          Number(this.timeLine[this.timeLine.length - 1].totalconfirmed),
          this.avgGF,
          i
        )
      );
    }

    this.predictionXRange.push(d.getDate()+monthNames[d.getMonth()])
    for (let i = 0; i < 31; i++) {
      d.setDate(d.getDate() + 1);
      this.predictionXRange.push(
        d.getDate()+monthNames[d.getMonth()]
        )
    }
    this.predictionGraphSeriesOptions = [
      {
        type: this.graphType,
        data: data,
        name: 'Active Cases',
      }
    ];
  }

  calcAvgGF(data: GrowthFactor[]) {
    let total = 0;
    data[0].stats.forEach((gf) => {
      total = total + gf.growthFactor;
    });
    return total / data[0].stats.length;
  }

  predict(lastUpdated: number, gf: number, futureDays: number) {
    const po = Math.pow(gf, futureDays);
    return Math.round(lastUpdated * po * 1) / 1;
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
      this.graphType = 'line';
      this.loadData();
    }
  }
}
