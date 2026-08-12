import { Component } from '@angular/core';
import { NgIf, NgClass, AsyncPipe } from '@angular/common';
import { ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [NgIf, NgClass, AsyncPipe],
  template: `
    @if (confirm.request$ | async; as options) {
      <div class="confirm-backdrop">
        <div class="confirm-modal" role="dialog" aria-modal="true">
          <h5 class="confirm-title">
            <i class="bi bi-question-circle"></i> {{ options.title }}
          </h5>
          <p class="confirm-message">{{ options.message }}</p>
          <div class="confirm-actions">
            <button class="btn btn-outline-secondary" (click)="confirm.resolve(false)">
              {{ options.cancelText || 'Cancel' }}
            </button>
            <button
              class="btn"
              [ngClass]="options.danger ? 'btn-danger' : 'btn-primary'"
              (click)="confirm.resolve(true)"
            >
              {{ options.confirmText || 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .confirm-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1080;
      }
      .confirm-modal {
        background: #fff;
        width: min(420px, 92vw);
        border-radius: 14px;
        padding: 1.5rem;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
      }
      .confirm-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.1rem;
        color: #1e293b;
        margin-bottom: 0.6rem;
      }
      .confirm-message {
        color: #475569;
        margin-bottom: 1.2rem;
      }
      .confirm-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.6rem;
      }
    `
  ]
})
export class ConfirmDialogComponent {
  constructor(public confirm: ConfirmService) {}
}
