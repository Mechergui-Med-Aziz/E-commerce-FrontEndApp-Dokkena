import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-auth-signin',
  imports: [RouterModule, ɵInternalFormsSharedModule,ReactiveFormsModule,CommonModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent {

  loginForm = this.formBuilder.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required,Validators.minLength(6)]]
  });
  notLoggedIn=false;
  constructor(private formBuilder: FormBuilder,private authService:AuthService,private router:Router) { }

  onSubmit(){
    this.authService.login(this.loginForm.value.email,this.loginForm.value.password).then(user=>{
      console.log(user);
      if(user){
        this.router.navigate(['/home']);
      }else{
        this.notLoggedIn=true;
        this.loginForm.reset();
      }
    });
  }

  closeLoginModal(){
    this.notLoggedIn=false;
  }
}
