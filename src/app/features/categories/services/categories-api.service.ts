import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Category } from '../models/category.model';
import { VisibleCategory } from '../models/visible-category.model';


@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiBaseUrl}/all-categories`);
  }

  getVisibleCategories(): Observable<VisibleCategory[]> {
    return this.http.get<VisibleCategory[]>(`${this.apiBaseUrl}/visible-categories`);
  }
}
