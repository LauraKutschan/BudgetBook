import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user!: User | null;
  loggedIn = false;

  constructor() {}

  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  login(user: User): void {
    this.loggedIn = true;
    this.user = user;
  }

  logout(): void {
    this.loggedIn = false;
    this.user = null;
  }

  getUser(): User | null {
    return this.user;
  }

}
