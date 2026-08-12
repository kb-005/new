import { Component } from '@angular/core';
import { NgFor, NgIf, NgClass, AsyncPipe } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, AsyncPipe],
  template: `
    <div class="toast-stack">
      <div
        *ngFor="let t of (toast.toasts$ | async)"
        class="toast-item toast-{{ t.type }}"
        role="alert"
      >
        <i class="bi" [ngClass]="iconFor(t.type)"></i>
        <span class="toast-msg">{{ t.message }}</span>
        <button class="toast-close" (click)="toast.dismiss(t.id)" aria-label="Dismiss">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-stack {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1090;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        max-width: 360px;
      }
      .toast-item {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.8rem 1rem;
        border-radius: 10px;
        color: #fff;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        animation: slideIn 0.2s ease;
      }
      .toast-success { background: #16a34a; }
      .toast-error { background: #dc2626; }
      .toast-info { background: #0369a1; }
      .toast-warning { background: #d97706; }
      .toast-msg { flex: 1; font-size: 0.9rem; }
      .toast-close {
        background: transparent;
        border: none;
        color: #fff;
        font-size: 1.1rem;
        cursor: pointer;
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `
  ]
})
export class ToastContainerComponent {
  constructor(public toast: ToastService) {}

  iconFor(type: string): string {
    switch (type) {
      case 'success': return 'bi-check-circle-fill';
      case 'error': return 'bi-exclamation-triangle-fill';
      case 'warning': return 'bi-exclamation-circle-fill';
      default: return 'bi-info-circle-fill';
    }
  }
}
