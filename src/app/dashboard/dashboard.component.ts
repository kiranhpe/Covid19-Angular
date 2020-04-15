import { Component, OnInit, HostListener } from '@angular/core';
import * as Chartist from 'chartist';
import { Statewise, CasesTimeSeries } from 'app/layouts/modals/model';
import { interval, Subscription } from 'rxjs';
import { CovidService } from 'app/services/covid.service';
import { Router } from '@angular/router';
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
  charts = [
    {
      containerId: '#confirmedCases',
      ration: 0,
    },
    {
      containerId: '#recoveredCases',
      ration: 0,
    },
    {
      containerId: '#deathCases',
      ration: 0,
    },
  ];

  changeConfirmed = 0;
  changeRecovered = 0;
  changeDeath = 0;

  source = interval(1000 * 60 * 10);
  subscription: Subscription;

  constructor(
    private _covid: CovidService,
    private router: Router // private spinner: NgxSpinnerService
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
    this.charts.forEach((chart) => {
      let series: number[];

      if (!this.isDaily) {
        if (chart.containerId === '#confirmedCases') {
          series = this.timeSeriesStates.map((v) => {
            return Number(v.totalconfirmed);
          });
        } else if (chart.containerId === '#recoveredCases') {
          series = this.timeSeriesStates.map((v) => {
            return Number(v.totalrecovered);
          });
        } else if (chart.containerId === '#deathCases') {
          series = this.timeSeriesStates.map((v) => {
            return Number(v.totaldeceased);
          });
        }
        this.loadChartData(
          chart.containerId,
          series,
          false,
          14,
          this.isUniform
        );
      } else {
        if (chart.containerId === '#confirmedCases') {
          series = this.timeSeriesStates.map((v) => {
            return Number(v.dailyconfirmed);
          });
        } else if (chart.containerId === '#recoveredCases') {
          series = this.timeSeriesStates.map((v) => {
            return Number(v.dailyrecovered);
          });
        } else if (chart.containerId === '#deathCases') {
          series = this.timeSeriesStates.map((v) => {
            return Number(v.dailydeceased);
          });
        }
        this.loadChartData(
          chart.containerId,
          series,
          this.isDaily,
          14,
          this.isUniform
        );
      }
    });
  }
  loadChartData(
    containerId: string,
    seriesData: number[],
    isDaily: boolean,
    lastDays?: number,
    isUniform?: boolean
  ) {
    const change =
      seriesData[seriesData.length - 1] - seriesData[seriesData.length - 2];

    const high: number = isUniform
      ? Number(
          this.timeSeriesStates[this.timeSeriesStates.length - 1].totalconfirmed
        )
      : seriesData[seriesData.length - 1];

    if (isDaily) {
      seriesData = seriesData.splice(seriesData.length - lastDays);
    }
    if (containerId === '#confirmedCases') {
      this.changeConfirmed = change;
    } else if (containerId === '#recoveredCases') {
      this.changeRecovered = change;
    } else if (containerId === '#deathCases') {
      this.changeDeath = change;
    }
    const dataSeries: any = {
      labels: [],
      series: [seriesData],
    };

    const options: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0,
      }),
      low: 0,
      showPoint: false,
      axisX: {
        showLabel: false,
        showGrid: true,
        scaleMinSpace: 20,
      },
      axisY: {
        showLabel: true,
        showGrid: false,
        labelInterpolationFnc: function (value) {
          if (value < 1000) {
            return value;
          } else {
            return value / 1000 + 'k';
          }
        },
        high: high,
      },
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    };

    if (isDaily) {
      const Chart = new Chartist.Bar(containerId, dataSeries, options);

      this.startAnimationForBarChart(Chart);
    } else {
      const Chart = new Chartist.Line(containerId, dataSeries, options);

      this.startAnimationForLineChart(Chart);
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

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path
              .clone()
              .scale(1, 0)
              .translate(0, data.chartRect.height())
              .stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint,
          },
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease',
          },
        });
      }
    });

    seq = 0;
  }
  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease',
          },
        });
      }
    });

    seq2 = 0;
  }
}
