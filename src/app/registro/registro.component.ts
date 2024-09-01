import { Component, OnInit, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(private route: Router) {}

  ngOnInit() {}

  registro() {
    const email = this.form.get('email')?.value || '';
    const password = this.form.get('password')?.value || '';

    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        addDoc(collection(this.firestore, 'users'), {
          email: this.form.get('email')?.value,
          fecha: new Date(),
        }).then(async (docRef) => {
          Swal.fire({
            toast: true,
            icon: 'success',
            title: `Usuario:${
              this.form.get('email')?.value
            } creado con exito! `,
            position: 'top-end',
          });
          this.route.navigate(['/home']);
        });
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
}
