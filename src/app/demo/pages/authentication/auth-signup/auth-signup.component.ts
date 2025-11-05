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
export class AuthSignupComponent implements OnInit{

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

  ngOnInit(): void {
      this.authService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
  })
  }
  onRegister(): void {
    if (this.registerForm.valid) {
      let exists=this.users.find(user=>user.cin==Number(this.registerForm.value.cin));
      console.log('Checking CIN existence:', exists);
      if(exists==null){
        let maxId=Math.max(...this.users.map(user=>Number(user.id!))) +1;
      let formData = {...this.registerForm.value} ;
      formData.cin = Number(formData.cin);
      formData.id = maxId.toString();
      formData.phone = Number(formData.phone);
      delete formData.confirmPassword;
      console.log('Registration Data:', formData);
      this.authService.registerUser(formData as User).subscribe(
        response => {
          this.messageText='Compte créer avec succès ! Vous pouvez maintenant vous connecter.';
          this.messageType='success';
          this.authService.login(this.registerForm.value.email!,this.registerForm.value.password!)
        },
        error => {
          this.messageText="Erreur d'enregistrement d'utilisateur";
          this.messageType='error';
        }
      );
    }
      else{
        console.log(exists)
      this.messageText='Un compte avec ce CIN existe déjà.';
      this.messageType='error';
      
    }}else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control && control.errors) {
          console.log(`❌ ${key} errors:`, control.errors);
        }
      })
      console.log(this.registerForm.errors);
        this.messageText='Form invalide. Veuillez vérifier les champs.';
        this.messageType='error';
        
      }
      this.showMessage=true;
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
