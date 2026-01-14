import { Injectable } from '@angular/core';

export interface Toast {
  message: string,
  type: 'success' | 'error' | 'info' | 'warning'
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() { }

  toasts: Toast[] = [];

  show(message: string, type: Toast['type'] = 'info') {
    this.toasts.push({ message, type });
    setTimeout(() => {
      this.toasts.shift();
    }, 3000);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }
}
