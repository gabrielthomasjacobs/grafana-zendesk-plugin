import { QueryOperator, SelectableQueryRow } from 'types';
import { isFilterValid } from './Validator';
import { formatFieldnameForQuery } from './FieldUtils';

export function formatQuery(field: string, operator: QueryOperator, values: string[] | undefined){
  if(!values || values.length === 0) { return '' };
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
    .map(f => {
      const fieldName = formatFieldnameForQuery(f.selectedField);
      if(!fieldName) { return '' };
      return formatQuery(fieldName, f.operator, f.terms)
    })
    .join(' ');
  return queryString;
}
