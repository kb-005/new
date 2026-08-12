import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private requestSubject = new BehaviorSubject<ConfirmOptions | null>(null);
  request$ = this.requestSubject.asObservable();
  private resultSubject = new Subject<boolean>();

  confirm(options: ConfirmOptions): Observable<boolean> {
    this.requestSubject.next(options);
    return this.resultSubject.asObservable();
  }

  resolve(result: boolean): void {
    this.resultSubject.next(result);
    this.requestSubject.next(null);
  }
}
