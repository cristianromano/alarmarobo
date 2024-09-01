import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SplashscreenService } from 'src/services/splashscreen.service';
import { SplashscreenComponent } from './splashscreen/splashscreen.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, SplashscreenComponent, CommonModule],
})
export class AppComponent {
  subscription: any;

  constructor(public splashScreenService: SplashscreenService) {}

  ngOnInit(): void {
    this.subscription = this.splashScreenService.isVisible$.subscribe(
      (isVisible) => {}
    );
    setTimeout(() => {
      this.splashScreenService.hide(); // Replace with actual method name
    }, 6000);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
