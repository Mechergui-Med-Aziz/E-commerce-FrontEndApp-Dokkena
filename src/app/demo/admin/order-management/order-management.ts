import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  OrderStatus,
  OrderService
} from '../../../services/order-service';

import {
  Order
} from 'src/app/classes/order';

import {
  OrderItem
} from 'src/app/classes/order-item';


@Component({
  selector: 'app-order-management',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './order-management.html',

  styleUrl: './order-management.scss'
})
export class OrderManagementComponent
  implements OnInit {


  // ==================================================
  // DONNÉES
  // ==================================================

  orders: Order[] = [];

  filteredOrders: Order[] = [];

  paginatedOrders: Order[] = [];

  selectedOrder: Order | null = null;


  // ==================================================
  // FILTRES
  // ==================================================

  searchTerm = '';

  selectedStatus: OrderStatus | '' = '';

  startDate = '';

  endDate = '';


  // ==================================================
  // PAGINATION
  // ==================================================

  currentPage = 1;

  pageSize = 10;

  totalPages = 1;


  // ==================================================
  // ÉTATS
  // ==================================================

  loading = false;

  updatingStatus = false;

  deletingOrder = false;


  // ==================================================
  // MESSAGES
  // ==================================================

  successMessage = '';

  errorMessage = '';


  // ==================================================
  // STATUTS
  // ==================================================

  statuses: {
    value: OrderStatus;
    label: string;
  }[] = [

    {
      value: OrderStatus.PENDING,
      label: 'En attente'
    },

    {
      value: OrderStatus.CONFIRMED,
      label: 'Confirmée'
    },

    {
      value: OrderStatus.PROCESSING,
      label: 'En préparation'
    },

    {
      value: OrderStatus.SHIPPED,
      label: 'Expédiée'
    },

    {
      value: OrderStatus.DELIVERED,
      label: 'Livrée'
    },

    {
      value: OrderStatus.CANCELLED,
      label: 'Annulée'
    }

  ];


  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}


  // ==================================================
  // INIT
  // ==================================================

  ngOnInit(): void {

    this.loadOrders();

  }


  // ==================================================
  // CHARGER LES COMMANDES
  // ==================================================

  loadOrders(): void {

    this.loading = true;

    this.clearMessages();

    this.orderService
      .getAllOrders()
      .subscribe({

        next: (data) => {

          this.orders = data || [];

          // Trier par date décroissante
          this.orders.sort((a, b) => {

            const dateA = a.orderDate
              ? new Date(a.orderDate).getTime()
              : 0;

            const dateB = b.orderDate
              ? new Date(b.orderDate).getTime()
              : 0;

            return dateB - dateA;

          });

          this.applyFilters();

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Erreur chargement commandes :',
            error
          );

          this.errorMessage =
            'Impossible de charger les commandes.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==================================================
  // FILTRAGE
  // ==================================================

  applyFilters(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredOrders =
      this.orders.filter(order => {


        // ------------------------------------------
        // RECHERCHE CLIENT
        // ------------------------------------------

        const buyerName =
          order.buyerName
            ? order.buyerName.toLowerCase()
            : '';

        const email =
          order.email
            ? order.email.toLowerCase()
            : '';

        const phone =
          order.phone
            ? order.phone.toLowerCase()
            : '';


        const matchesSearch =
          !search ||
          buyerName.includes(search) ||
          email.includes(search) ||
          phone.includes(search);


        // ------------------------------------------
        // STATUS
        // ------------------------------------------

        const matchesStatus =
          !this.selectedStatus ||
          order.orderStatus === this.selectedStatus;


        // ------------------------------------------
        // DATE DÉBUT
        // ------------------------------------------

        let matchesStartDate = true;

        if (this.startDate) {

          const orderDate =
            this.getDateOnly(order.orderDate);

          matchesStartDate =
            orderDate >= this.startDate;

        }


        // ------------------------------------------
        // DATE FIN
        // ------------------------------------------

        let matchesEndDate = true;

        if (this.endDate) {

          const orderDate =
            this.getDateOnly(order.orderDate);

          matchesEndDate =
            orderDate <= this.endDate;

        }


        return (
          matchesSearch &&
          matchesStatus &&
          matchesStartDate &&
          matchesEndDate
        );

      });


    this.currentPage = 1;

    this.updatePagination();

  }


  // ==================================================
  // DATE YYYY-MM-DD
  // ==================================================

  private getDateOnly(
    date?: string
  ): string {

    if (!date) {
      return '';
    }

    return date.substring(0, 10);

  }


  // ==================================================
  // RESET FILTRES
  // ==================================================

  resetFilters(): void {

    this.searchTerm = '';

    this.selectedStatus = '';

    this.startDate = '';

    this.endDate = '';

    this.currentPage = 1;

    this.applyFilters();

  }


  // ==================================================
  // PAGINATION
  // ==================================================

  updatePagination(): void {

    this.totalPages =
      Math.max(
        1,
        Math.ceil(
          this.filteredOrders.length /
          this.pageSize
        )
      );


    if (
      this.currentPage >
      this.totalPages
    ) {

      this.currentPage =
        this.totalPages;

    }


    const start =
      (this.currentPage - 1) *
      this.pageSize;


    const end =
      start + this.pageSize;


    this.paginatedOrders =
      this.filteredOrders.slice(
        start,
        end
      );

  }


  // ==================================================
  // PAGE SUIVANTE
  // ==================================================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.updatePagination();

    }

  }


  // ==================================================
  // PAGE PRÉCÉDENTE
  // ==================================================

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();

    }

  }


  // ==================================================
  // ALLER À UNE PAGE
  // ==================================================

  goToPage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {

      this.currentPage = page;

      this.updatePagination();

    }

  }


  // ==================================================
  // PAGES
  // ==================================================

  getPages(): number[] {

    const pages: number[] = [];

    for (
      let i = 1;
      i <= this.totalPages;
      i++
    ) {

      pages.push(i);

    }

    return pages;

  }


  // ==================================================
  // CHANGER PAGE SIZE
  // ==================================================

  changePageSize(): void {

    this.currentPage = 1;

    this.updatePagination();

  }


  // ==================================================
  // STATISTIQUES
  // ==================================================

  countByStatus(
    status: OrderStatus | string
  ): number {

    return this.orders.filter(
      order =>
        order.orderStatus === status
    ).length;

  }


  // ==================================================
  // DÉTAIL COMMANDE
  // ==================================================

  openOrderDetails(
    order: Order
  ): void {

    this.selectedOrder = order;

    document.body.style.overflow = 'hidden';

  }


  // ==================================================
  // FERMER MODAL
  // ==================================================

  closeOrderDetails(): void {

    this.selectedOrder = null;

    document.body.style.overflow = '';

  }


  // ==================================================
  // MODIFIER STATUS
  // ==================================================

  changeStatus(
    order: Order,
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;


    const newStatus =
      select.value as OrderStatus;


    if (
      !newStatus ||
      newStatus === order.orderStatus
    ) {

      return;

    }


    if (!order.id) {

      this.errorMessage =
        'Identifiant de commande invalide.';

      return;

    }


    const oldStatus =
      order.orderStatus;


    this.updatingStatus = true;

    this.clearMessages();


    this.orderService
      .updateOrderStatus(
        order.id,
        newStatus
      )
      .subscribe({

        next: (updatedOrder) => {

          const index =
            this.orders.findIndex(
              o => o.id === order.id
            );


          if (index !== -1) {

            this.orders[index] =
              updatedOrder;

          }


          if (
            this.selectedOrder &&
            this.selectedOrder.id === order.id
          ) {

            this.selectedOrder =
              updatedOrder;

          }


          this.successMessage =
            `La commande #${order.id} est passée de `
            + `${this.getStatusLabel(oldStatus)} à `
            + `${this.getStatusLabel(newStatus)}.`;


          this.updatingStatus = false;

          this.applyFilters();

          this.cdr.detectChanges();

          this.hideMessageAfterDelay();

        },

        error: (error) => {

          console.error(
            'Erreur changement statut :',
            error
          );


          order.orderStatus =
            oldStatus;


          this.errorMessage =
            'Impossible de modifier le statut.';


          this.updatingStatus = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==================================================
  // SUPPRIMER
  // ==================================================

  deleteOrder(
    order: Order
  ): void {

    if (!order.id) {

      this.errorMessage =
        'Identifiant de commande invalide.';

      return;

    }


    const confirmed =
      window.confirm(
        `Voulez-vous vraiment supprimer la commande #${order.id} ?`
      );


    if (!confirmed) {
      return;
    }


    this.deletingOrder = true;

    this.clearMessages();


    this.orderService
      .deleteOrder(order.id)
      .subscribe({

        next: () => {

          this.orders =
            this.orders.filter(
              o => o.id !== order.id
            );


          this.successMessage =
            `La commande #${order.id} a été supprimée.`;


          if (
            this.selectedOrder &&
            this.selectedOrder.id === order.id
          ) {

            this.closeOrderDetails();

          }


          this.deletingOrder = false;

          this.applyFilters();

          this.cdr.detectChanges();

          this.hideMessageAfterDelay();

        },

        error: (error) => {

          console.error(
            'Erreur suppression :',
            error
          );


          this.errorMessage =
            'Impossible de supprimer la commande.';


          this.deletingOrder = false;

          this.cdr.detectChanges();

        }

      });

  }


  // ==================================================
  // LABEL STATUS
  // ==================================================

  getStatusLabel(
    status?: OrderStatus | string
  ): string {

    if (!status) {
      return '-';
    }


    const found =
      this.statuses.find(
        s => s.value === status
      );


    return found
      ? found.label
      : status;

  }


  // ==================================================
  // CLASS STATUS
  // ==================================================

  getStatusClass(
    status?: OrderStatus | string
  ): string {

    switch (status) {

      case OrderStatus.PENDING:
        return 'status-pending';

      case OrderStatus.CONFIRMED:
        return 'status-confirmed';

      case OrderStatus.PROCESSING:
        return 'status-processing';

      case OrderStatus.SHIPPED:
        return 'status-shipped';

      case OrderStatus.DELIVERED:
        return 'status-delivered';

      case OrderStatus.CANCELLED:
        return 'status-cancelled';

      default:
        return '';

    }

  }


  // ==================================================
  // TOTAL COMMANDE
  // ==================================================

  getOrderTotal(
    order: Order
  ): number {

    return (
      Number(order.orderPrice || 0) +
      Number(order.deliveryFees || 0)
    );

  }


  // ==================================================
  // TOTAL PRODUITS
  // ==================================================

  getItemTotal(
    item: OrderItem
  ): number {

    return (
      Number(item.product?.price || 0) *
      Number(item.quantity || 0)
    );

  }


  // ==================================================
  // NOMBRE D'ARTICLES
  // ==================================================

  getItemsCount(
    order: Order
  ): number {

    return (
      order.items || []
    ).reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

  }


  // ==================================================
  // FORMAT PRIX
  // ==================================================

  formatPrice(
    value?: number
  ): string {

    return (
      Number(value || 0) / 1000
    ).toFixed(3) + ' DT';

  }


  // ==================================================
  // FORMAT DATE
  // ==================================================

  formatDate(
    date?: string
  ): string {

    if (!date) {
      return '-';
    }


    const d =
      new Date(date);


    return d.toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    );

  }


  // ==================================================
  // FORMAT HEURE
  // ==================================================

  formatTime(
    date?: string
  ): string {

    if (!date) {
      return '-';
    }


    return new Date(date)
      .toLocaleTimeString(
        'fr-FR',
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      );

  }


  // ==================================================
  // IMAGE PRODUIT
  // ==================================================

  getProductImage(
    image?: string
  ): string {

    if (!image) {

      return 'assets/images/product-placeholder.png';

    }


    if (
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {

      return image;

    }


    return image;

  }


  // ==================================================
  // PAGINATION INFO
  // ==================================================

  getPaginationStart(): number {

    if (this.filteredOrders.length === 0) {
      return 0;
    }

    return (
      (this.currentPage - 1) *
      this.pageSize
    ) + 1;

  }


  getPaginationEnd(): number {

    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredOrders.length
    );

  }


  // ==================================================
  // MESSAGES
  // ==================================================

  clearMessages(): void {

    this.successMessage = '';

    this.errorMessage = '';

  }


  hideMessageAfterDelay(): void {

    setTimeout(() => {

      this.successMessage = '';

      this.cdr.detectChanges();

    }, 3500);

  }

}