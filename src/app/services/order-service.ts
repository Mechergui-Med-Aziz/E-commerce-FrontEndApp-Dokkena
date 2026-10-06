import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Order } from '../classes/order';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(
    private http: HttpClient
  ) {}

  // ==========================================
  // GET ALL
  // ==========================================

  getAllOrders(): Observable<Order[]> {

    return this.http.get<Order[]>(
      `${this.apiUrl}/all`
    );

  }

  // ==========================================
  // GET BY ID
  // ==========================================

  getOrderById(
    id: number
  ): Observable<Order> {

    return this.http.get<Order>(
      `${this.apiUrl}/${id}`
    );

  }

  // ==========================================
  // GET BY EMAIL
  // ==========================================

  getOrdersByEmail(
    email: string
  ): Observable<Order[]> {

    return this.http.get<Order[]>(
      `${this.apiUrl}/email/${encodeURIComponent(email)}`
    );

  }

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  updateOrderStatus(
    id: number,
    status: OrderStatus
  ): Observable<Order> {

    return this.http.put<Order>(
      `${this.apiUrl}/${id}/status`,
      status,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  }

  // ==========================================
  // DELETE
  // ==========================================

  deleteOrder(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }
  
  // =========================================================
  // CRÉER UNE COMMANDE
  // =========================================================

  createOrder(
    order: CreateOrderRequest
  ): Observable<Order> {

    return this.http.post<Order>(
      `${this.apiUrl}/create`,
      order
    );

  }

}