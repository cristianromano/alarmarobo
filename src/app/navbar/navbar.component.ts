import { Component, OnInit, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  auth: Auth = inject(Auth);
  nombre?: any;
  constructor(private route: Router) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log('No hay usuario');
      } else {
        this.nombre = user.email;
        console.log('aca esta el nombre', this.nombre);
      }
    });
  }

  logOut() {
    this.auth.signOut();
    SplashScreen.show({
      autoHide: true,
      showDuration: 1000,
    });
    this.route.navigate(['/login']);
  }
}
