import { Injectable, computed, signal } from '@angular/core';
import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesSelectionStateService {
  readonly selectedCategory = signal<Category | null>(null);
  readonly consultedCategoryIds = signal<number[]>([]);

  readonly hasSelectedCategory = computed(() => this.selectedCategory() !== null);

  selectCategory(category: Category): void {
    this.selectedCategory.set(category);
  }

  markSelectedCategoryAsConsulted(): void {
    const category = this.selectedCategory();

    if (!category) {
      return;
    }

    this.consultedCategoryIds.update((ids) => {
      if (ids.includes(category.id)) {
        return ids;
      }

      return [...ids, category.id];
    });
  }

  isCategoryConsulted(categoryId: number): boolean {
    return this.consultedCategoryIds().includes(categoryId);
  }

  clearSelection(): void {
    this.selectedCategory.set(null);
  }
}