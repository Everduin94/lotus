import { Component } from '@angular/core';
import { StartRunningConnectorDirective } from './directives/start-running-connector.directive';
import { ClockService } from './services/clock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [StartRunningConnectorDirective]
})
export class AppComponent {
  title = 'countdown-rxjs';

  constructor(public connector: StartRunningConnectorDirective) {}
}
