import { SelectableQueryRow } from 'types';

export function isFilterValid(filter: SelectableQueryRow | undefined): boolean {
  return filter !== undefined &&
        filter.selectedField !== undefined && 
        filter.terms.length > 0;
}
