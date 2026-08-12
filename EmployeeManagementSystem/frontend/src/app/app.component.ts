import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastContainerComponent } from './components/toast/toast-container.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, ToastContainerComponent, ConfirmDialogComponent],
  template: `
    @if (showLayout) {
      <div class="app-layout">
        <app-sidebar></app-sidebar>
        <div class="app-main">
          <app-navbar></app-navbar>
          <main class="app-content">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    } @else {
      <router-outlet></router-outlet>
    }

    <app-toast-container></app-toast-container>
    <app-confirm-dialog></app-confirm-dialog>
  `,
  styles: [
    `
      .app-layout {
        display: flex;
        min-height: 100vh;
      }
      .app-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .app-content {
        flex: 1;
        padding: 1.75rem;
        background: #f4f6f9;
      }
      @media (max-width: 768px) {
        .app-content {
          padding: 1rem;
        }
      }
    `
  ]
})
export class AppComponent implements OnInit {
  showLayout = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        this.showLayout = !url.startsWith('/login');
      });
  }
}
