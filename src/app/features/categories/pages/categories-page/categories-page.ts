import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { CategoriesApiService } from '../../services/categories-api.service';
import { Category } from '../../models/category.model';
import { VisibleCategory } from '../../models/visible-category.model';
import { CategoryGroup } from '../../models/category-group.model';
import { CategoriesList } from "../../components/categories-list/categories-list";

export interface GroupedCategories {
  group: CategoryGroup | null;
  categories: Category[];
}

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, CategoriesList],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
})
export class CategoriesPage implements OnInit {
  private readonly categoriesApi = inject(CategoriesApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  allCategories: Category[] = [];
  visibleCategories: VisibleCategory[] = [];
  filteredCategories: Category[] = [];
  groupedCategories: GroupedCategories[] = [];

  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.loadCategoriesData();
  }

  private loadCategoriesData(): void {
    forkJoin({
      allCategories: this.categoriesApi.getAllCategories(),
      visibleCategories: this.categoriesApi.getVisibleCategories(),
    }).subscribe({
      next: ({ allCategories, visibleCategories }) => {
        this.allCategories = allCategories;
        this.visibleCategories = visibleCategories;

        this.updateVisibleAndGroupedCategories();

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur chargement catégories:', error);
      },
    });
  }

  private updateVisibleAndGroupedCategories(): void {
    if (!this.allCategories.length || !this.visibleCategories.length) {
      return;
    }

    const visibleIds = new Set(this.visibleCategories.map(category => category.id));

    this.filteredCategories = this.allCategories.filter(category =>
      visibleIds.has(category.id)
    );

    const groupsMap = new Map<number, GroupedCategories>();

    for (const category of this.filteredCategories) {
      const groupId = category.group?.id ?? -1;

      if (!groupsMap.has(groupId)) {
        groupsMap.set(groupId, {
          group: category.group ?? null,
          categories: [],
        });
      }

      groupsMap.get(groupId)?.categories.push(category);
    }

    this.groupedCategories = Array.from(groupsMap.values());
    this.cdr.detectChanges();
  }
}
