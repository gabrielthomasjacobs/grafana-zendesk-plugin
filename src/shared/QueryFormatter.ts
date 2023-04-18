import { QueryOperator, SelectableQueryRow } from 'types';
import { isFilterValid } from './Validator';

export function formatQuery(field: string, operator: QueryOperator, values: string[]){
  const shouldNegate = operator === '-';
  if(shouldNegate) { operator = ':' };
  let queryString = values.map(v => 
      `${shouldNegate ? '-':''}${field}${operator}${v}`
    ).join(' ');
  return queryString;
}

export function formatQueryString(filters: SelectableQueryRow[]){
  const queryString = filters
    .filter(f => isFilterValid(f))
    .map(f => formatQuery(f.selectedKeyword, f.operator, f.terms))
    .join(' ');
  return queryString;
}
