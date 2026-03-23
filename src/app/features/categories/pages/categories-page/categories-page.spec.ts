import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CategoriesPage } from './categories-page';
import { CategoriesApiService } from '../../services/categories-api/categories-api.service';
import { CategoriesFiltersStateService } from '../../services/categories-filters-state/categories-filters-state.service';
import { CategoriesSelectionStateService } from '../../services/categories-selection-state/categories-selection-state.service';
import { Category } from '../../models/category.model';
import { VisibleCategory } from '../../models/visible-category.model';
import { CategoryGroup } from '../../models/category-group.model';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  template: '',
})
class CategoriesListStubComponent {
  @Input() groupedCategories: unknown[] = [];
  @Input() selectedCategoryId: number | null = null;
  @Input() consultedCategoryIds: number[] = [];
  @Output() categorySelected = new EventEmitter<Category>();
}

@Component({
  selector: 'app-category-card',
  standalone: true,
  template: '',
})
class CategoryCardStubComponent {
  @Input() category!: Category;
  @Input() isAlphabeticalMode = false;
  @Input() selected = false;
  @Input() consulted = false;
  @Output() categorySelected = new EventEmitter<Category>();
}

@Component({
  selector: 'app-categories-filters',
  standalone: true,
  template: '',
})
class CategoriesFiltersStubComponent {
  @Input() searchTerm = '';
  @Input() selectedGroupId: number | null = null;
  @Input() availableGroups: CategoryGroup[] = [];
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() selectedGroupIdChange = new EventEmitter<number | null>();
}

class MockCategoriesApiService {
  getAllCategories() {
    return of([
      {
        id: 2,
        group: {
          id: 1,
          name: 'Recettes de votre activité',
          color: 'm-green',
        },
        wording: 'Recettes encaissées',
        description: "Recettes de l'activité de votre entreprise.",
      },
    ] as Category[]);
  }

  getVisibleCategories() {
    return of([
      {
        id: 2,
        group: {
          id: 1,
          name: 'Recettes de votre activité',
          color: 'm-green',
        },
      },
    ] as VisibleCategory[]);
  }
}

class MockCategoriesFiltersStateService {
  readonly selectedGroupId = signal<number | null>(null);
  readonly sortAlphabetically = signal(false);
  readonly availableGroups = signal<CategoryGroup[]>([]);

  setSelectedGroupId(groupId: number | null): void {
    this.selectedGroupId.set(groupId);
  }

  setAvailableGroups(groups: CategoryGroup[]): void {
    this.availableGroups.set(groups);
  }
}

class MockCategoriesSelectionStateService {
  readonly selectedCategory = signal<Category | null>(null);
  readonly consultedCategoryIds = signal<number[]>([]);

  selectCategory(category: Category): void {
    this.selectedCategory.set(category);
  }

  clearSelection(): void {
    this.selectedCategory.set(null);
  }
}

describe('CategoriesPage', () => {
  let component: CategoriesPage;
  let fixture: ComponentFixture<CategoriesPage>;
  let selectionState: MockCategoriesSelectionStateService;

  const mockCategory: Category = {
    id: 2,
    group: {
      id: 1,
      name: 'Recettes de votre activité',
      color: 'm-green',
    },
    wording: 'Recettes encaissées',
    description: "Recettes de l'activité de votre entreprise.",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesPage],
      providers: [
        { provide: CategoriesApiService, useClass: MockCategoriesApiService },
        { provide: CategoriesFiltersStateService, useClass: MockCategoriesFiltersStateService },
        { provide: CategoriesSelectionStateService, useClass: MockCategoriesSelectionStateService },
      ],
    })
      .overrideComponent(CategoriesPage, {
        set: {
          imports: [
            CategoriesListStubComponent,
            CategoryCardStubComponent,
            CategoriesFiltersStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CategoriesPage);
    component = fixture.componentInstance;
    selectionState = TestBed.inject(
      CategoriesSelectionStateService
    ) as unknown as MockCategoriesSelectionStateService;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    fixture.detectChanges();

    expect(component.allCategories.length).toBe(1);
    expect(component.visibleCategories.length).toBe(1);
    expect(component.filteredCategories.length).toBe(1);
    expect(component.groupedCategories().length).toBe(1);
    expect(component.isLoading()).toBe(false);
  });

  it('should select category', () => {
    component.onCategorySelected(mockCategory);

    expect(selectionState.selectedCategory()).toEqual(mockCategory);
  });
});