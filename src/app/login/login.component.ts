import { Component, OnInit, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { HomeComponent } from '../home/home.component';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
} from '@ionic/angular/standalone';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HomeComponent,
    IonFabButton,
    IonIcon,
    IonContent,
    IonFabList,
    IonFabButton,
    IonFab,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  item$?: Observable<any[]>;
  subscriptions: Subscription[] = [];
  private auth: Auth = inject(Auth);

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(private route: Router) {}

  ngOnInit() {}

  login() {
    signInWithEmailAndPassword(
      this.auth,
      this.form.get('email')?.value ?? '',
      this.form.get('password')?.value ?? ''
    )
      .then(async (userCredential) => {
        const user = userCredential.user;
        this.route.navigate(['/home']);
      })
      .catch((error) => {
        console.log(error.code);
        const err = this.firebaseErrors(error.code);
        Swal.fire({
          toast: true,
          icon: 'error',
          title: `${err} `,
          position: 'top-end',
        });
      });
  }
  firebaseErrors(error: string) {
    switch (error) {
      case 'auth/email-already-in-use':
        return 'Dirección de correo electrónico en uso.';
      case 'auth/weak-password':
        return 'contraseña debil ingrese una mas segura.';
      case 'auth/user-not-found':
        return 'Usuario no encontrado.';
      case 'auth/invalid-credential':
        return 'Contraseña incorrecta.';
      default:
        return 'Ocurrió un error. Por favor, inténtelo nuevamente más tarde.';
    }
  }

  irRegistro() {
    SplashScreen.show({
      autoHide: true,
      showDuration: 1000,
    });
    this.route.navigate(['/registro']);
  }

  loginRapidoUno() {
    this.form.get('email')?.setValue('usuario@usuario.com');
    this.form.get('password')?.setValue('333333');
  }

  loginRapidoDos() {
    this.form.get('email')?.setValue('tester@tester.com');
    this.form.get('password')?.setValue('555555');
  }

  loginRapidoTres() {
    this.form.get('email')?.setValue('anonimo@anonimo.com');
    this.form.get('password')?.setValue('444444');
  }
}
