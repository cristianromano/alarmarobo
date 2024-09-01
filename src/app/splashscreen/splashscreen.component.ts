import { Component, OnInit } from '@angular/core';
import { SplashscreenService } from 'src/services/splashscreen.service';

@Component({
  selector: 'app-splashscreen',
  standalone: true,
  imports: [],
  templateUrl: './splashscreen.component.html',
  styleUrls: ['./splashscreen.component.scss'],
})
export class SplashscreenComponent implements OnInit {
  isVisible$: any;

  constructor(private splashscreenService: SplashscreenService) {}

  ngOnInit() {
    this.isVisible$ = this.splashscreenService.isVisible$;
  }
}
