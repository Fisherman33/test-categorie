import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupedCategories } from '../../pages/categories-page/categories-page';
import { CategoryCard } from "../category-card/category-card";

@Component({
  selector: 'app-categories-list',
  standalone:true,
  imports: [CommonModule, CategoryCard],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.scss',
})
export class CategoriesList {
  readonly groupedCategories = input<GroupedCategories[]>([]);
}
