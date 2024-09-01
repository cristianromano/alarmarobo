import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SplashscreenService {
  private isVisible = new BehaviorSubject<boolean>(true);
  isVisible$: Observable<boolean> = this.isVisible.asObservable();

  show() {
    this.isVisible.next(true);
  }

  hide() {
    this.isVisible.next(false);
  }

  constructor() {}
}
