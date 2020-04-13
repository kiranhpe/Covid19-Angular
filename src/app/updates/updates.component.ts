import { Component, OnInit } from '@angular/core';
import { CovidService } from 'app/services/covid.service';
import { Update } from 'app/layouts/modals/model';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.css'],
})
export class UpdatesComponent implements OnInit {
  updates: Update[];
  isLoading = true;

  source = interval(1000 * 60 * 10);
  subscription: Subscription;
  constructor(private _covid: CovidService) {}

  ngOnInit(): void {
    this.loadUpdates();
    this.subscription = this.source.subscribe((res) => {
      this.loadUpdates();
    });
  }

  loadUpdates() {
    this._covid.getUpdates().subscribe((updates) => {
      this.updates = updates.slice((updates.length-1) - 10);
      this.isLoading = false; 
    });
  }

  frameTimeStamp(unix_timestamp: number): any {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    let hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = '0' + date.getMinutes();
    // Seconds part from the timestamp
    let seconds = '0' + date.getSeconds();

    // Will display time in 10:30:23 format
    let formattedTime =
      hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return date;
  }
}
