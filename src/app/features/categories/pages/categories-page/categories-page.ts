import { ChangeDetectorRef, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { CategoriesApiService } from '../../services/categories-api/categories-api.service';
import { Category } from '../../models/category.model';
import { VisibleCategory } from '../../models/visible-category.model';
import { CategoryGroup } from '../../models/category-group.model';
import { CategoriesList } from "../../components/categories-list/categories-list";
import { CategoriesFiltersStateService } from '../../services/categories-filters-state/categories-filters-state';
import { CategoryCard } from "../../components/category-card/category-card";
import { CategoriesFilters } from "../../components/categories-filters/categories-filters";

export interface GroupedCategories {
  group: CategoryGroup | null;
  categories: Category[];
}

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, CategoriesList, CategoryCard, CategoriesFilters],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
})
export class CategoriesPage implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly categoriesApi = inject(CategoriesApiService);
  public readonly filtersState = inject(CategoriesFiltersStateService);

  allCategories: Category[] = [];
  visibleCategories: VisibleCategory[] = [];
  filteredCategories: Category[] = [];

  readonly groupedCategories = signal<GroupedCategories[]>([]);
  readonly searchTerm = signal('');
  readonly displayedGroupedCategories = signal<GroupedCategories[]>([]);
  readonly alphabeticalCategories = signal<Category[]>([]);
  readonly isLoading = signal(true);

  readonly availableGroups = computed(() =>
    this.groupedCategories()
      .map((groupBlock: GroupedCategories) => groupBlock.group)
      .filter((group: CategoryGroup | null): group is CategoryGroup => group !== null)
  );

  private readonly filtersEffect = effect(() => {
    this.filtersState.sortAlphabetically();

    if (this.groupedCategories().length) {
      this.applyFilters();
      this.cdr.detectChanges();
    }
  });

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

    this.groupedCategories.set(Array.from(groupsMap.values()));
    this.filtersState.setAvailableGroups(this.availableGroups());
    this.applyFilters();
    this.cdr.detectChanges();
  }

  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
    this.applyFilters();
  }

  onSelectedGroupChange(groupId: number | null): void {
    this.filtersState.setSelectedGroupId(groupId);
    this.applyFilters();
  }

  private applyFilters(): void {
    const search = this.searchTerm().trim().toLowerCase();
    const selectedGroupId = this.filtersState.selectedGroupId();
    const sortAlphabetically = this.filtersState.sortAlphabetically();

    const filteredGroups = this.groupedCategories()
      .map((groupBlock: GroupedCategories) => {
        const filteredCategories = groupBlock.categories.filter((category: Category) => {
          const matchesSearch =
            !search || category.wording.toLowerCase().includes(search);

          const matchesGroup =
            selectedGroupId === null || groupBlock.group?.id === selectedGroupId;

          return matchesSearch && matchesGroup;
        });

        return {
          ...groupBlock,
          categories: filteredCategories,
        };
      })
      .filter((groupBlock: GroupedCategories) => groupBlock.categories.length > 0);

    this.displayedGroupedCategories.set(filteredGroups);

    if (sortAlphabetically) {
      const flatCategories = filteredGroups
        .flatMap((groupBlock: GroupedCategories) => groupBlock.categories)
        .sort((a: Category, b: Category) =>
          a.wording.localeCompare(b.wording, 'fr', { sensitivity: 'base' })
        );

      this.alphabeticalCategories.set(flatCategories);
    } else {
      this.alphabeticalCategories.set([]);
    }
  }
}
