import { Component, inject } from '@angular/core';
import { CategoriesSelectionStateService } from '../../../features/categories/services/categories-selection-state/categories-selection-state.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {  
  readonly selectionState = inject(CategoriesSelectionStateService);

  onActionClick(): void {
    const category = this.selectionState.selectedCategory();

    if (!category) {
      return;
    }

    this.selectionState.markSelectedCategoryAsConsulted();
    alert(`Catégorie sélectionnée id ${category.id} : ${category.wording}`);
  }
}
