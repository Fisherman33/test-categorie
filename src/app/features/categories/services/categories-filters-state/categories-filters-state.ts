import { Injectable, signal } from '@angular/core';
import { CategoryGroup } from '../../models/category-group.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesFiltersStateService {
  readonly selectedGroupId = signal<number | null>(null);
  readonly sortAlphabetically = signal(false);
  readonly availableGroups = signal<CategoryGroup[]>([]);

  setSelectedGroupId(groupId: number | null): void {
    this.selectedGroupId.set(groupId);
  }

  setAvailableGroups(groups: CategoryGroup[]): void {
    this.availableGroups.set(groups);
  }

  setGroupedMode(): void {
    this.sortAlphabetically.set(false);
  }

  setAlphabeticalMode(): void {
    this.sortAlphabetically.set(true);
  }
}