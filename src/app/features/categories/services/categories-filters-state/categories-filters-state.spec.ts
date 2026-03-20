import { TestBed } from '@angular/core/testing';

import { CategoriesFiltersStateService } from './categories-filters-state';

describe('CategoriesFiltersState', () => {
  let service: CategoriesFiltersStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesFiltersStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
