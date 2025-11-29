import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
  stripePromise = loadStripe('pk_test_51SYWsFGo9HQ0eGdiO09wves8cu7WFpqXgwRfOXR3tSQzQUgmXnU37d1CBlPElSuqlZzkltBsM0xnLm6Xa9vvSO1500IisVn1cf'); // clé publique

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number) {
    return this.http.post<any>('http://localhost:8080/api/payment/create', { amount }, this.options);

}
}
