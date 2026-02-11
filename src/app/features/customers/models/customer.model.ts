export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string; // Optionnel selon les besoins métier
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// Typage strict pour les formulaires (évite les partials non sécurisés)
export type CustomerForm = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: number; // Permet la réutilisation du formulaire pour la création/mise à jour
};