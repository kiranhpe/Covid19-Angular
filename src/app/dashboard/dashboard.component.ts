import { Component, OnInit, HostListener } from '@angular/core';
import * as Chartist from 'chartist';
import { Statewise, CasesTimeSeries } from 'app/layouts/modals/model';
import { interval, Subscription } from 'rxjs';
import { CovidService } from 'app/services/covid.service';
import { Router } from '@angular/router';
import { SeriesOptionsType } from 'highcharts';
// import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  country: Statewise;
  timeSeriesStates: CasesTimeSeries[];
  states: Statewise[];
  isLoading = true;
  isDaily = false;
  isUniform = false;

  seriesValues: any;
  yMinMax: [number, number] = [null, null];

  changeConfirmed = 0;
  changeRecovered = 0;
  changeDeath = 0;

  source = interval(1000 * 60 * 10);
  subscription: Subscription;

  constructor(
    private _covid: CovidService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
    this.subscription = this.source.subscribe((res) => {
      this.loadData();
    });
  }

  loadData(isForceRefresh?: boolean) {
    if (isForceRefresh) {
      this.isLoading = true;
    }
    this._covid.getDashBoardData().subscribe((response) => {
      this.country = response.statewise[0];
      this.timeSeriesStates = response.cases_time_series;
      this.states = response.statewise.slice(1);
      this.isLoading = false;
      this.loadCharts();
    });
  }

  loadCharts() {
    this.changeConfirmed = Number(
      this.timeSeriesStates[this.timeSeriesStates.length - 1].totalconfirmed
    ) - Number(
      this.timeSeriesStates[this.timeSeriesStates.length - 2].totalconfirmed
    );

    this.changeRecovered = Number(
      this.timeSeriesStates[this.timeSeriesStates.length - 1].totalrecovered
    ) - Number(
      this.timeSeriesStates[this.timeSeriesStates.length - 2].totalrecovered
    );

    this.changeDeath = Number(
      this.timeSeriesStates[this.timeSeriesStates.length - 1].totaldeceased
    ) - Number(
      this.timeSeriesStates[this.timeSeriesStates.length - 2].totaldeceased
    );
    if (!this.isDaily) {
      this.seriesValues = {
        confirmed: {
          series: {
            type: 'line',
            data: this.timeSeriesStates.map((v) => {
              return Number(v.totalconfirmed);
            }),
            name: 'Confirmed',
          },
          xAxisCatogories: this.timeSeriesStates.map((v) => {
            return v.date.substring(1, 6);
          }),
        },
        recovered: {
          series: {
            type: 'line',
            data: this.timeSeriesStates.map((v) => {
              return Number(v.totalrecovered);
            }),
            name: 'Recovered',
          },
          xAxisCatogories: this.timeSeriesStates.map((v) => {
            return v.date.substring(1, 6);
          }),
        },
        death: {
          series: {
            type: 'line',
            data: this.timeSeriesStates.map((v) => {
              return Number(v.totaldeceased);
            }),
            name: 'Death',
          },
          xAxisCatogories: this.timeSeriesStates.map((v) => {
            return v.date.substring(1, 6);
          }),
        },
      };
      if (this.isUniform) {
        this.yMinMax[1] = Number(
          this.timeSeriesStates[this.timeSeriesStates.length - 1].totalconfirmed
        );
      } else {
        this.yMinMax[1] = null;
      }
    } else {
      this.seriesValues = this.seriesValues = {
        confirmed: {
          series: {
            type: 'column',
            data: this.timeSeriesStates
              .slice(this.timeSeriesStates.length - 14)
              .map((v) => {
                return Number(v.dailyconfirmed);
              }),
            name: 'Confirmed',
          },
          xAxisCatogories: this.timeSeriesStates
            .slice(this.timeSeriesStates.length - 14)
            .map((v) => {
              return v.date.substring(1, 6);
            }),
        },
        recovered: {
          series: {
            type: 'column',
            data: this.timeSeriesStates
              .slice(this.timeSeriesStates.length - 14)
              .map((v) => {
                return Number(v.dailyrecovered);
              }),
            name: 'Recovered',
          },
          xAxisCatogories: this.timeSeriesStates
            .slice(this.timeSeriesStates.length - 14)
            .map((v) => {
              return v.date.substring(1, 6);
            }),
        },
        death: {
          series: {
            type: 'column',
            data: this.timeSeriesStates
              .slice(this.timeSeriesStates.length - 14)
              .map((v) => {
                return Number(v.dailydeceased);
              }),
            name: 'Death',
          },
          xAxisCatogories: this.timeSeriesStates
            .slice(this.timeSeriesStates.length - 14)
            .map((v) => {
              return v.date.substring(1, 6);
            }),
        },
      };

      if (this.isUniform) {
        this.yMinMax[1] = Number(
          this.timeSeriesStates[this.timeSeriesStates.length - 1].dailyconfirmed
        );
      } else {
        this.yMinMax[1] = null;
      }
    }
  }
  gotoState(state: Statewise) {
    this.router.navigateByUrl('dashboard/states/' + state.state);
  }

  onDailyChange(e) {
    if (e.checked) {
      this.isDaily = true;
      this.loadCharts();
    } else {
      this.isDaily = false;
      this.loadCharts();
    }
  }
  onUniformChange(e: any) {
    if (e.checked) {
      this.isUniform = true;
      this.loadCharts();
    } else {
      this.isUniform = false;
      this.loadCharts();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.loadData();
  }
}
