import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss',
})
export class CategoryCard {
    readonly category = input.required<Category>();
    readonly isAlphabeticalMode = input(false);
    readonly selected = input(false);
    readonly consulted = input(false);

    readonly categorySelected = output<Category>();

    onSelect(): void {
      this.categorySelected.emit(this.category());
    }
}
