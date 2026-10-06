import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Category } from 'src/app/classes/category';

import {
  CategoryService
} from 'src/app/services/category-service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './category-management.html',
  styleUrl: './category-management.scss'
})
export class CategoryManagement implements OnInit {

  // =========================================================
  // DATA
  // =========================================================

  categories: Category[] = [];

  categoryForm!: FormGroup;

  // =========================================================
  // EDITION
  // =========================================================

  isEditing = false;

  selectedCategoryId?: number;

  // =========================================================
  // IMAGE
  // =========================================================

  selectedImage?: File;

  imagePreview?: string;

  // =========================================================
  // LOADING
  // =========================================================

  loading = false;

  // =========================================================
  // MODAL
  // =========================================================

  showModal = false;

  modalType: 'success' | 'error' | 'warning' = 'success';

  modalTitle = '';

  modalMessage = '';

  private modalTimeout?: ReturnType<typeof setTimeout>;

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.initForm();

    this.loadCategories();
  }

  // =========================================================
  // FORM
  // =========================================================

  initForm(): void {

    this.categoryForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ]

    });
  }

  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  loadCategories(): void {

    this.loading = true;

    this.categoryService.getAllCategories().subscribe({

      next: (categories) => {

        this.categories = categories;

        this.loading = false;
      },

      error: (error) => {

        this.loading = false;

        this.showNotification(
          'error',
          'Erreur',
          this.getApiErrorMessage(
            error,
            'Impossible de récupérer les catégories.'
          )
        );
      }

    });
  }

  // =========================================================
  // SELECT IMAGE
  // =========================================================

  onImageSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Vérification du type
    if (!file.type.startsWith('image/')) {

      this.showNotification(
        'warning',
        'Image invalide',
        'Veuillez sélectionner un fichier image.'
      );

      input.value = '';

      return;
    }

    // Taille maximale : 5 MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {

      this.showNotification(
        'warning',
        'Image trop volumineuse',
        'L’image ne doit pas dépasser 5 MB.'
      );

      input.value = '';

      return;
    }

    this.selectedImage = file;

    // Supprimer ancien preview
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview = URL.createObjectURL(file);
  }

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  saveCategory(): void {

    // Vérification formulaire
    if (this.categoryForm.invalid) {

      this.categoryForm.markAllAsTouched();

      this.showNotification(
        'warning',
        'Formulaire incomplet',
        'Veuillez saisir un nom de catégorie valide.'
      );

      return;
    }

    const name =
      this.categoryForm.value.name.trim();

    if (!name) {

      this.showNotification(
        'warning',
        'Nom invalide',
        'Le nom de la catégorie est obligatoire.'
      );

      return;
    }

    this.loading = true;

    // =======================================================
    // UPDATE
    // =======================================================

    if (this.isEditing && this.selectedCategoryId) {

      const category: Category = {
        id: this.selectedCategoryId,
        name: name
      };

      this.categoryService
        .updateCategory(
          this.selectedCategoryId,
          category,
          this.selectedImage
        )
        .subscribe({

          next: (updatedCategory) => {

            const index =
              this.categories.findIndex(
                c => c.id === updatedCategory.id
              );

            if (index !== -1) {

              this.categories[index] =
                updatedCategory;
            }

            this.loading = false;

            this.showNotification(
              'success',
              'Catégorie modifiée',
              `La catégorie « ${updatedCategory.name} » a été modifiée avec succès.`
            );

            this.resetForm();
          },

          error: (error) => {

            this.loading = false;

            this.showNotification(
              'error',
              'Échec de la modification',
              this.getApiErrorMessage(
                error,
                'Impossible de modifier la catégorie.'
              )
            );
          }

        });

      return;
    }

    // =======================================================
    // CREATE
    // =======================================================

    const category: Category = {
      name: name
    };

    this.categoryService
      .createCategory(
        category,
        this.selectedImage
      )
      .subscribe({

        next: (createdCategory) => {

          this.categories.unshift(
            createdCategory
          );

          this.loading = false;

          this.showNotification(
            'success',
            'Catégorie ajoutée',
            `La catégorie « ${createdCategory.name} » a été ajoutée avec succès.`
          );

          this.resetForm();
        },

        error: (error) => {

          this.loading = false;

          this.showNotification(
            'error',
            'Échec de l’ajout',
            this.getApiErrorMessage(
              error,
              'Impossible d’ajouter la catégorie.'
            )
          );
        }

      });
  }

  // =========================================================
  // EDIT CATEGORY
  // =========================================================

  editCategory(category: Category): void {

    this.isEditing = true;

    this.selectedCategoryId =
      category.id;

    this.categoryForm.patchValue({
      name: category.name
    });

    this.selectedImage = undefined;

    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview =
      this.getImageUrl(category.image);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // =========================================================
  // DELETE CATEGORY
  // =========================================================

  deleteCategory(category: Category): void {

    if (!category.id) {
      return;
    }

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la catégorie « ${category.name} » ?`
    );

    if (!confirmed) {
      return;
    }

    this.loading = true;

    this.categoryService
      .deleteCategory(category.id)
      .subscribe({

        next: () => {

          this.categories =
            this.categories.filter(
              c => c.id !== category.id
            );

          this.loading = false;

          this.showNotification(
            'success',
            'Catégorie supprimée',
            `La catégorie « ${category.name} » a été supprimée avec succès.`
          );

          // Si on supprimait la catégorie
          // actuellement en modification
          if (
            this.selectedCategoryId === category.id
          ) {
            this.resetForm();
          }
        },

        error: (error) => {

          this.loading = false;

          this.showNotification(
            'error',
            'Échec de la suppression',
            this.getApiErrorMessage(
              error,
              'Impossible de supprimer la catégorie.'
            )
          );
        }

      });
  }

  // =========================================================
  // RESET FORM
  // =========================================================

  resetForm(): void {

    this.categoryForm.reset();

    this.isEditing = false;

    this.selectedCategoryId = undefined;

    this.selectedImage = undefined;

    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview = undefined;

    const input =
      document.getElementById(
        'categoryImage'
      ) as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
  }

  // =========================================================
  // IMAGE URL
  // =========================================================

  getImageUrl(
    image?: string | null
  ): string {

    if (!image) {
      return 'assets/images/no-image.png';
    }

    // URL externe
    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('blob:')
    ) {
      return image;
    }

    return (
      environment.apiUrl.replace(/\/$/, '') +
      image
    );
  }

  // =========================================================
  // MODAL
  // =========================================================

  showNotification(
    type: 'success' | 'error' | 'warning',
    title: string,
    message: string
  ): void {

    this.modalType = type;

    this.modalTitle = title;

    this.modalMessage = message;

    this.showModal = true;

    if (this.modalTimeout) {
      clearTimeout(this.modalTimeout);
    }

    this.modalTimeout = setTimeout(() => {

      this.closeModal();

    }, 4000);
  }

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  closeModal(): void {

    this.showModal = false;

    if (this.modalTimeout) {

      clearTimeout(
        this.modalTimeout
      );

      this.modalTimeout = undefined;
    }
  }

  // =========================================================
  // API ERROR
  // =========================================================

  getApiErrorMessage(
    error: any,
    defaultMessage: string
  ): string {

    // Serveur inaccessible
    if (error?.status === 0) {

      return 'Impossible de contacter le serveur. Vérifiez que le backend Spring Boot est démarré.';
    }

    // Bad Request
    if (error?.status === 400) {

      return (
        error?.error?.message ||
        error?.error ||
        'Les données envoyées sont invalides.'
      );
    }

    // Unauthorized
    if (error?.status === 401) {

      return 'Votre session a expiré ou vous n’êtes pas authentifié.';
    }

    // Forbidden
    if (error?.status === 403) {

      return 'Vous n’avez pas l’autorisation d’effectuer cette opération.';
    }

    // Not Found
    if (error?.status === 404) {

      return 'La catégorie demandée est introuvable.';
    }

    // Conflict
    if (error?.status === 409) {

      return (
        error?.error?.message ||
        'Une catégorie avec ce nom existe déjà.'
      );
    }

    // Payload too large
    if (error?.status === 413) {

      return 'L’image envoyée est trop volumineuse.';
    }

    // Server error
    if (error?.status >= 500) {

      return (
        error?.error?.message ||
        'Une erreur interne est survenue sur le serveur.'
      );
    }

    return (
      error?.error?.message ||
      error?.error ||
      defaultMessage
    );
  }
}