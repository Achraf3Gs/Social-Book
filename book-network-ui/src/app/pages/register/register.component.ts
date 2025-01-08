import {Component, inject} from '@angular/core';

import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import { RegistrationRequest } from '../../services/models/registration-request';
import { AuthenticationService } from '../../services/services/authentication.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {


  registerRequest: RegistrationRequest={
    dateOfBirth: '',
    email: '',
    firstname: '',
    lastname: '',
    password: ''
  }
  errorMsg: Array<string> = [];

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  router = inject(Router);
  authService = inject(AuthenticationService);


register(){

  this.errorMsg = []; // Clear previous error messages
  this.authService.register({
    body: this.registerRequest
  }).subscribe({
    next: () => {

      this.router.navigate(["activate-account"]);
    },
    error: (err) => {
      // Check for validation errors from backend
      if (err.error && err.error.validationErrors) {
        console.log("Validation errors:", err);
        this.errorMsg = err.error.validationErrors;  // Set validation errors
      } else if (err.error && err.error.error) {
        const match = err.error.error.match(/Key \(email\)=\((.*?)\)/); // Extract the email using regex
        if (match && match[1]) {
          this.errorMsg.push(`This email: " ${match[1]} " already exists.`); // Format the message
        } else {
          this.errorMsg.push("An unexpected error occurred. Please try again later."); // Default error message
        }
      }
    }
  });
}

login(){
  this.router.navigate(['login']);
}



}
