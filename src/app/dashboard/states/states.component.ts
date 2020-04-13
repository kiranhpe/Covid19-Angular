import { Component, OnInit } from '@angular/core';
import { Statewise, CasesTimeSeries, DistrictData } from 'app/layouts/modals/model';
import { interval, Subscription } from 'rxjs';
import { CovidService } from 'app/services/covid.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css']
})
export class StatesComponent implements OnInit {
  state: Statewise;
  timeSeriesStates: CasesTimeSeries[];
  districts: DistrictData[];
  isLoading = true;
  
  isDataAvailable = true;
  source = interval(1000 * 60 * 10);
  subscription: Subscription;

  constructor(
  private _covid: CovidService,
  private activatedRoute: ActivatedRoute,
  private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {       
      this.loadStateData(params['state']);    
      this.loadDistrictData(params['state']);
      this.subscription = this.source.subscribe((res) => {
        this.loadDistrictData(params['state']);
      });
   });

  }

  loadDistrictData(stateName: string, isForceRefresh?: boolean) {
    if(isForceRefresh) {
      this.isLoading = true
    }
    this._covid.getDistrictData().subscribe((response) => {
      this.isDataAvailable = response.find((v) => v.state === stateName)
        ? true
        : false;
      if (this.isDataAvailable) {
        this.districts = 
          response.find((v) => v.state === stateName).districtData;
        this.isLoading = false;
      }
    });
  }

  loadStateData(stateName: string) {
    this._covid.getDashBoardData().subscribe((response) => {
      this.state = response.statewise.find(v => v.state === stateName)
    });
  }
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
