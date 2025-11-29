import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { User } from 'src/app/classes/user';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-auth-signup',
  imports: [RouterModule, ɵInternalFormsSharedModule,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss']
})
export class AuthSignupComponent {

  showMessage=false;
  messageText="";
  messageType="";
  users:User[]=[];

  registerForm = this.formBuilder.group({
    id: [0],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    cin: ['', [Validators.required,  Validators.pattern('^[0-9]{8}$')]],
    phone:['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    adress: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validator: this.passwordMatchValidator });
  

  constructor(private formBuilder :FormBuilder,private authService:AuthService,private router:Router) { }

 
  onRegister(): void {

    if (this.registerForm.invalid) {
      this.messageText = 'Form invalide. Veuillez vérifier les champs.';
      this.messageType = 'error';
      this.showMessage = true;
      return;
    }
  
    const cin = Number(this.registerForm.value.cin);
    const email = this.registerForm.value.email!;
  
    this.authService.getUserByCinAndEmail(cin, email).subscribe({
  
      next: (user) => {
  
        if (user != null) {
          this.messageText = 'Un compte avec ce CIN et email existe déjà.';
          this.messageType = 'error';
          this.showMessage = true;
          return; 
        }
  
        
        let formData = { ...this.registerForm.value };
        formData.cin = Number(formData.cin);
        formData.phone = Number(formData.phone);
        delete formData.confirmPassword;
        delete formData.id;
  
        this.authService.registerUser(formData as User).subscribe({
          next: () => {
            this.messageText = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
            this.messageType = 'success';
            this.showMessage = true;
  
            
            this.authService.login(email, this.registerForm.value.password!).subscribe();
          },
          error: () => {
            this.messageText = "Erreur d'enregistrement d'utilisateur";
            this.messageType = 'error';
            this.showMessage = true;
          }
        });
  
      },
  
      error: () => {
        this.messageText = 'Erreur lors de la vérification du compte';
        this.messageType = 'error';
        this.showMessage = true;
      }
    });
  }
  
  
  
  

    passwordMatchValidator(form: any) {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;
    
      if (password !== confirmPassword) {
        form.get('confirmPassword')?.setErrors({ mismatch: true });
      } else {
        return null;
      }
    }
    


    closeRegisterModal(){
      if(this.messageType==='success'){
        this.registerForm.reset();
        this.messageText="";
        this.router.navigate(['/home']);
      }else{
        this.showMessage=false;
        this.messageText="";
      }
      this.showMessage=false;
    }

}
