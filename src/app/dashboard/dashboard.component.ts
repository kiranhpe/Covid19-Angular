import { Component, OnInit, HostListener } from '@angular/core';
import {
  Statewise,
  CasesTimeSeries,
  DistrictData,
  StatesDaily,
  Status,
  StatesDailyStats,
  StatesDailyGraph,
} from 'app/layouts/modals/model';
import { interval, Subscription } from 'rxjs';
import { CovidService } from 'app/services/covid.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  covid: Statewise;
  timeSeriesStates: CasesTimeSeries[];
  stateName: string;
  states: Statewise[];
  districts: DistrictData[];
  statesDaily: StatesDailyStats;
  statesGraphType = 'line';
  filteredState: StatesDailyGraph[];
  isLoading = true;
  isDaily = false;
  isUniform = false;

  sortedStates: Statewise[];
  sortedDistricts: DistrictData[];
  seriesValues: any;
  yMinMax: [number, number] = [null, null];

  changeConfirmed = 0;
  changeRecovered = 0;
  changeDeath = 0;

  source = interval(1000 * 60 * 10);
  subscription: Subscription;

  constructor(
    private _covid: CovidService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.stateName = params['state'];
    });
    this.loadData();
    this.subscription = this.source.subscribe((res) => {
      this.loadData();
    });
  }

  loadData(isForceRefresh?: boolean) {
    if (isForceRefresh) {
      this.isLoading = true;
    }
    if (this.stateName) {
      this._covid.getDashBoardData().subscribe((response) => {
        this.covid = response.statewise.find((v) => v.state === this.stateName);
        this.isLoading = false;
      });
      this._covid.getDistrictData().subscribe((response) => {
        this.districts = response.find(
          (v) => v.state === this.stateName
        ).districtData;
        this.sortedDistricts = this.districts.slice();
        this.isLoading = false;
      });
      this._covid.getStatesDaily().subscribe((response) => {
        this.statesDaily = response;
        this.filteredState = this.statesDaily.states_daily.map((v) => {
          return {
            date: v.date,
            count: v[this.covid.statecode.toLowerCase()],
            status: v.status,
          };
        });
        this.prepareStateCharts();
      });
    } else {
      this._covid.getDashBoardData().subscribe((response) => {
        this.covid = response.statewise[0];
        this.timeSeriesStates = response.cases_time_series;
        this.states = response.statewise.slice(1).map((v) => {
          return {
            active: Number(v.active),
            confirmed: Number(v.confirmed),
            deaths: Number(v.deaths),
            deltaconfirmed: Number(v.deltaconfirmed),
            deltadeaths: Number(v.deltadeaths),
            deltarecovered: Number(v.deltarecovered),
            lastupdatedtime: v.lastupdatedtime,
            recovered: Number(v.recovered),
            state: v.state,
            statecode: v.statecode,
          };
        });
        this.sortedStates = this.states.slice();
        this.isLoading = false;
        this.prepareCountryCharts();
      });
    }
  }

  prepareCountryCharts() {
    this.changeConfirmed =
      Number(
        this.timeSeriesStates[this.timeSeriesStates.length - 1].totalconfirmed
      ) -
      Number(
        this.timeSeriesStates[this.timeSeriesStates.length - 2].totalconfirmed
      );

    this.changeRecovered =
      Number(
        this.timeSeriesStates[this.timeSeriesStates.length - 1].totalrecovered
      ) -
      Number(
        this.timeSeriesStates[this.timeSeriesStates.length - 2].totalrecovered
      );

    this.changeDeath =
      Number(
        this.timeSeriesStates[this.timeSeriesStates.length - 1].totaldeceased
      ) -
      Number(
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
            return v.date.substring(0, 6).replace(' ', '').replace('-', '');
          }),
        },
        active: {
          series: {
            type: 'line',
            data: this.timeSeriesStates.map((v) => {
              return (Number(v.totalconfirmed) - (Number(v.totalrecovered) + Number(v.totaldeceased)));
            }),
            name: 'Active',
          },
          xAxisCatogories: this.timeSeriesStates.map((v) => {
            return v.date.substring(0, 6).replace(' ', '').replace('-', '');
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
            return v.date.substring(0, 6).replace(' ', '').replace('-', '');
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
            return v.date.substring(0, 6).replace(' ', '').replace('-', '');
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
              return v.date.substring(0, 6).replace(' ', '').replace('-', '');
            }),
        },
        active: {
          series: {
            type: 'column',
            data: this.timeSeriesStates
              .slice(this.timeSeriesStates.length - 14)
              .map((v) => {
                return (Number(v.dailyconfirmed) - (Number(v.dailydeceased) + Number(v.dailyrecovered)));
              }),
            name: 'Confirmed',
          },
          xAxisCatogories: this.timeSeriesStates
            .slice(this.timeSeriesStates.length - 14)
            .map((v) => {
              return v.date.substring(0, 6).replace(' ', '').replace('-', '');
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
              return v.date.substring(0, 6).replace(' ', '').replace('-', '');
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
              return v.date.substring(0, 6).replace(' ', '').replace('-', '');
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

  prepareStateCharts() {
    const confirmedCases = this.filteredState.filter((v) => {
      return v.status === Status.Confirmed;
    });
    const recoveredCases = this.filteredState.filter((v) => {
      return v.status === Status.Recovered;
    });
    const deathCases = this.filteredState.filter((v) => {
      return v.status === Status.Deceased;
    });

    this.changeConfirmed =
      Number(confirmedCases[confirmedCases.length - 1].count) -
      Number(confirmedCases[confirmedCases.length - 2].count);

    this.changeRecovered =
      Number(recoveredCases[recoveredCases.length - 1].count) -
      Number(recoveredCases[recoveredCases.length - 2].count);

    this.changeDeath =
      Number(deathCases[deathCases.length - 1].count) -
      Number(deathCases[deathCases.length - 2].count);
    if (!this.isDaily) {
      this.seriesValues = {
        confirmed: {
          series: {
            type: this.statesGraphType,
            data: confirmedCases.map((v) => {
              return Number(v.count);
            }),
            name: 'Confirmed',
          },
          xAxisCatogories: confirmedCases.map((v) => {
            return v.date.substring(0, 6).replace(' ', '').replace('-', '');
          }),
        },
        active: {
          series: {
            type: this.statesGraphType,
            data: confirmedCases.map((v, index) => {
              return (Number(v.count) - (Number(recoveredCases[index].count) + Number(deathCases[index].count)));
            }),
            name: 'Active',
          },
          xAxisCatogories: confirmedCases.map((v) => {
            return v.date.substring(0, 6).replace(' ', '').replace('-', '');
          }),
        },
        recovered: {
          series: {
            type: this.statesGraphType,
            data: recoveredCases.map((v) => {
              return Number(v.count);
            }),
            name: 'Recovered',
          },
          xAxisCatogories: recoveredCases.map((v) => {
            return v.date.substring(0, 6).replace(' ', '').replace('-', '');
          }),
        },
        death: {
          series: {
            type: this.statesGraphType,
            data: deathCases.map((v) => {
              return Number(v.count);
            }),
            name: 'Death',
          },
          xAxisCatogories: deathCases.map((v) => {
            return v.date.substring(0, 6).replace(' ', '').replace('-', '');
          }),
        },
      };
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
              return v.date.substring(0, 6).replace(' ', '').replace('-', '');
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
              return v.date.substring(0, 6).replace(' ', '').replace('-', '');
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
              return v.date.substring(0, 6).replace(' ', '').replace('-', '');
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
    this.router.navigateByUrl('dashboard/' + state.state);
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
  onUniformChange(e: any) {
    if (e.checked) {
      this.isUniform = true;
      this.loadData();
    } else {
      this.isUniform = false;
      this.loadData();
    }
  }
  onGraphChange(e: any) {
    if (e.checked) {
      this.statesGraphType = 'column';
      this.loadData();
    } else {
      this.statesGraphType = 'line';
      this.loadData();
    }
  }

  sortStatesData(sort: Sort) {
    const data = this.states.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedStates = data;
      return;
    }

    this.sortedStates = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'state':
          return this.compare(a.state, b.state, isAsc);
        case 'confirmed':
          return this.compare(a.confirmed, b.confirmed, isAsc);
        case 'recovered':
          return this.compare(a.recovered, b.recovered, isAsc);
        case 'active':
          return this.compare(a.active, b.active, isAsc);
        case 'deaths':
          return this.compare(a.deaths, b.deaths, isAsc);
        default:
          return 0;
      }
    });
  }

  sortDistrictsData(sort: Sort) {
    const data = this.districts.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedDistricts = data;
      return;
    }

    this.sortedDistricts = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'district':
          return this.compare(a.district, b.district, isAsc);
        case 'confirmed':
          return this.compare(a.confirmed, b.confirmed, isAsc);
        case 'recovered':
          return this.compare(a.recovered, b.recovered, isAsc);
        case 'active':
          return this.compare(a.active, b.active, isAsc);
        case 'deaths':
          return this.compare(a.deaths, b.deaths, isAsc);
        default:
          return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.loadData();
  }
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getPercentage(total: number, fraction: number)
  {
    return Math.round((fraction / total) * 10000) / 100
  }
}
