import { SelectableQueryRow } from 'types';

export function isFilterValid(filter: SelectableQueryRow | undefined): boolean {
  return filter !== undefined &&
        filter.selectedKeyword !== undefined && 
        filter.selectedKeyword.trim() !== '' && 
        filter.terms.length > 0;
}
