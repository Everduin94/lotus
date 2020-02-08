import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ClockService } from 'src/app/services/clock.service';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { StartRunningConnectorDirective } from 'src/app/directives/start-running-connector.directive';

@Component({
  selector: 'app-running',
  templateUrl: './running.component.html',
  styleUrls: ['./running.component.css']
})
export class RunningComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    this.cs.startEvent.next('start');
  }

  faPlay = faPlay;
  faPause = faPause;
  faSquare = faSquare;

  constructor(public cs: ClockService,
    public connector: StartRunningConnectorDirective) { }

  ngOnInit() {
    
  }

  resumeTimer() {
    this.cs.resumeEvent.next('resume');
  }

  pauseTimer() {
    this.cs.pauseEvent.next('pause');
  }

  stopTimer() {
    this.cs.stopEvent.next('stop');
    this.connector.isRunning = false;
  }

}
