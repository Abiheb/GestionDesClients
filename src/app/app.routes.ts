import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/customers',
    pathMatch: 'full'
  },
  {
    path: 'customers',
    loadChildren: () => import('./features/customers/customers.routes').then(m => m.CUSTOMERS_ROUTES),
    title: 'Gestion Clients'
  },
  {
    path: '**',
    loadComponent: () => import('./core/not-found/not-found.component').then(c => c.NotFoundComponent),
    title: 'Page non trouvée'
  }
];