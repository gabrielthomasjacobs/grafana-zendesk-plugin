import { QueryOperator } from 'types';

/**
 * Formats inputs into Zendesk query string format
 * 
 * @param
 * field the field to query. Internal fields should simply be the field name `status`. Custom fields should start with `custom_field_`, followedd by the ID of the field `custom_field_1234`.  
 * @param
 * operator one of: ':', '>', '<', '>=', '<=', '!=', '-'
 * @param
 * values the search terms to be used in the query
 * 
 * @returns
 * a string in the format of Zendesk query string.
 * If one or more of the values is a variable, will return ``$${field}``
 * 
 * @example
 * formatQuery('status', ':', ['new', 'open', 'pending']) // returns 'status:new status:open status:pending'
 * 
 * @example
 * formatQuery('custom_field_1234', ':', ['$someValue']) // returns '$custom_field_1234'
 **/ 

export function formatQuery(field: string, operator: QueryOperator, values: string[] | undefined){
  if(!values || values.length === 0) { return '' };
  const shouldNegate = operator === '-';
  if(shouldNegate) { operator = ':' };
  if(values.find(v => v.indexOf('$') === 0)) {
    // if any of the values are a variable, simply return $field
    return `$${field}`
  }
  let queryString = values.map(v => 
      `${shouldNegate ? '-':''}${field}${operator}${v}`
    ).join(' ');
  return queryString;
}
