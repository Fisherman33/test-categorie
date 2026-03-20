import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryGroup } from '../../models/category-group.model';

@Component({
  selector: 'app-categories-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-filters.html',
  styleUrl: './categories-filters.scss',
})
export class CategoriesFilters {
  readonly searchTerm = input('');
  readonly selectedGroupId = input<number | null>(null);
  readonly availableGroups = input<CategoryGroup[]>([]);

  readonly searchTermChange = output<string>();
  readonly selectedGroupIdChange = output<number | null>();

  onSearch(value: string): void {
    this.searchTermChange.emit(value);
  }

  onGroupChange(value: string): void {
    this.selectedGroupIdChange.emit(value ? Number(value) : null);
  }
}
