import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-layout',
  template: `
    <header class="app-header">
      <nav class="main-nav">
        <a routerLink="/customers" routerLinkActive="active" class="logo">
           Gestion Clients
        </a>
        <ul class="nav-links">
          <li>
            <a routerLink="/customers" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
               Liste
            </a>
          </li>
          <li>
            <a routerLink="/customers/new" routerLinkActive="active">
              ➕ Nouveau
            </a>
          </li>
        </ul>
      </nav>
    </header>

    <main class="app-main">
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </main>

    <footer class="app-footer">
      <p>© 2026 Gestion Clients • Angular 17 Standalone</p>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .app-header {
      background: #1a1a1a;
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .main-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      text-decoration: none;
      color: white;
    }
    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
      margin: 0;
      padding: 0;
    }
    .nav-links a {
      color: #ccc;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.2s;
    }
    .nav-links a:hover,
    .nav-links a.active {
      color: white;
      background: #333;
    }
    .app-main {
      flex: 1;
      padding: 2rem;
      background: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .app-footer {
      background: #1a1a1a;
      color: #ccc;
      text-align: center;
      padding: 1rem;
      font-size: 0.875rem;
    }
  `],
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  standalone: true
})
export class LayoutComponent {}