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
    active: string;
    confirmed: string;
    deaths: string;
    deltaconfirmed: string;
    deltadeaths: string;
    deltarecovered: string;
    lastupdatedtime: string;
    recovered: string;
    state: string;
    statecode: string;
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
      cases_time_series : CasesTimeSeries[];
      statewise: Statewise[];
      tested: Tested[];
  }
  
  export interface DistrictWise {
    state:        string;
    districtData: DistrictData[];
  }
  
  export interface DistrictData {
    district:        string;
    confirmed:       number;
    lastupdatedtime: string;
    delta:           Delta;
  }
  
  export interface Delta {
    confirmed: number;
  }
  
  export interface GrowthFactor {
      date: string;
      newCases?: number;
      growthFactor: number;
  }

  export interface Update {
    update: string;
    timestamp: number;
  }
  