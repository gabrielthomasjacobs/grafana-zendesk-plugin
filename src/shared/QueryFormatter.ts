import { QueryOperator } from 'types';

export function formatQuery(field: string, operator: QueryOperator, values: string[]){
  const shouldNegate = operator === '-';
  if(shouldNegate) { operator = ':' };
  let queryString = values.map(v => 
      `${shouldNegate ? '-':''}${field}${operator}${v}`
    ).join(' ');
  return queryString;
}
