import { TestBed } from '@angular/core/testing';

import { CategoriesSelectionStateService } from './categories-selection-state.service';

describe('CategoriesSelectionStateService', () => {
  let service: CategoriesSelectionStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesSelectionStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
