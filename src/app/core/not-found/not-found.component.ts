import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="not-found-container">
      <h1>404</h1>
      <p>Page non trouvée</p>
      <a routerLink="/customers" class="btn-home">Retour à l'accueil</a>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 6rem;
      margin: 0;
      color: #333;
    }
    p {
      font-size: 1.5rem;
      color: #666;
      margin: 1rem 0;
    }
    .btn-home {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 1rem;
      transition: background 0.2s;
    }
    .btn-home:hover {
      background: #0056b3;
    }
  `],
  imports: [RouterLink],
  standalone: true
})
export class NotFoundComponent {}