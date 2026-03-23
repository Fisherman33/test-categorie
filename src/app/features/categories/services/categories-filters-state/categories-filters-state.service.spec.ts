import { TestBed } from '@angular/core/testing';

import { CategoriesFiltersStateService } from './categories-filters-state.service';
import { CategoryGroup } from '../../models/category-group.model';

describe('CategoriesFiltersStateService', () => {
  let service: CategoriesFiltersStateService;

  const mockGroups: CategoryGroup[] = [
    {
      id: 1,
      name: 'Recettes de votre activité',
      color: 'm-green',
    },
    {
      id: 2,
      name: 'Charges',
      color: 'm-red',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesFiltersStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.selectedGroupId()).toBeNull();
    expect(service.sortAlphabetically()).toBe(false);
    expect(service.availableGroups()).toEqual([]);
  });

  it('should set selectedGroupId', () => {
    service.setSelectedGroupId(2);

    expect(service.selectedGroupId()).toBe(2);
  });

  it('should set selectedGroupId to null', () => {
    service.setSelectedGroupId(1);
    service.setSelectedGroupId(null);

    expect(service.selectedGroupId()).toBeNull();
  });

  it('should set available groups', () => {
    service.setAvailableGroups(mockGroups);

    expect(service.availableGroups()).toEqual(mockGroups);
  });

  it('should set grouped mode', () => {
    service.setAlphabeticalMode();

    expect(service.sortAlphabetically()).toBe(true);

    service.setGroupedMode();

    expect(service.sortAlphabetically()).toBe(false);
  });

  it('should set alphabetical mode', () => {
    service.setAlphabeticalMode();

    expect(service.sortAlphabetically()).toBe(true);
  });
});