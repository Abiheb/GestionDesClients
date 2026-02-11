import { Component, ChangeDetectionStrategy, inject, signal, computed, input, output, OnDestroy, OnInit, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { NgIf, NgClass } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgIf, NgClass],
  standalone: true
})
export class CustomerFormComponent implements OnDestroy, OnInit {
  private customerService = inject(CustomerService);
  private destroy$ = new Subject<void>();
  
  // Inputs/Outputs strictement typés
  customer = input<Customer | undefined>(undefined); // undefined = mode création
  saveSuccess = output<void>();
  cancel = output<void>();
  
  // États UI avec signaux (optimisés pour OnPush)
  isSaving = signal(false);
  isSubmitted = signal(false);
  
  // Formulaire typé strictement
  form = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.nameValidator.bind(this)]
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.nameValidator.bind(this)]
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [this.phoneValidator.bind(this)] // Optionnel mais validation de format si renseigné
    }),
    isActive: new FormControl(true, { nonNullable: true })
  });
  
  // Calculs réactifs
  isEditMode = computed(() => !!this.customer());
  formTitle = computed(() => this.isEditMode() ? 'Modifier le client' : 'Ajouter un client');
  submitButtonText = computed(() => this.isEditMode() ? 'Mettre à jour' : 'Créer');
  
  constructor() {
    // Initialisation automatique en mode édition
   // Dans le constructor ou ngOnInit :
effect(() => {
  const customer = this.customer();
  if (customer) {
    this.form.patchValue({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone ?? '',
      isActive: customer.isActive
    });
    this.isSubmitted.set(false);
  } else {
    this.form.reset({ isActive: true });
  }
}, { allowSignalWrites: true });
  }
  
  ngOnInit(): void {}
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
 onSubmit(): void {
  this.isSubmitted.set(true);
  
  console.log('=== onSubmit appelé ===');
  console.log('Form valid:', this.form.valid);
  console.log('Form value:', this.form.getRawValue());
  
  // Nettoyage des espaces superflus avant validation
  this.trimFormControlValues();
  
  if (this.form.invalid) {
    console.warn('Formulaire invalide, erreurs:', this.form.errors);
    this.markAllAsTouched();
    return;
  }
  
  console.log('✅ Formulaire valide, envoi...');
  
  this.isSaving.set(true);
  const formData = this.form.getRawValue();
  const customerId = this.customer()?.id;
  
  console.log('Mode:', customerId ? 'Édition' : 'Création');
  console.log('Données à envoyer:', formData);
  
  (customerId 
    ? this.customerService.update(customerId, formData) 
    : this.customerService.create(formData)
  ).subscribe({
    next: (result) => {
      console.log('✅ Succès:', result);
      this.saveSuccess.emit();
      if (!customerId) {
        this.form.reset({ isActive: true });
        this.isSubmitted.set(false);
      }
      alert(customerId ? 'Client mis à jour avec succès !' : 'Client créé avec succès !');
    },
    error: (err) => {
      console.error('❌ Erreur:', err);
      alert(`Échec de l'opération : ${err.message || 'Veuillez réessayer'}`);
    },
    complete: () => {
      console.log('Opération terminée');
      this.isSaving.set(false);
    }
  });
}
  onCancel(): void {
    this.cancel.emit();
  }
  
  // ========== VALIDATEURS PERSONNALISÉS (typés strictement) ==========
  private nameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();
    if (!value) return null; // Géré par Validators.required
    return value.length >= 2 ? null : { minlength: { requiredLength: 2, actualLength: value.length } };
  }
  
  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null; // Optionnel
    const cleanValue = control.value.replace(/\s+/g, '');
    // Format international simplifié: +33 6 12 34 56 78 ou 0612345678
    const phoneRegex = /^(\+?\d{1,3}[\s.-]?)?(\d{2}[\s.-]?){4,5}\d{2}$/;
    return phoneRegex.test(cleanValue) ? null : { invalidPhone: true };
  }
  
  // ========== UTILITAIRES ==========
  private trimFormControlValues(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control && typeof control.value === 'string') {
        control.setValue(control.value.trim(), { emitEvent: false });
      }
    });
  }
  
  private markAllAsTouched(): void {
    Object.values(this.form.controls).forEach(control => control.markAsTouched());
  }
  
  // Méthodes helpers pour le template (évite la logique complexe dans le HTML)
  hasError(controlName: string, errorType: string): boolean {
    const control = this.form.get(controlName);
    return !!(
      control && 
      control.invalid && 
      (control.touched || this.isSubmitted()) && 
      control.hasError(errorType)
    );
  }
  
  getErrorMessage(controlName: string): string {
    if (!this.hasError(controlName, 'required')) return '';
    const labels: Record<string, string> = {
      firstName: 'Le prénom',
      lastName: 'Le nom',
      email: 'L\'email'
    };
    return `${labels[controlName] || 'Ce champ'} est requis`;
  }
  // Ajoutez cette méthode dans la classe CustomerFormComponent
protected debugForm(): void {
  console.log('=== DEBUG FORM ===');
  console.log('Form valid:', this.form.valid);
  console.log('Form value:', this.form.value);
  console.log('Form errors:', this.form.errors);
  console.log('Form controls errors:', Object.keys(this.form.controls).reduce((acc, key) => {
    acc[key] = this.form.get(key)?.errors;
    return acc;
  }, {} as Record<string, any>));
  console.log('Mode:', this.isEditMode() ? 'Édition' : 'Création');
  console.log('Customer input:', this.customer());
}

}