import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { OrderService } from '../../services/order-service';
import { Order } from 'src/app/classes/order';
import { BasketService } from 'src/app/services/basket-service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.scss'
})
export class OrderConfirmationComponent {

  orderForm: FormGroup;

  loading = false;

  successMessage = '';

  errorMessage = '';

  // ==========================================
  // MODAL
  // ==========================================

  showSuccessModal = false;

  createdOrderId: number | undefined;


  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private basketService: BasketService,
    private router: Router
  ) {

    this.orderForm = this.fb.group({

      firstName: [
        '',
        Validators.required
      ],

      lastName: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{8}$/)
        ]
      ],

      address: [
        '',
        Validators.required
      ],

      governorate: [
        '',
        Validators.required
      ],

      city: [
        '',
        Validators.required
      ],

      postalCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{4}$/)
        ]
      ],

      notes: [
        ''
      ],

      paymentMethod: [
        'cash',
        Validators.required
      ],

      termsAccepted: [
        false,
        Validators.requiredTrue
      ]

    });

  }


  // =========================================================
  // CONFIRMER LA COMMANDE
  // =========================================================

  confirmOrder(): void {

    this.successMessage = '';

    this.errorMessage = '';


    // =========================================================
    // VÉRIFIER LE FORMULAIRE
    // =========================================================

    if (this.orderForm.invalid) {

      this.orderForm.markAllAsTouched();

      console.log(
        'Formulaire invalide :',
        this.orderForm.value
      );

      return;

    }


    // =========================================================
    // RÉCUPÉRER LE PANIER
    // =========================================================

    const cartItems =
      this.getCartItems();


    console.log(
      'Produits du panier :',
      cartItems
    );


    // =========================================================
    // VÉRIFIER SI LE PANIER EST VIDE
    // =========================================================

    if (cartItems.length === 0) {

      this.errorMessage =
        'Votre panier est vide.';

      console.error(
        'Impossible de créer la commande : panier vide.'
      );

      return;

    }


    this.loading = true;


    // =========================================================
    // VALEURS DU FORMULAIRE
    // =========================================================

    const formValue =
      this.orderForm.value;


    // =========================================================
    // NOM COMPLET
    // =========================================================

    const buyerName =
      `${formValue.firstName} ${formValue.lastName}`.trim();


    // =========================================================
    // CRÉER L'OBJET ORDER
    // =========================================================

    const order: Order = {

      buyerName: buyerName,

      email: formValue.email,

      phone: formValue.phone,

      deliveryAddress: formValue.address,

      state: formValue.governorate,

      city: formValue.city,

      postalCode: formValue.postalCode,

      deliveryInstruction: formValue.notes,

      items: cartItems

    };


    // =========================================================
    // DEBUG
    // =========================================================

    console.log(
      '======================================'
    );

    console.log(
      'ORDER ENVOYÉ À SPRING BOOT'
    );

    console.log(
      JSON.stringify(order, null, 2)
    );

    console.log(
      '======================================'
    );


    // =========================================================
    // ENVOYER LA COMMANDE AU BACKEND
    // =========================================================

    this.orderService
      .createOrder(order)
      .subscribe({

        // ==========================================
        // SUCCÈS
        // ==========================================

        next: (createdOrder) => {

          console.log(
            'Commande créée avec succès :',
            createdOrder
          );


          this.loading = false;


          // ==========================================
          // RÉCUPÉRER ID COMMANDE
          // ==========================================

          this.createdOrderId =
            createdOrder.id;


          // ==========================================
          // VIDER LE PANIER
          // ==========================================

          this.clearCart();


          // ==========================================
          // MESSAGE
          // ==========================================

          this.successMessage =
            `Votre commande #${createdOrder.id} a été créée avec succès.`;


          // ==========================================
          // RÉINITIALISER FORMULAIRE
          // ==========================================

          this.orderForm.reset({

            paymentMethod: 'cash',

            termsAccepted: false

          });


          // ==========================================
          // AFFICHER MODAL
          // ==========================================

          this.showSuccessModal = true;

        },


        // ==========================================
        // ERREUR
        // ==========================================

        error: (error) => {

          console.error(
            'Erreur lors de la création de la commande :',
            error
          );


          console.error(
            'Status HTTP :',
            error?.status
          );


          console.error(
            'Erreur backend :',
            error?.error
          );


          this.loading = false;


          this.errorMessage =
            error?.error?.message ||
            error?.error ||
            'Une erreur est survenue lors de la création de la commande.';

        }

      });

  }


  // =========================================================
  // RÉCUPÉRER LES PRODUITS DU PANIER
  // =========================================================

  private getCartItems(): {
    product: {
      id: number;
    };
    quantity: number;
  }[] {

    const basket =
      sessionStorage.getItem('basket');


    console.log(
      'Basket récupéré depuis sessionStorage :',
      basket
    );


    // ==========================================
    // PANIER INEXISTANT
    // ==========================================

    if (!basket) {

      console.warn(
        'Aucun panier trouvé dans sessionStorage.'
      );

      return [];

    }


    try {

      const parsedBasket =
        JSON.parse(basket);


      console.log(
        'Basket parsé :',
        parsedBasket
      );


      // ==========================================
      // VÉRIFIER TABLEAU
      // ==========================================

      if (!Array.isArray(parsedBasket)) {

        console.error(
          'Le basket n\'est pas un tableau.'
        );

        return [];

      }


      // ==========================================
      // TRANSFORMATION
      // ==========================================

      return parsedBasket

        .map((item: any) => {

          const productId =
            item?.product?.id;


          const quantity =
            Number(item?.quantity);


          // ========================================
          // ITEM INVALIDE
          // ========================================

          if (
            productId === undefined ||
            productId === null ||
            quantity <= 0
          ) {

            console.warn(
              'Produit invalide dans le panier :',
              item
            );

            return null;

          }


          // ========================================
          // FORMAT SPRING BOOT
          // ========================================

          return {

            product: {

              id: Number(productId)

            },

            quantity: quantity

          };

        })

        .filter(
          (item: any) =>
            item !== null
        );

    }

    catch (error) {

      console.error(
        'Erreur lors de la lecture du panier :',
        error
      );

      return [];

    }

  }


  // =========================================================
  // VIDER LE PANIER
  // =========================================================

  private clearCart(): void {

    console.log(
      'Vidage du panier...'
    );


    // ==========================================
    // VIDER LE BASKET DU SERVICE
    // ==========================================

    this.basketService.makeBasketEmpty();


    // ==========================================
    // SÉCURITÉ : SUPPRIMER STORAGE
    // ==========================================

    sessionStorage.removeItem(
      'basket'
    );


    // Si une ancienne version utilisait cart
    localStorage.removeItem(
      'cart'
    );


    console.log(
      'Panier vidé avec succès.'
    );

  }


  // =========================================================
  // FERMER LE MODAL ET RETOUR HOME
  // =========================================================

  closeSuccessModal(): void {

    this.showSuccessModal = false;


    // Redirection vers Home
    this.router.navigate([
      '/home'
    ]);

  }


  // =========================================================
  // VALIDATION DES CHAMPS
  // =========================================================

  isInvalid(
    field: string
  ): boolean {

    const control =
      this.orderForm.get(field);


    return !!(
      control &&
      control.invalid &&
      control.touched
    );

  }

}