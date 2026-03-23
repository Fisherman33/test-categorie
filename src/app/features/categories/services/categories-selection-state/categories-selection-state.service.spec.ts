import { TestBed } from '@angular/core/testing';

import { CategoriesSelectionStateService } from './categories-selection-state.service';
import { Category } from '../../models/category.model';
import { CategoryGroup } from '../../models/category-group.model';

describe('CategoriesSelectionStateService', () => {
  let service: CategoriesSelectionStateService;

  const mockGroup: CategoryGroup = {
    id: 1,
    name: 'Recettes de votre activité',
    color: 'm-green',
  };

  const mockCategory: Category = {
    id: 2,
    group: mockGroup,
    wording: 'Recettes encaissées',
    description: "Recettes de l'activité de votre entreprise.",
  };

  const otherCategory: Category = {
    id: 3,
    group: mockGroup,
    wording: 'Autres recettes',
    description: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesSelectionStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.selectedCategory()).toBeNull();
    expect(service.consultedCategoryIds()).toEqual([]);
    expect(service.hasSelectedCategory()).toBe(false);
  });

  it('should select a category', () => {
    service.selectCategory(mockCategory);

    expect(service.selectedCategory()).toEqual(mockCategory);
    expect(service.hasSelectedCategory()).toBe(true);
  });

  it('should clear selection', () => {
    service.selectCategory(mockCategory);

    expect(service.hasSelectedCategory()).toBe(true);

    service.clearSelection();

    expect(service.selectedCategory()).toBeNull();
    expect(service.hasSelectedCategory()).toBe(false);
  });

  it('should mark selected category as consulted', () => {
    service.selectCategory(mockCategory);
    service.markSelectedCategoryAsConsulted();

    expect(service.consultedCategoryIds()).toEqual([2]);
    expect(service.isCategoryConsulted(2)).toBe(true);
  });

  it('should not add duplicate consulted category ids', () => {
    service.selectCategory(mockCategory);
    service.markSelectedCategoryAsConsulted();
    service.markSelectedCategoryAsConsulted();

    expect(service.consultedCategoryIds()).toEqual([2]);
  });

  it('should do nothing when marking consulted without selected category', () => {
    service.markSelectedCategoryAsConsulted();

    expect(service.consultedCategoryIds()).toEqual([]);
  });

  it('should return true when category is consulted', () => {
    service.selectCategory(mockCategory);
    service.markSelectedCategoryAsConsulted();

    expect(service.isCategoryConsulted(2)).toBe(true);
  });

  it('should return false when category is not consulted', () => {
    service.selectCategory(mockCategory);
    service.markSelectedCategoryAsConsulted();

    expect(service.isCategoryConsulted(3)).toBe(false);
  });

  it('should keep consulted ids after changing selected category', () => {
    service.selectCategory(mockCategory);
    service.markSelectedCategoryAsConsulted();

    service.selectCategory(otherCategory);

    expect(service.selectedCategory()).toEqual(otherCategory);
    expect(service.consultedCategoryIds()).toEqual([2]);
    expect(service.isCategoryConsulted(2)).toBe(true);
    expect(service.isCategoryConsulted(3)).toBe(false);
  });

  it('should add multiple different consulted category ids', () => {
    service.selectCategory(mockCategory);
    service.markSelectedCategoryAsConsulted();

    service.selectCategory(otherCategory);
    service.markSelectedCategoryAsConsulted();

    expect(service.consultedCategoryIds()).toEqual([2, 3]);
  });
});