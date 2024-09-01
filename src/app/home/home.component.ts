import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SplashscreenService } from 'src/services/splashscreen.service';
import { NavbarComponent } from '../navbar/navbar.component';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
} from '@ionic/angular/standalone';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Motion, OrientationListenerEvent } from '@capacitor/motion';

import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { CapacitorFlash } from '@capgo/capacitor-flash';
import { PluginListenerHandle } from '@capacitor/core';
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
} from '@angular/fire/auth';
import { SplashScreen } from '@capacitor/splash-screen';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonFab,
    ReactiveFormsModule,
    NavbarComponent,
    IonFabButton,
    IonIcon,
    IonContent,
    IonFabList,
    IonFabButton,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  subscription: any;
  labelAlarma: string = 'Iniciar alarma';
  accelHandler?: PluginListenerHandle;
  orientacion?: OrientationListenerEvent;
  apagarAlarma: boolean = true;
  password: string = '';
  loginDesactivar: boolean = false;
  auth: Auth = inject(Auth);
  x?: any;
  y?: any;
  z?: any;
  audioD?: HTMLAudioElement;
  audioI?: HTMLAudioElement;
  audioV?: HTMLAudioElement;
  audioH?: HTMLAudioElement;
  constructor(
    private splashScreenService: SplashscreenService,
    private router: Router
  ) {
    this.audioD = new Audio();
    this.audioI = new Audio();
    this.audioV = new Audio();
    this.audioH = new Audio();
  }

  ngOnInit() {
    this.splashScreenService.show();
    setTimeout(() => {
      this.splashScreenService.hide(); // Replace with actual method name
    }, 2000);
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  iniciarAlarma() {
    if (this.labelAlarma == 'Iniciar alarma') {
      this.labelAlarma = 'Detener alarma';
      this.apagarAlarma = false;
      this.start();
    }
  }

  async start() {
    this.accelHandler = await Motion.addListener(
      'orientation',
      async (event) => {
        this.x = event.beta;
        this.y = event.gamma;
        this.z = event.alpha;

        //Al cambiar la posición, a izquierda o a derecha, emitirá un sonido distinto para cada lado.
        if (this.y > 50 && this.x >= -1 && this.x <= 50) {
          if (this.audioD) {
            this.audioD.src = '../../assets/derecho.mp3';
            await this.audioD?.play();
          }
        }
        //izquierda
        if (this.y <= -50 && this.x >= -1 && this.x <= 50) {
          if (this.audioI) {
            this.audioI.src = '../../assets/izquierdo.mp3';
            await this.audioI?.play();
          }
        }
        //Al ponerlo horizontal, vibrará (por 5 segundos) y al mismo tiempo emitirá otro sonido.
        if (this.x <= -1) {
          await Haptics.vibrate();

          if (this.audioH) {
            this.audioH.src = '../../assets/horizontal.mp3';
            await this.audioH?.play();
          }
        }
        //Al ponerlo vertical, se encenderá la luz (por 5 segundos) y al mismo tiempo emitirá un sonido.
        if (this.x >= 50) {
          if (this.audioV) {
            CapacitorFlash.switchOn({ intensity: 5 });
            CapacitorFlash.toggle;
            this.audioV.src = '../../assets/vertical.mp3';
            await this.audioV?.play();
          }
        }

        if (this.x < 50) {
          if (this.audioV) {
            CapacitorFlash.switchOff();
          }
        }
      }
    );
  }

  cerrarSesion() {
    SplashScreen.show({
      autoHide: true,
      showDuration: 1000,
    });
    this.loginDesactivar = false;
    this.labelAlarma = 'Iniciar alarma';
    this.apagarAlarma = true;
    if (this.accelHandler) {
      this.accelHandler.remove(); // Corrected: Call the 'remove()' method
    }
    this.auth.signOut();
    this.router.navigate(['/login']);
  }

  desactivarAlarma() {
    this.loginDesactivar = true;
  }

  ingresoPassword() {
    const user = this.auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user?.email!,
      this.password
    );
    reauthenticateWithCredential(user!, credential)
      .then(() => {
        this.loginDesactivar = false;
        this.labelAlarma = 'Iniciar alarma';
        this.apagarAlarma = true;
        if (this.accelHandler) {
          this.accelHandler.remove(); // Corrected: Call the 'remove()' method
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
