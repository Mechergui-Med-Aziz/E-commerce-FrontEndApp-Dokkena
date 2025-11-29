import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { PaymentService } from 'src/app/services/payment-service';
import { FormsModule } from '@angular/forms';
import { BasketService } from 'src/app/services/basket-service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.scss']
})
export class Payment implements OnInit {

  elements!: StripeElements;
  card!: StripeCardElement;

  nameOnCard: string = '';
  amount: number;

  loading = false;
  messageType: string;
  messageText: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  showMessage: boolean = false;
  cardComplete = false;


  constructor(private paymentService: PaymentService,private route:ActivatedRoute,private router:Router,private basketService:BasketService) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.amount = params['total'];
      console.log("Amount for payment:", params['total']);
    });
  
    const stripe = await this.paymentService.stripePromise;
    this.elements = stripe!.elements();
    this.card = this.elements.create('card', { hidePostalCode: true });
    this.card.mount('#card-element');
  
    this.card.on('change', event => {
      this.errorMessage = event.error ? event.error.message! : '';
      console.log(this.errorMessage);
      this.cardComplete = event.complete; // ⬅️ ici on récupère si la carte est complétée
    });
  }
  

  async pay() {
    if (!this.nameOnCard) {
      this.errorMessage = "Veuillez saisir le nom sur la carte.";
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const stripe = await this.paymentService.stripePromise;

    this.paymentService.createPaymentIntent(this.amount).subscribe(
      async data => {
        const clientSecret = data.clientSecret;

        const result = await stripe!.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.card,
            billing_details: { name: this.nameOnCard }
          }
        });

        if (result.error) {
          this.messageType = 'error';
          this.messageText = `❌ Votre Carte a été refusée : Veuillez vérifier les informations de votre carte et réessayer.`;
          //this.messageText = result.error.message!;
          console.log("Payment error:", result.error.message);
        } else if (result.paymentIntent?.status === 'succeeded') {
          this.basketService.makeBasketEmpty();
          this.messageType = 'success';
          this.messageText = `🎉 Paiement de ${this.amount} DT réussi !`;

        }
        this.showMessage=true;
        this.loading = false;
      },
      () => {
        this.messageText = "Erreur côté serveur.";
        this.messageType = 'error';
        this.loading = false;
      }
    );
  }

  closePaymentModal(){
    if(this.messageType==='success'){
      this.messageText="";
      this.router.navigate(['/home']);
    }else{
      this.showMessage=false;
      this.messageText="";
    }
    this.showMessage=false;
  }

}
