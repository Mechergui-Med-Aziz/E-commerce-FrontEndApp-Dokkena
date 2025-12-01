import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,CommonModule,RouterModule,FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  resetPasswordForm = this.formBuilder.group({
    email: ['',[Validators.required, Validators.email]],
  });
  notLoggedIn=false;
  messageText="";
  showMessage=false;
  messageType="";
  constructor(private formBuilder: FormBuilder,private authService:AuthService,private router:Router) { }

  onSubmit(){
    this.authService.resetPassword(this.resetPasswordForm.value.email).subscribe((response: any)=>{
      console.log(response);
      if(response.success==true){
        this.messageText=response.message;
        this.messageType="success";
        this.showMessage=true;
        return;
      }
        this.messageText=response.message;
        this.messageType="error";
        this.showMessage=true;
        this.resetPasswordForm.get('email')?.reset();
      
      console.log(this.messageText);
    });
  }

  closeResetPasswordModal(){
    this.showMessage=false;
    if(this.messageType==="success"){
      this.router.navigate(['/login']);
    }
  }

}
