import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'beauty',
        loadComponent: () => import('./beauty/beauty').then((c) => c.Beauty)
      },
      {
        path: 'electronic',
        loadComponent: () => import('./electronic/electronic').then((c) => c.Electronic)
      },
      {
        path: 'fashion',
        loadComponent: () => import('./fashion/fashion').then((c) => c.Fashion)
      },
      {
        path: 'game',
        loadComponent: () => import('./game/game').then((c) => c.Game)
      },
      {
        path: 'kitchen',
        loadComponent: () => import('./kitchen/kitchen').then((c) => c.Kitchen)
      },
      {
        path: 'sport',
        loadComponent: () => import('./sport/sport').then((c) => c.Sport)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
