import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Inject('API_CONF') private conf: any) {
    this.saveToken(this.conf.authToken);
  }

  saveToken(token: string) {
    localStorage.setItem('tk', token);
  }

  getToken(): string | undefined {
    return localStorage.getItem('tk') || undefined;
  }
}
