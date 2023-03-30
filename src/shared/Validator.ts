import { SelectableQueryRow } from 'types';

export function isFilterValid(filter: SelectableQueryRow): boolean {
  return filter.selectedKeyword !== undefined && 
          filter.selectedKeyword.trim() !== '' && 
          filter.terms.length > 0;
}
