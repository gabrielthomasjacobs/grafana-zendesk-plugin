import { ScopedVars } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { cloneDeep, random } from 'lodash';
import { formatQuery, formatQueryString } from 'shared/QueryFormatter';
import { ZendeskQuery } from 'types';

export class ZendeskMetricApplyQuery {
  query;
  variables;
  baseURL;
  constructor(query: ZendeskQuery, scopedVars?: ScopedVars, baseURL?: string) {
    this.query = query;    
    this.variables = getTemplateSrv().getVariables();
    this.baseURL = baseURL || '';
  }

  getFormattedVariables(): Record<string, string[]> {
    const entries = this.variables.map(
      (v: any) => {
        const varName = v.query;
        const value = Array.isArray(v.current.value) ? v.current.value : [v.current.value];
        return [varName, value]
      }
    );
    return Object.fromEntries(entries);
  }

  updateQuery(query: ZendeskQuery, formattedVars: Record<string, string[]>): ZendeskQuery {
    const fields  = Object.keys(formattedVars);
    for(let fieldName of fields) {
      if(formattedVars[fieldName].length === 0) {return query}; 
      const filterIndex = (this.query as ZendeskQuery)?.filters.findIndex((f: any) => f.selectedKeyword === fieldName);
      if(filterIndex > -1) { delete query.filters[filterIndex] }
      if(fieldName.indexOf('^') === 0) {
        // if query starts with ^, reformat varName to use format "custom_field_{id}"
        const prevFieldName = fieldName;
        const storedFieldDefinition = window.sessionStorage.getItem(`zendesk_field_${fieldName.replace('^', '')}`);
        const field = JSON.parse(storedFieldDefinition || '{}');
        if(!field || !field.id) { return query };

        // special case for "custom status" field, which uses default syntax
        if(field.type === 'custom_status') {
          fieldName = 'status';
          formattedVars[fieldName] = formattedVars[prevFieldName];
        } else {
          fieldName = `custom_field_${field.id}`;
          formattedVars[fieldName] = formattedVars[prevFieldName];
        }
      }

      query.filters.push({
        selectedKeyword: fieldName,
        availableKeywords: [fieldName],
        operator: ':',
        terms: formattedVars[fieldName],
        availableTerms: formattedVars[fieldName],
        uniqueId: random(1000).toString(),
        querystring: formatQuery(fieldName, ':', formattedVars[fieldName])
      });
    }
    query.querystring = formatQueryString(query.filters);
    return query;
  }

  applyTemplateVariables(): ZendeskQuery {
    const formattedVars = this.getFormattedVariables();
    const clonedQuery = cloneDeep(this.query);
    const updatedQuery = this.updateQuery(clonedQuery, formattedVars);
    return updatedQuery;
  }
}
