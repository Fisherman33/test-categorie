import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupedCategories } from '../../pages/categories-page/categories-page';
import { CategoryCard } from "../category-card/category-card";
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories-list',
  standalone:true,
  imports: [CommonModule, CategoryCard],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.scss',
})
export class CategoriesList {
  readonly groupedCategories = input<GroupedCategories[]>([]);
  readonly selectedCategoryId = input<number | null>(null);
  readonly consultedCategoryIds = input<number[]>([]);

  readonly categorySelected = output<Category>();

  onCategorySelected(category: Category): void {
    this.categorySelected.emit(category);
  }
}
