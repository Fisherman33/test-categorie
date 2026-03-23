import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { CategoriesApiService } from './categories-api.service';
import { environment } from '../../../../../environments/environment';
import { Category } from '../../models/category.model';
import { VisibleCategory } from '../../models/visible-category.model';

describe('CategoriesApiService', () => {
  let service: CategoriesApiService;
  let httpMock: HttpTestingController;

  const mockCategories: Category[] = [
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
    {
      id: 3,
      group: {
        id: 1,
        name: 'Recettes de votre activité',
        color: 'm-green',
      },
      wording: 'Autres recettes',
      description: null,
    },
  ];

  const mockVisibleCategories: VisibleCategory[] = [
    {
      id: 2,
      group: {
        id: 1,
        name: 'Recettes de votre activité',
        color: 'm-green',
      },
    },
    {
      id: 3,
      group: {
        id: 1,
        name: 'Recettes de votre activité',
        color: 'm-green',
      },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoriesApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CategoriesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /all-categories', () => {
    let response: Category[] | undefined;

    service.getAllCategories().subscribe((data: Category[]) => {
      response = data;
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/all-categories`);

    expect(req.request.method).toBe('GET');

    req.flush(mockCategories);

    expect(response).toEqual(mockCategories);
  });

  it('should call GET /visible-categories', () => {
    let response: VisibleCategory[] | undefined;

    service.getVisibleCategories().subscribe((data: VisibleCategory[]) => {
      response = data;
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/visible-categories`);

    expect(req.request.method).toBe('GET');

    req.flush(mockVisibleCategories);

    expect(response).toEqual(mockVisibleCategories);
  });

  it('should propagate error for getAllCategories', () => {
    let errorResponse: { status: number; statusText: string } | undefined;

    service.getAllCategories().subscribe({
      next: () => {
        throw new Error('should have failed');
      },
      error: (error) => {
        errorResponse = {
          status: error.status,
          statusText: error.statusText,
        };
      },
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/all-categories`);
    req.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(errorResponse).toEqual({
      status: 500,
      statusText: 'Internal Server Error',
    });
  });

  it('should propagate error for getVisibleCategories', () => {
    let errorResponse: unknown;

    service.getVisibleCategories().subscribe({
      next: () => Error('should have failed'),
      error: (error) => {
        errorResponse = error;
      },
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/visible-categories`);

    expect(req.request.method).toBe('GET');

    req.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(errorResponse).toBeTruthy();
  });
});