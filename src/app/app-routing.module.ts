import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { Guest } from './theme/layout/guest/guest';
import { NavElements } from './theme/layout/nav-elements/nav-elements';
import { profileGuardGuard } from './guards/profile-guard-guard';

const routes: Routes = [
  {
    path: '',
    component: NavElements,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./demo/home/home').then((c) => c.Home)
      },
      {
        path: 'categories',
        loadChildren: () => import('./demo/categories/categories-module').then((m) => m.CategoriesModule)
      },      
      {
        path: 'product-list',
        loadComponent: () => import('./demo/product-list/product-list').then((c) => c.ProductList)
      },{
        path: 'product-details',
        loadComponent: () => import('./demo/product-details/product-details').then((c) => c.ProductDetails)
      },{
        path: 'checkout',
        loadComponent: () => import('./demo/check-out/check-out').then((c) => c.CheckOut)
      },{
        path:'payment',
        loadComponent: () => import('./demo/payment/payment').then((c) => c.Payment)
      },{
        path:'profile', canActivate: [profileGuardGuard],
        loadComponent: () => import('./demo/profile/profile').then((c) => c.Profile)
      }
    ]
  },
  {
    path: '',
    component: Guest,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/auth-signin/auth-signin.component').then((c) => c.AuthSigninComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/auth-signup/auth-signup.component').then((c) => c.AuthSignupComponent)
      },{
        path: 'reset-password',
        loadComponent: () => import('./demo/pages/reset-password/reset-password').then((c) => c.ResetPassword)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
