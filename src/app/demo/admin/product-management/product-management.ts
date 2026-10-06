
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ProductService } from '../../../services/product-service';
import { Product } from '../../../classes/product';
import { environment } from 'src/environments/environment';
import { CategoryService } from 'src/app/services/category-service';

@Component({
  selector: 'app-product-management',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-management.html',
  styleUrl: './product-management.scss'
})
export class ProductManagementComponent implements OnInit {

  products: Product[] = [];

  categories: any[] = [];

  productForm!: FormGroup;

  isEditing = false;

  selectedProductId?: number;

  selectedImage?: File;
  selectedImage2?: File;
  selectedImage3?: File;

  imagePreview?: string;
  imagePreview2?: string;
  imagePreview3?: string;

  loading = false;
  successMessage=''
  errorMessage=''


  // =====================================================
  // MODAL
  // =====================================================

  showModal = false;

  modalType: 'success' | 'error' | 'warning' = 'success';

  modalTitle = '';

  modalMessage = '';

  private modalTimeout?: ReturnType<typeof setTimeout>;


  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.initForm();

    this.loadProducts();

    this.categoryService
      .getAllCategories()
      .subscribe({
        next: (data) => {
          this.categories =
            Array.isArray(data) ? [...data] : [];
        },

        error: (error) => {
          console.error(
            'Erreur chargement catégories :',
            error
          );

          this.showNotification(
            'error',
            'Chargement impossible',
            this.getApiErrorMessage(
              error,
              'charger les catégories'
            )
          );
        }
      });
  }


  // =====================================================
  // FORM
  // =====================================================

  initForm(): void {

    this.productForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      price: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      originalPrice: [
        0,
        [
          Validators.min(0)
        ]
      ],
      quantity: [
        0,
        [
          Validators.min(0)
        ]
      ],

      description: [
        '',
        Validators.required
      ],

      category: [
        null,
        Validators.required
      ],

      featured: [
        false
      ],

      onSale: [
        false
      ],

      rating: [
        0,
        [
          Validators.min(0),
          Validators.max(5)
        ]
      ]

    });
  }


  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  loadProducts(): void {

    this.loading = true;

    this.productService
      .getAllProducts()
      .subscribe({

        next: (products) => {

          this.products = products;

          this.loading = false;
        },

        error: (error) => {

          console.error(
            'Erreur chargement produits :',
            error
          );

          this.loading = false;

          this.showNotification(
            'error',
            'Chargement impossible',
            this.getApiErrorMessage(
              error,
              'charger la liste des produits'
            )
          );
        }

      });
  }


  // =====================================================
  // IMAGE 1
  // =====================================================

  onImageSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {

      this.selectedImage =
        input.files[0];

      this.imagePreview =
        URL.createObjectURL(
          this.selectedImage
        );
    }
  }


  // =====================================================
  // IMAGE 2
  // =====================================================

  onImage2Selected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {

      this.selectedImage2 =
        input.files[0];

      this.imagePreview2 =
        URL.createObjectURL(
          this.selectedImage2
        );
    }
  }


  // =====================================================
  // IMAGE 3
  // =====================================================

  onImage3Selected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {

      this.selectedImage3 =
        input.files[0];

      this.imagePreview3 =
        URL.createObjectURL(
          this.selectedImage3
        );
    }
  }


  // =====================================================
  // CREATE
  // =====================================================

  createProduct(): void {

    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      this.showNotification(
        'warning',
        'Formulaire incomplet',
        'Impossible d’ajouter le produit. Vérifiez le nom, le prix, la catégorie et la description.'
      );

      return;
    }


    this.loading = true;


    const product =
      this.productForm.value as Product;
      product.category = this.categories.find(
        (cat) => cat.id === product.category
      );


    // Promotion automatique
    if (
      product.originalPrice >
      product.price
    ) {

      product.onSale = true;
      product.featured = true;

    }
    else{
      this.showNotification(
        'warning',
        'Attention',
        `Le prix original du produit ne peut pas être moins que le prix actuel.`
      );
      this.loading=false
      return

    }
    if(!this.selectedImage && !this.selectedImage2 && !this.selectedImage3){
      
      this.showNotification(
        'warning',
        'Attention',
        `Veuillez sélectionner au moins une image du produit.`
      );
      this.loading=false
      return
    }


    this.productService
      .createProduct(
        product,
        this.selectedImage,
        this.selectedImage2,
        this.selectedImage3
      )
      .subscribe({

        next: (newProduct) => {

          this.products.unshift(
            newProduct
          );

          this.loading = false;

          this.resetForm();

          this.showNotification(
            'success',
            'Produit ajouté avec succès',
            `Le produit « ${newProduct.name} » a été ajouté à votre boutique.`
          );
        },


        error: (error) => {

          console.error(
            'Erreur création produit :',
            error
          );

          this.loading = false;

          this.showNotification(
            'error',
            'Échec de l’ajout',
            this.getApiErrorMessage(
              error,
              'ajouter le produit'
            )
          );
        }

      });
  }


  // =====================================================
  // EDIT
  // =====================================================

  editProduct(product: Product): void {

    this.isEditing = true;
  
    this.selectedProductId = product.id;
  
    this.productForm.patchValue({
  
      name: product.name,
  
      price: product.price,
  
      originalPrice: product.originalPrice,
      quantity: product.quantity,
  
      description: product.description,
  
      category: product.category.id,
  
      featured: product.featured,
  
      onSale: product.onSale,
  
      rating: product.rating
  
    });
  
    // Image principale
    if (product.image) {
  
      this.imagePreview =
        this.getImageUrl(product.image);
  
    }
  
    // Image 2
    if (product.image2) {
  
      this.imagePreview2 =
        this.getImageUrl(product.image2);
  
    }
  
    // Image 3
    if (product.image3) {
  
      this.imagePreview3 =
        this.getImageUrl(product.image3);
  
    }
  
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  // =====================================================
  // UPDATE
  // =====================================================

  updateProduct(): void {

    if (
      this.productForm.invalid
    ) {

      this.productForm.markAllAsTouched();

      this.showNotification(
        'warning',
        'Formulaire incomplet',
        'Impossible de modifier le produit. Vérifiez les champs obligatoires.'
      );

      return;
    }


    if (
      this.selectedProductId == null
    ) {

      this.showNotification(
        'error',
        'Modification impossible',
        'Aucun produit valide n’est sélectionné. Sélectionnez à nouveau le produit à modifier.'
      );

      return;
    }


    this.loading = true;


    const product =
      this.productForm.value as Product;
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",product.category)


    if (
      product.originalPrice >
      product.price
    ) {

      product.onSale = true;
      product.featured = true;

    }
    product.category = this.categories.find(
      (cat) => cat.id === product.category
    );


    this.productService
      .updateProduct(
        this.selectedProductId,
        product,
        this.selectedImage,
        this.selectedImage2,
        this.selectedImage3
      )
      .subscribe({

        next: (updatedProduct) => {

          const index =
            this.products.findIndex(
              p =>
                p.id ===
                updatedProduct.id
            );


          if (index !== -1) {

            this.products[index] =
              updatedProduct;

          }


          this.loading = false;

          this.resetForm();


          this.showNotification(
            'success',
            'Modification réussie',
            `Le produit « ${updatedProduct.name} » a été modifié avec succès.`
          );
        },


        error: (error) => {

          console.error(
            'Erreur modification produit :',
            error
          );

          this.loading = false;


          this.showNotification(
            'error',
            'Échec de la modification',
            this.getApiErrorMessage(
              error,
              'modifier le produit'
            )
          );
        }

      });
  }


  // =====================================================
  // DELETE
  // =====================================================

  deleteProduct(
    product: Product
  ): void {

    if (product.id == null) {

      this.showNotification(
        'error',
        'Suppression impossible',
        'Ce produit ne possède pas d’identifiant valide. Actualisez la liste et réessayez.'
      );

      return;
    }


    const confirmed =
      confirm(
        `Voulez-vous vraiment supprimer le produit « ${product.name} » ?`
      );


    if (!confirmed) {

      return;

    }


    this.loading = true;


    this.productService
      .deleteProduct(product.id)
      .subscribe({

        next: () => {

          this.products =
            this.products.filter(
              p =>
                p.id !== product.id
            );


          this.loading = false;


          this.showNotification(
            'success',
            'Suppression réussie',
            `Le produit « ${product.name} » a été supprimé de votre boutique.`
          );
        },


        error: (error) => {

          console.error(
            'Erreur suppression produit :',
            error
          );


          this.loading = false;


          this.showNotification(
            'error',
            'Échec de la suppression',
            this.getApiErrorMessage(
              error,
              'supprimer le produit'
            )
          );
        }

      });
  }


  // =====================================================
  // IMAGE URL
  // =====================================================

  getImageUrl(
    image?: string | null
  ): string {

    if (!image) {

      return 'assets/images/no-image.png';

    }


    // Si l'image est déjà une URL externe
    if (
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {

      return image;

    }


    return environment.apiUrl.replace(
      /\/$/,
      ''
    ) + image;
  }


  // =====================================================
  // MODAL NOTIFICATION
  // =====================================================

  showNotification(
    type:
      | 'success'
      | 'error'
      | 'warning',

    title: string,

    message: string
  ): void {

    // Annuler le précédent timer
    if (this.modalTimeout) {

      clearTimeout(
        this.modalTimeout
      );

    }


    this.modalType = type;

    this.modalTitle = title;

    this.modalMessage = message;

    this.showModal = true;


    // Fermeture automatique après 3 secondes
    
  }


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  closeModal(): void {

    this.showModal = false;


    if (this.modalTimeout) {

      clearTimeout(
        this.modalTimeout
      );

      this.modalTimeout =
        undefined;
    }
  }


  // =====================================================
  // API ERROR MESSAGE
  // =====================================================

  private getApiErrorMessage(
    error: any,
    operation: string
  ): string {

    const backendMessage =
      typeof error?.error === 'string'
        ? error.error
        : error?.error?.message
          || error?.error?.error
          || error?.message;


    switch (error?.status) {

      case 0:

        return 'Impossible de contacter le serveur. Vérifiez votre connexion et assurez-vous que le backend Spring Boot est démarré.';


      case 400:

        return backendMessage
          || `Les données envoyées pour ${operation} sont invalides. Vérifiez les informations saisies.`;


      case 401:

        return 'Votre session a expiré ou vous n’êtes pas authentifié. Veuillez vous reconnecter.';


      case 403:

        return 'Accès refusé. Vous n’avez pas les autorisations nécessaires pour effectuer cette opération.';


      case 404:

        return 'Le produit ou la ressource demandée est introuvable. Actualisez la page et réessayez.';


      case 409:

        return backendMessage
          || 'Cette opération entre en conflit avec des données existantes. Vérifiez les informations du produit.';


      case 413:

        return 'Les images envoyées sont trop volumineuses. Réduisez leur taille puis réessayez.';


      case 500:

        return 'Une erreur interne est survenue sur le serveur. Vérifiez les logs du backend Spring Boot et réessayez.';


      default:

        return backendMessage
          || `Une erreur inattendue est survenue lors de l’opération : ${operation}. Veuillez réessayer.`;
    }
  }


  // =====================================================
  // RESET
  // =====================================================

  resetForm(): void {

    this.productForm.reset({

      name: '',

      price: 0,

      originalPrice: 0,

      description: '',

      category: null,

      featured: false,

      onSale: false,
      quantity: 0,

      rating: 0

    });


    this.isEditing = false;


    this.selectedProductId =
      undefined;


    this.selectedImage =
      undefined;


    this.selectedImage2 =
      undefined;


    this.selectedImage3 =
      undefined;


    this.imagePreview =
      undefined;


    this.imagePreview2 =
      undefined;


    this.imagePreview3 =
      undefined;
  }
}
