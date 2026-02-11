import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay, map, catchError, tap } from 'rxjs/operators';
import { Customer, CustomerForm } from '../models/customer.model';

@Injectable({
  providedIn: 'root' // Injection globale : service réutilisable dans toute l'appli, tree-shakable
})
export class CustomerService {
  private readonly API_DELAY = 300; // Simule latence réseau
  private customersSubject = new BehaviorSubject<Customer[]>(this.getInitialData());
  public customers$ = this.customersSubject.asObservable();

  // Méthodes CRUD simulées (retournent des Observables "froids" comme HttpClient)
  getAll(): Observable<Customer[]> {
    return of(this.customersSubject.value).pipe(
      delay(this.API_DELAY),
      catchError(() => throwError(() => new Error('Erreur chargement clients')))
    );
  }

  getById(id: number): Observable<Customer> {
    return this.getAll().pipe(
      map(customers => {
        const customer = customers.find(c => c.id === id);
        if (!customer) throw new Error(`Client ID ${id} introuvable`);
        return customer;
      })
    );
  }

  create(customerForm: CustomerForm): Observable<Customer> {
    return of(customerForm).pipe(
      delay(this.API_DELAY),
      map(form => {
        const newCustomer: Customer = {
          ...form,
          id: this.generateNewId(),
          isActive: form.isActive ?? true,
          createdAt: new Date(),
        };
        const updated = [...this.customersSubject.value, newCustomer];
        this.customersSubject.next(updated);
        return newCustomer;
      }),
      catchError(() => throwError(() => new Error('Erreur création client')))
    );
  }

  update(id: number, customerForm: CustomerForm): Observable<Customer> {
    return of(customerForm).pipe(
      delay(this.API_DELAY),
      map(form => {
        const current = this.customersSubject.value;
        const index = current.findIndex(c => c.id === id);
        if (index === -1) throw new Error(`Client ID ${id} introuvable`);
        
        const updatedCustomer: Customer = {
          ...current[index],
          ...form,
          id,
          updatedAt: new Date()
        };
        
        const updatedList = [
          ...current.slice(0, index),
          updatedCustomer,
          ...current.slice(index + 1)
        ];
        this.customersSubject.next(updatedList);
        return updatedCustomer;
      }),
      catchError(() => throwError(() => new Error('Erreur mise à jour client')))
    );
  }

  
delete(id: number): Observable<void> {
  return new Observable<void>((observer) => {
    setTimeout(() => {
      try {
        const current = this.customersSubject.value;
        const exists = current.some(c => c.id === id);
        
        if (!exists) {
          throw new Error(`Client ID ${id} introuvable`);
        }
        
        const updatedList = current.filter(c => c.id !== id);
        this.customersSubject.next(updatedList);
        
        console.log(`✅ Client ${id} supprimé avec succès`);
        observer.next();  // Émet une valeur
        observer.complete(); // Termine l'Observable
      } catch (error) {
        console.error('❌ Erreur dans delete:', error);
        observer.error(error);
      }
    }, this.API_DELAY);
  });
}
  // Méthodes utilitaires privées
  private getInitialData(): Customer[] {
    return [
      {
        id: 1,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        phone: '0123456789',
        isActive: true,
        createdAt: new Date(2024, 0, 15)
      },
      // ... autres données de test
    ].map(c => ({ ...c, createdAt: new Date(c.createdAt) })); // Sécurité typage Date
  }

  private generateNewId(): number {
    const currentIds = this.customersSubject.value.map(c => c.id);
    return currentIds.length > 0 ? Math.max(...currentIds) + 1 : 1;
  }
}