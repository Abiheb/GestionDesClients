import { Routes } from '@angular/router';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { inject } from '@angular/core';
import { CustomerService } from './services/customer.service';
import { map, catchError, of } from 'rxjs';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

export const CUSTOMERS_ROUTES: Routes = [
  {
    path: '',
    component: CustomerListComponent,
    title: 'Clients | Gestion Clients'
  },
  {
    path: 'new',
    component: CustomerFormComponent,
    title: 'Nouveau client | Gestion Clients'
  },
  {
    path: ':id',
    component: CustomerFormComponent,
    title: 'Modifier client | Gestion Clients',
    resolve: {
      customer: (route: ActivatedRouteSnapshot) => {
        const customerService = inject(CustomerService);
        const id = Number(route.paramMap.get('id'));
        
        return customerService.getById(id).pipe(
          map(customer => ({ customer, error: null })),
          catchError((error) => {
            console.error('Erreur chargement client:', error);
            return of({ customer: null, error: 'not-found' });
          })
        );
      }
    },
    canActivate: [(route: ActivatedRouteSnapshot) => {
      const router = inject(Router);
      const data = route.data;
      
      if (data['customer']?.error === 'not-found') {
        router.navigate(['/customers'], {
          queryParams: { error: 'customer-not-found' }
        });
        return false;
      }
      return true;
    }]
  }
];