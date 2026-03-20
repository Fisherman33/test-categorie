import { Component, input } from '@angular/core';
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
}
