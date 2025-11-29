import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl="https://dbchallengeserver.onrender.com/user"
  //private apiUrl="https://dbchallengeserver.onrender.com/user"
  private apiUrl=environment.apiUrl

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };

  constructor(private http:HttpClient) { }

  getUserByEmail(email:string){
    return this.http.get(`${this.apiUrl}user/email/${email}`).pipe(
      map(response => {
        console.log('Response:', response);
        return response as User;
      }),
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    )
  }

  getUserById(id:number){
    return this.http.get(`${this.apiUrl}user/id/${id}`,this.options).pipe(
      map(response => {
        console.log('Response:', response);
        return response as User;
      }),
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    )
  }

  getAllUsers():Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrl}user/all`).pipe(
      map(response => {
        console.log('Response:', response);
        return response as User[];
  }),
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    )
  }

  getUserByCin(cin: number){
    let user=this.http.get(`${this.apiUrl}user/cin/${cin}`).pipe(
      map(response => {
        console.log('Response:', response);
        return response as User;
      }),
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  registerUser(userData:User){
    
    return this.http.post(`${this.apiUrl}user/register`,userData).pipe(
      map(response => {
        console.log(userData);
        console.log('Response:', response);
        return response ;
      }),
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    )
  }

  updateUser(id:number,userData:User){
    return this.http.put(`${this.apiUrl}user/update`,userData).pipe(
      map(response => {
        console.log('Response:', response);
        return response as User;
      }),
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  getUserByCinAndEmail(cin:number,email:string){
    cin=Number(cin);
    console.log('Fetching user with CIN:', cin, 'and Email:', email);
    return this.http.get(`${this.apiUrl}user/cin-email/${cin}/${email}`).pipe(
      map(response => {
        console.log('Response:', response);
        return response as User;
      }),
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  login( email:string, password: string ) {
    let credentials = { email: email, password: password };
    return this.http.post<any>(`${this.apiUrl}auth/login`, credentials).pipe(
      map(response => {
        // En cas de succès, la réponse contient le token et autres informations.
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', response.email);
          localStorage.setItem('id', response.id);
          return { success: true };
        }
        return { success: false };
      }),
      catchError(error => {
        console.log(error);
        // Ici on récupère l'erreur customisée renvoyée par le backend.
        let errorMsg = "Erreur lors de la connexion !";
        if (error.error && error.error.error) {
          console.log(error.error);
          console.log(error.error.error);
          errorMsg = error.error.error;
        }
        return of({ success: false, error: errorMsg });
      })
    );

    /*const users: any = await this.http.get(`${this.apiUrl}?email=${email}`).toPromise();
    
    if (!users || users.length === 0) return null;

    const user = users[0];
    const match = bcrypt.compareSync(password, user.password);

    if (!match) return null;

    const token = this.generateToken(user);

    localStorage.setItem("token", token);
    localStorage.setItem("id", user.id);

    return user;*/
  }

  


  getToken() {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }
}
