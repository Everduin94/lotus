import { Injectable } from '@angular/core';
import { Subject, merge, interval, BehaviorSubject, of, Observable } from 'rxjs';
import { withLatestFrom, tap, startWith, map, switchMap, scan, mergeMap, shareReplay } from 'rxjs/operators';
import { SynthesisService } from './synthesis.service';

@Injectable({
  providedIn: 'root'
})
export class ClockService {


  intialClockState = {
    isRunning: false,
    time: 120,
    min: 13,
    max: 18,
    drill: {}
  }

  startEvent = new Subject();
  resumeEvent = new Subject();
  pauseEvent = new Subject();
  stopEvent = new Subject();
  stopEvent$ = this.stopEvent.asObservable().pipe(
    switchMap(() => this.clockChangeEvent$)
  );
  clockChangeEvent = new BehaviorSubject(this.intialClockState);
  clockChangeEvent$: Observable<any> = this.clockChangeEvent.asObservable();

  state$ = merge(this.startEvent, this.resumeEvent, this.pauseEvent, this.stopEvent$, this.clockChangeEvent$).pipe(
    switchMap(event => {
      if (event === 'start' || event === 'resume') return interval(1000).pipe(map(v => v + 1));
      if (event === 'pause') return of();
      else return of({ ...event }); // ClockState
    }),
    scan((complete, partial) => {
      if (partial.time) {
        complete.isRunning = false;
        return partial;
      }

      if (complete.time === 0) {
        this.s.updateMessage('Complete!');
        this.s.speak();
        complete.isRunning = false;
        this.pauseEvent.next('pause');
      } else {
        complete.isRunning = true;
        --complete.time;
      }

      console.log(complete);
      return complete;
    }),
    shareReplay(1)
  )


  utterance$ = this.state$.pipe(
    scan((x, i: any) => {
      // console.log(i);

      if (x.index === 0) {
        x.magicNumber = this.randomIntFromInterval(i.min, i.max);
      }

      if (x.index === x.magicNumber) {
        const arrayLength = i.drill.techniques.length;
        const randValue = Math.floor((Math.random() * arrayLength))
        const message = i.drill.techniques[randValue];
        this.s.updateMessage(message);
        this.s.speak();


        return { index: 0, magicNumber: 0 }
      }

      if (i.isRunning) {
        ++x.index;
        return x;
      } else {
        return { index: 0, magicNumber: 0 };
      }

    }, { index: 0, magicNumber: 0 })
  )

  constructor(private s: SynthesisService) { }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

}


