import { Directive } from '@angular/core';

@Directive({
  selector: '[appStartRunningConnector]'
})
export class StartRunningConnectorDirective {

  isRunning = false;

  constructor() { }

}
