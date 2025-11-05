import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl="http://localhost:3000/user"
  secretKey="DokkenaECommerceWebSite"

  constructor(private http:HttpClient) { }

  getUserByEmail(email:string){
    return this.http.get(`${this.apiUrl}?email=${email}`)
  }

  getUserById(id:number){
    return this.http.get(`${this.apiUrl}/${id}`)
  }

  getAllUsers():Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserByCin(cin: number){
    let user=this.http.get(`${this.apiUrl}?cin=${cin}`);
    return user 
  }

  registerUser(userData:User){
    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);
    return this.http.post(this.apiUrl,userData)
  }

  updateUser(id:number,userData:User){
    if(userData.password){
      const salt = bcrypt.genSaltSync(10);
      userData.password = bcrypt.hashSync(userData.password, salt);
    }
    return this.http.put(`${this.apiUrl}/${id}`,userData)
  }

  async login(email: string, password: string) {
    const users: any = await this.http.get(`${this.apiUrl}?email=${email}`).toPromise();
    
    if (!users || users.length === 0) return null;

    const user = users[0];
    const match = bcrypt.compareSync(password, user.password);

    if (!match) return null;

    const token = this.generateToken(user);

    localStorage.setItem("token", token);
    localStorage.setItem("id", user.id);

    return user;
  }

  generateToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      time: Date.now()
    };

    const payloadString = JSON.stringify(payload);
    const signature = CryptoJS.HmacSHA256(payloadString, this.secretKey).toString();

    return btoa(payloadString + "." + signature); // encodé base64
  }

  getToken() {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }
}
