import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { SeoService } from 'src/app/services/seo-service';
import { AnalyticsService } from 'src/app/services/analytics-service';

@Component({
  selector: 'app-auth-signin',
  imports: [RouterModule, ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private seoService = inject(SeoService);
  private analyticsService = inject(AnalyticsService);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  notLoggedIn = false;

  ngOnInit() {
    this.seoService.update({
      title: 'Connexion à votre compte | Dokkena Tunisie',
      description: 'Connectez-vous à votre espace client Dokkena pour suivre vos commandes et gérer vos adresses.',
      path: '/login',
      noindex: true
    });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).then((user) => {
      if (user) {
        this.analyticsService.trackLogin('email');
        this.router.navigate(['/']);
      } else {
        this.notLoggedIn = true;
        this.loginForm.reset();
      }
    });
  }

  closeLoginModal(){
    this.notLoggedIn=false;
  }
}
