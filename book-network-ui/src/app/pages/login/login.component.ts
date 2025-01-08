import {Component, inject} from '@angular/core';

import {FormsModule} from '@angular/forms';

import {Router} from '@angular/router';

import {NgFor, NgIf} from '@angular/common';
import {TokenService} from '../../services/token/token.service';
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { AuthenticationService } from '../../services/services/authentication.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,NgIf,NgFor ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  authRequest: AuthenticationRequest={
    email:'',
    password:''
    }
  errorMsg: Array<string> = [];


  router = inject(Router);
  authService = inject(AuthenticationService);
  tokenService=inject(TokenService);
 //author....
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  login() {
    this.errorMsg = []; // Clear previous error messages
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
      this.tokenService.token=res.access_Token as string;
        this.router.navigate(["books"]);
      },
      error: (err) => {
        // Check for validation errors from backend
        if (err.error && err.error.validationErrors) {
          console.log("Validation errors:", err);
          this.errorMsg = err.error.validationErrors;  // Set validation errors
        } else if (err.error && err.error.errorMsg) {
          console.log("Error message:", err);
          this.errorMsg.push(err.error.errorMsg);  // Set general error message
        } else {
          // Handle unexpected errors
          console.log("Unexpected error:", err);
          this.errorMsg.push(err.error.error);
        }
      }
    });
  }

  register() {
 this.router.navigate(['register']);
  }

}
