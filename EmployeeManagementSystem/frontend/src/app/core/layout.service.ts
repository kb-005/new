import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Tracks responsive sidebar visibility (mobile off-canvas toggle). */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
  sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  closeSidebar(): void {
    this.sidebarOpenSubject.next(false);
  }

  openSidebar(): void {
    this.sidebarOpenSubject.next(true);
  }
}
