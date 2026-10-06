import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { Guest } from './theme/layout/guest/guest';
import { NavElements } from './theme/layout/nav-elements/nav-elements';
import { profileGuard } from './guards/profile-guard';
import { resetPasswordGuard } from './guards/reset-password-guard';

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
        path:'order-confirmation',canActivate:[],
        loadComponent: () => import('./demo/order-confirmation/order-confirmation').then((c) => c.OrderConfirmationComponent)
      },
      {path:'product-management',canActivate:[profileGuard],
        loadComponent: () => import('./demo/admin/product-management/product-management').then((c) => c.ProductManagementComponent)
      },
      {path:'category-management',canActivate:[profileGuard],
        loadComponent: () => import('./demo/admin/category-management/category-management').then((c) => c.CategoryManagement)
      },
      {path:'order-management',canActivate:[],
        loadComponent: () => import('./demo/admin/order-management/order-management').then((c) => c.OrderManagementComponent)
      },
      {
        path:'profile', canActivate: [profileGuard],
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
        path: 'reset-password', canActivate:[resetPasswordGuard],
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
