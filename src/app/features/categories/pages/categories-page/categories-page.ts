import { ChangeDetectorRef, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { CategoriesApiService } from '../../services/categories-api/categories-api.service';
import { Category } from '../../models/category.model';
import { VisibleCategory } from '../../models/visible-category.model';
import { CategoryGroup } from '../../models/category-group.model';
import { CategoriesList } from "../../components/categories-list/categories-list";
import { CategoriesFiltersStateService } from '../../services/categories-filters-state/categories-filters-state.service';
import { CategoryCard } from "../../components/category-card/category-card";
import { CategoriesFilters } from "../../components/categories-filters/categories-filters";
import { CategoriesSelectionStateService } from '../../services/categories-selection-state/categories-selection-state.service';

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
  readonly selectionState = inject(CategoriesSelectionStateService);

  allCategories: Category[] = [];
  visibleCategories: VisibleCategory[] = [];
  filteredCategories: Category[] = [];

  // Données groupées par groupe de catégorie
  readonly groupedCategories = signal<GroupedCategories[]>([]);

  // Valeur de recherche saisie par l'utilisateur
  readonly searchTerm = signal('');

  // Données affichées selon les filtres actifs
  readonly displayedGroupedCategories = signal<GroupedCategories[]>([]);

  // Liste utilisée pour l'affichage alphabétique
  readonly alphabeticalCategories = signal<Category[]>([]);

  readonly selectedCategory = signal<Category | null>(null);
  readonly isLoading = signal(true);

  // Liste des groupes disponibles pour le filtre
  readonly availableGroups = computed(() =>
    this.groupedCategories()
      .map((groupBlock: GroupedCategories) => groupBlock.group)
      .filter((group: CategoryGroup | null): group is CategoryGroup => group !== null)
  );

  // Réapplique les filtres quand le mode d'affichage change
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

  // Charge toutes les catégories + les catégories visibles
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

  // Garde uniquement les catégories visibles puis les regroupe
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

  // Mise à jour de la recherche texte
  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
    this.applyFilters();
  }

  // Mise à jour du groupe sélectionné
  onSelectedGroupChange(groupId: number | null): void {
    this.filtersState.setSelectedGroupId(groupId);
    this.applyFilters();
  }

  // Applique les filtres puis prépare l'affichage
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

    const visibleCategoryIds = filteredGroups
      .flatMap((groupBlock: GroupedCategories) => groupBlock.categories)
      .map((category: Category) => category.id);

    const selectedCategory = this.selectionState.selectedCategory();

    // Si la catégorie sélectionnée n'est plus visible après filtrage, on la désélectionne
    if (selectedCategory && !visibleCategoryIds.includes(selectedCategory.id)) {
      this.selectionState.clearSelection();
    }

    // Prépare une liste triée pour le mode alphabétique
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

  // Sélection d'une catégorie
  onCategorySelected(category: Category): void {
    this.selectionState.selectCategory(category);
  }
}