export interface CasesTimeSeries {
  dailyconfirmed: string;
  dailydeceased: string;
  dailyrecovered: string;
  date: string;
  totalconfirmed: string;
  totaldeceased: string;
  totalrecovered: string;
}

export interface Statewise {
  active?: string | number;
  confirmed?: string | number;
  deaths?: string | number;
  deltaconfirmed?: string | number;
  deltadeaths?: string | number;
  deltarecovered?: string | number;
  lastupdatedtime?: string;
  recovered?: string | number;
  state?: string;
  statecode?: string;
}

export interface Tested {
  _ckd7g: string;
  source: string;
  testsconductedbyprivatelabs: string;
  totalindividualstested: string;
  totalpositivecases: string;
  totalsamplestested: string;
  updatetimestamp: string;
}

export interface CovidData {
  cases_time_series: CasesTimeSeries[];
  statewise: Statewise[];
  tested: Tested[];
}

export interface DistrictWise {
  state: string;
  districtData: DistrictData[];
}

export interface DistrictData {
  district: string;
  confirmed: number;
  active: number;
  recovered: number;
  deceased: number;
  lastupdatedtime: string;
  delta: Delta;
}

export interface Delta {
  confirmed: number;
  deceased: number;
  recovered: number;
}

export interface GrowthFactor {
  status?: string;
  stats: GFStats[];
}

export interface GFStats {
  date: string;
  newCases?: number;
  growthFactor: number;
}

export interface Update {
  update: string;
  timestamp: number;
}
export interface StatesDaily {
  an: string;
  ap: string;
  ar: string;
  as: string;
  br: string;
  ch: string;
  ct: string;
  date: string;
  dd: string;
  dl: string;
  dn: string;
  ga: string;
  gj: string;
  hp: string;
  hr: string;
  jh: string;
  jk: string;
  ka: string;
  kl: string;
  la: string;
  ld: string;
  mh: string;
  ml: string;
  mn: string;
  mp: string;
  mz: string;
  nl: string;
  or: string;
  pb: string;
  py: string;
  rj: string;
  sk: string;
  status: Status;
  tg: string;
  tn: string;
  tr: string;
  tt: string;
  up: string;
  ut: string;
  wb: string;
}
export interface StatesDailyStats {
  states_daily: StatesDaily[];
}
export enum Status {
  Confirmed = 'Confirmed',
  Deceased = 'Deceased',
  Recovered = 'Recovered',
}

export interface StatesDailyGraph {
  date?: string;
  status?: Status;
  count?: string;
}
