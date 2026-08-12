import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="notfound">
      <div class="code">404</div>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <a routerLink="/dashboard" class="btn btn-primary">Back to Dashboard</a>
    </div>
  `,
  styles: [
    `
      .notfound {
        min-height: 100vh; display: flex; flex-direction: column;
        align-items: center; justify-content: center; text-align: center;
        background: linear-gradient(135deg, #0ea5e9 0%, #1e293b 100%); color: #fff; padding: 1rem;
      }
      .code { font-size: 6rem; font-weight: 800; line-height: 1; }
      .notfound p { color: #cbd5e1; margin: 0.5rem 0 1.5rem; }
    `
  ]
})
export class NotFoundComponent {}
