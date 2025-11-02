import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/user';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule,CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

  updated=false;
  user = {
    id:0,
    firstName: '',
    lastName: '',
    cin: 0,
    phone: 0,
    email: '',
    adress: ''
  };

  newPassword = '';

  constructor(private authService: AuthService, private router:Router) {
    const id = Number(localStorage.getItem("id"));
    
    this.authService.getUserById(id).subscribe((data: User) => {
      this.user = data;
    });
  }
  
  

  updateProfile(){
    let newUser={...this.user,password:this.newPassword} as User; 
    this.authService.updateUser(Number(this.user.id),newUser).subscribe(response=>{
      this.updated=true;
    });

  }

  closeUpdateModal(){
    this.updated=false;
    this.router.navigate(['/home']);
  }
}
