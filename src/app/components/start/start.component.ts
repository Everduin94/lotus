import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClockService } from 'src/app/services/clock.service';
import { ContentfulService } from 'src/app/services/contentful.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, filter, take, tap } from 'rxjs/operators';
import { StartRunningConnectorDirective } from 'src/app/directives/start-running-connector.directive';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit, OnDestroy {
 
  form: FormGroup;
  drills$: Observable<any> = this.content.getDrills();
  selectedDrill$: Observable<any>;
  clockSub = new Subscription();

  constructor(public cs: ClockService,
     public content: ContentfulService,
     private fb: FormBuilder,
     public connector: StartRunningConnectorDirective) { }

  ngOnInit() {

    const sub = this.cs.clockChangeEvent$.pipe(
      take(1),
      tap(v => {
        const drill = v.drill ? v.drill.name : {};
        const minutes = Math.floor(v.time / 60);
        const seconds = v.time % 60;
        this.form = this.fb.group({
          minInterval: v.min,
          maxInterval: v.max,
          minutes: minutes,
          seconds: seconds,
          drill: drill
        });
      })
    ).subscribe();
    this.clockSub.add(sub);
    

    this.selectedDrill$ = this.form.valueChanges.pipe(
      filter(v => v.drill),
      map(v => this.content.getSelectedDrill(v.drill))
    );
  }

  onSubmit() {
    const formValues = this.form.value;

    const update = {
      isRunning: false,
      min: Number.parseInt(formValues.minInterval),
      max: Number.parseInt(formValues.maxInterval),
      time: (Number.parseInt(formValues.minutes) * 60) + Number.parseInt(formValues.seconds),
      drill: this.content.getSelectedDrill(this.form.value.drill)
    }

    this.connector.isRunning = true;
    this.cs.clockChangeEvent.next(update);
  }

  ngOnDestroy(): void {
    this.clockSub.unsubscribe();
  }

}
