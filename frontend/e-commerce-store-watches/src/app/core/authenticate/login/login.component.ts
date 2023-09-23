import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email] as ((
      control: AbstractControl
    ) => ValidationErrors | null)[]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ] as ((control: AbstractControl) => ValidationErrors | null)[]),
  });
  faGoogle = faGoogle

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  }
}
