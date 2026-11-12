import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/user';
import { AuthService } from 'src/app/services/auth-service';
import { SeoService } from 'src/app/services/seo-service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);
  private router = inject(Router);
  private seoService = inject(SeoService);

  updated = false;
  user = {
    id: '',
    firstName: '',
    lastName: '',
    cin: 0,
    phone: 0,
    email: '',
    adress: ''
  };

  newPassword = '';

  ngOnInit() {
    this.seoService.update({
      title: 'Mon Profil | Dokkena',
      description: 'Gérez vos informations personnelles et vos commandes sur Dokkena Tunisie.',
      path: '/profile',
      noindex: true
    });

    if (isPlatformBrowser(this.platformId)) {
      const id = Number(localStorage.getItem('id'));
      if (id) {
        this.authService.getUserById(id).subscribe((data: User) => {
          this.user = data;
        });
      }
    }
  }
  
  

  updateProfile(){
    let newUser={...this.user} as User; 
    if(this.newPassword.trim()!==''){
      newUser.password=this.newPassword;
    }
    newUser.cin=Number(newUser.cin);
    newUser.phone=Number(newUser.phone);
    this.authService.updateUser(Number(this.user.id),newUser).subscribe(response=>{
      this.updated=true;
    });

  }

  closeUpdateModal(){
    this.updated=false;
    this.router.navigate(['/home']);
  }
}
