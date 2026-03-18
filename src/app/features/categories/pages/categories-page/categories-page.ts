import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesApiService } from '../../services/categories-api';
import { Category } from '../../models/categoy.model';
import { VisibleCategory } from '../../models/visible-category.model';

@Component({
  selector: 'app-categories-page',
  imports: [CommonModule],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
})
export class CategoriesPage implements OnInit {
  private readonly categoriesApi = inject(CategoriesApiService);

  allCategories: Category[] = [];
  visibleCategories: VisibleCategory[] = [];

  ngOnInit(): void {
    this.loadAllCategories();
    this.loadVisibleCategories();
  }

  private loadAllCategories(): void {
    this.categoriesApi.getAllCategories().subscribe({
      next: (data) => {
        this.allCategories = data;
        console.log('All categories:', this.allCategories);
      },
      error: (error) => {
        console.error('Erreur getAllCategories:', error);
      },
    });
  }

  private loadVisibleCategories(): void {
    this.categoriesApi.getVisibleCategories().subscribe({
      next: (data) => {
        this.visibleCategories = data;
        console.log('Visible categories:', this.visibleCategories);
      },
      error: (error) => {
        console.error('Erreur getVisibleCategories:', error);
      },
    });
  }
}
