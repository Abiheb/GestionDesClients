import { Component, ChangeDetectionStrategy, inject, OnDestroy } from '@angular/core';
import { combineLatest, BehaviorSubject, Subject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { NgFor, NgIf, AsyncPipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgIf, AsyncPipe, UpperCasePipe, RouterLink],
  standalone: true
})
export class CustomerListComponent implements OnDestroy {
  private customerService = inject(CustomerService);
  private destroy$ = new Subject<void>();
  private searchTerms$ = new BehaviorSubject<string>('');

  // VM simplifié sans isLoading
  protected readonly vm$ = combineLatest([
    this.customerService.customers$.pipe(
      map(customers => customers.map(c => ({
        id: c.id,
        lastName: c.lastName,
        firstName: c.firstName,
        email: c.email,
        phone: c.phone,
        isActive: c.isActive
      })))
    ),
    this.searchTerms$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    )
  ]).pipe(
    map(([customers, searchTerm]) => ({
      customers: this.filterCustomers(customers, searchTerm),
      searchTerm
    }))
  );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackById(index: number, customer: { id: number }): number {
    return customer.id;
  }

  protected onSearch(term: string): void {
    this.searchTerms$.next(term.trim());
  }

  protected onDelete(customer: { id: number; firstName: string; lastName: string }): void {
    if (!customer.id) return;
    
    const confirmed = confirm(
      `Confirmez-vous la suppression de ${customer.firstName} ${customer.lastName} ?\n` +
      `Cette action est irréversible.`
    );
    
    if (confirmed) {
      this.customerService.delete(customer.id).subscribe({
        error: (err) => {
          console.error('Erreur suppression client:', err);
          alert(`Échec de la suppression : ${err.message || 'Une erreur inconnue est survenue'}`);
        }
      });
    }
  }

  private filterCustomers(customers: Array<{ firstName: string; lastName: string; email: string; phone?: string; id: number; isActive: boolean }>, term: string): typeof customers {
    if (!term) return customers;
    
    const normalizedTerm = term.toLowerCase().replace(/\s+/g, '');
    return customers.filter(customer => 
      `${customer.firstName}${customer.lastName}${customer.email}${customer.phone || ''}`
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(normalizedTerm)
    );
  }
}