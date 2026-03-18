import { CategoryGroup } from './category-group.model';

export interface Category {
  id: number;
  group?: CategoryGroup;
  wording: string;
  description: string | null;
}