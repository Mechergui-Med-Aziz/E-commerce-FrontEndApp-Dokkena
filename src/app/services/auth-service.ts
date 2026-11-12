import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../classes/user';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private readonly apiUrl = `${environment.apiUrl}/user`;
  private readonly secretKey = 'DokkenaECommerceWebSite';

  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${encodeURIComponent(email)}`);
  }

  getUserById(id: number | string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserByCin(cin: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?cin=${cin}`);
  }

  registerUser(userData: User): Observable<User> {
    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);
    return this.http.post<User>(this.apiUrl, userData);
  }

  updateUser(id: number | string, userData: User): Observable<User> {
    if (userData.password) {
      const salt = bcrypt.genSaltSync(10);
      userData.password = bcrypt.hashSync(userData.password, salt);
    }
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const users = await this.http.get<User[]>(`${this.apiUrl}?email=${encodeURIComponent(email)}`).toPromise();

      if (!users || users.length === 0) return null;

      const user = users[0];
      const match = bcrypt.compareSync(password, user.password);

      if (!match) return null;

      const token = this.generateToken(user);

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', token);
        localStorage.setItem('id', String(user.id));
      }

      return user;
    } catch {
      return null;
    }
  }

  generateToken(user: any): string {
    const payload = {
      id: user.id,
      email: user.email,
      time: Date.now()
    };

    const payloadString = JSON.stringify(payload);
    const signature = CryptoJS.HmacSHA256(payloadString, this.secretKey).toString();

    return btoa(payloadString + '.' + signature);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('id');
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
    }
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }
}
