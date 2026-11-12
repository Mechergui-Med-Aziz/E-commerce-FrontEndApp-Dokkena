import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { Guest } from './theme/layout/guest/guest';
import { NavElements } from './theme/layout/nav-elements/nav-elements';
import { profileGuardGuard } from './guards/profile-guard-guard';

export const routes: Routes = [
  {
    path: '',
    component: NavElements,
    children: [
      {
        path: '',
        title: 'Dokkena : boutique en ligne High-Tech, Mode, Beauté, Sport en Tunisie',
        loadComponent: () => import('./demo/home/home').then((c) => c.Home)
      },
      {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: 'categories',
        loadChildren: () => import('./demo/categories/categories-module').then((m) => m.CategoriesModule)
      },
      {
        path: 'category/:slug',
        redirectTo: 'categories/:slug'
      },
      {
        path: 'categorie/:slug',
        redirectTo: 'categories/:slug'
      },
      {
        path: 'product-list',
        title: 'Tous les produits | Dokkena',
        loadComponent: () => import('./demo/product-list/product-list').then((c) => c.ProductList)
      },
      {
        path: 'product-details',
        title: 'Fiche produit | Dokkena',
        loadComponent: () => import('./demo/product-details/product-details').then((c) => c.ProductDetails)
      },
      {
        path: 'product/:id',
        title: 'Fiche produit | Dokkena',
        loadComponent: () => import('./demo/product-details/product-details').then((c) => c.ProductDetails)
      },
      {
        path: 'produit/:id',
        title: 'Fiche produit | Dokkena',
        loadComponent: () => import('./demo/product-details/product-details').then((c) => c.ProductDetails)
      },
      {
        path: 'cart',
        redirectTo: 'checkout'
      },
      {
        path: 'checkout',
        title: 'Mon Panier & Commande | Dokkena',
        loadComponent: () => import('./demo/check-out/check-out').then((c) => c.CheckOut)
      },
      {
        path: 'payment',
        title: 'Paiement sécurisé | Dokkena',
        loadComponent: () => import('./demo/payment/payment').then((c) => c.Payment)
      },
      {
        path: 'profile',
        title: 'Mon Profil | Dokkena',
        canActivate: [profileGuardGuard],
        loadComponent: () => import('./demo/profile/profile').then((c) => c.Profile)
      },
      // Pages d'information institutionnelles (SEO & Confiance)
      {
        path: 'about',
        title: 'À propos de Dokkena | Boutique de confiance en Tunisie',
        loadComponent: () => import('./demo/pages/info/about.component').then((c) => c.AboutComponent)
      },
      {
        path: 'contact',
        title: 'Contactez Dokkena | Support Client & Commandes',
        loadComponent: () => import('./demo/pages/info/contact.component').then((c) => c.ContactComponent)
      },
      {
        path: 'faq',
        title: 'Foire Aux Questions (FAQ) | Dokkena',
        loadComponent: () => import('./demo/pages/info/faq.component').then((c) => c.FaqComponent)
      },
      {
        path: 'delivery-returns',
        title: 'Livraison express et Retours simples en Tunisie | Dokkena',
        loadComponent: () => import('./demo/pages/info/delivery-returns.component').then((c) => c.DeliveryReturnsComponent)
      },
      {
        path: 'terms',
        title: 'Conditions Générales de Vente (CGV) | Dokkena',
        loadComponent: () => import('./demo/pages/info/terms.component').then((c) => c.TermsComponent)
      },
      {
        path: 'privacy',
        title: 'Politique de Confidentialité | Dokkena',
        loadComponent: () => import('./demo/pages/info/privacy.component').then((c) => c.PrivacyComponent)
      },
      {
        path: 'legal',
        title: 'Mentions Légales | Dokkena',
        loadComponent: () => import('./demo/pages/info/legal.component').then((c) => c.LegalComponent)
      },
      // Blog & Guides d'achat
      {
        path: 'blog',
        title: 'Guides d\'achat et Conseils Shopping | Blog Dokkena',
        loadComponent: () => import('./demo/pages/blog/blog-list.component').then((c) => c.BlogListComponent)
      },
      {
        path: 'blog/:slug',
        title: 'Guide d\'achat | Dokkena',
        loadComponent: () => import('./demo/pages/blog/blog-detail.component').then((c) => c.BlogDetailComponent)
      }
    ]
  },
  {
    path: '',
    component: Guest,
    children: [
      {
        path: 'login',
        title: 'Connexion | Dokkena',
        loadComponent: () => import('./demo/pages/authentication/auth-signin/auth-signin.component').then((c) => c.AuthSigninComponent)
      },
      {
        path: 'register',
        title: 'Créer un compte | Dokkena',
        loadComponent: () => import('./demo/pages/authentication/auth-signup/auth-signup.component').then((c) => c.AuthSignupComponent)
      },
      {
        path: 'auth/signin',
        redirectTo: 'login'
      },
      {
        path: 'auth/signup',
        redirectTo: 'register'
      }
    ]
  },
  {
    path: '**',
    title: 'Page non trouvée (404) | Dokkena',
    loadComponent: () => import('./demo/pages/not-found/not-found.component').then((c) => c.NotFoundComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
