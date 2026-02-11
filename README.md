#  Gestion Clients - Angular 17

Application standalone Angular 17 pour la gestion complète de clients avec architecture feature-based, formulaires réactifs et design responsive.

## Features

-  **Architecture Feature-Based** - Organisation par domaine métier
-  **100% Standalone Components** - Pas de NgModules
-  **Reactive Forms** - Validation temps réel avec messages personnalisés
-  **ChangeDetectionStrategy.OnPush** - Performance optimale
-  **Typage Strict TypeScript** - Sécurité et maintenabilité
-  **Recherche Dynamique** - Filtre en temps réel avec RxJS
-  **Responsive Design** - Mobile, tablette et desktop
-  **Accessibilité WCAG** - ARIA labels, navigation clavier
-  **Lazy Loading** - Chargement des features à la demande

##  Quick Start

### Prérequis

- Node.js ≥ v18.13.0 ([Download](https://nodejs.org/))
- npm ≥ v9.0.0

### Installation
```bash
# Clone le repository
git clone https://github.com/votre-username/gestion-clients.git

# Navigue vers le dossier
cd gestion-clients

# Installe les dépendances
npm install
```

### Démarrage
```bash
# Démarre le serveur de développement
npm start

# Ou avec ouverture automatique du navigateur
ng serve --open
```

**Application accessible à :** `http://localhost:4200/customers`

##  Project Structure
```
gestion-clients/
├── src/
│   ├── app/
│   │   ├── core/                    # Fonctionnalités de base
│   │   │   ├── layout/              # Shell layout (header/footer)
│   │   │   └── not-found/           # Page 404
│   │   ├── features/                # Architecture feature-based
│   │   │   └── customers/           # Feature "Gestion Clients"
│   │   │       ├── components/      # Composants métier
│   │   │       │   ├── customer-form/     # Formulaire (CRUD)
│   │   │       │   └── customer-list/     # Liste avec recherche
│   │   │       ├── models/          # Interfaces TypeScript
│   │   │       ├── services/        # Services métier
│   │   │       └── customers.routes.ts    # Routage feature
│   │   ├── app.component.ts         # Composant racine
│   │   └── app.routes.ts            # Routage principal
│   ├── index.html
│   └── main.ts                      # Bootstrap de l'application
├── angular.json
├── package.json
└── README.md
```

##  Routes

| Route | Description | Fonctionnalité |
|-------|-------------|----------------|
| `/customers` | Liste des clients | Recherche, suppression |
| `/customers/new` | Création client | Formulaire avec validation |
| `/customers/:id` | Édition client | Pré-remplissage des données |
| `/**` | Page 404 | Gestion erreurs |

##  Scripts Disponibles
```bash
# Développement
npm start              # Démarre le serveur de dev

# Build
npm run build          # Build de production
npm run watch          # Build en mode watch

# Tests
npm test               # Lance les tests unitaires
```






---

⭐ **N'oubliez pas de mettre une étoile si ce projet vous a aidé !**
