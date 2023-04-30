import { ScopedVars } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { cloneDeep, random } from 'lodash';
import { formatQuery, formatQueryString } from 'shared/QueryFormatter';
import { ZendeskQuery } from 'types';

export class ZendeskMetricApplyQuery {
  query;
  variables;
  constructor(query: ZendeskQuery, scopedVars?: ScopedVars) {
    this.query = query;    
    this.variables = getTemplateSrv().getVariables();
  }

  asArray<T>(value: any): T[] {
    return Array.isArray(value) ? value : [value];
  }

  getFormattedVariables(): Record<string, string[]> {
    const entries = this.variables.map(
      (v: any) => [v.name, this.asArray(v.current.value)]
    );
    return Object.fromEntries(entries);
  }

  applyTemplateVariables(): ZendeskQuery {
    const updatedQuery = cloneDeep(this.query);
    const formattedVars = this.getFormattedVariables();

    Object.keys(formattedVars).forEach((varName: string) => {
      // don't replace if var has no values.
      if(formattedVars[varName].length === 0) {return}; 

      // delete existing entry if exists
      const filterIndex = (this.query as ZendeskQuery)?.filters.findIndex((f: any) => f.selectedKeyword === varName);
      if(filterIndex > -1) { delete updatedQuery.filters[filterIndex] }

      // add new filter entry
      updatedQuery.filters.push({
        selectedKeyword: varName,
        availableKeywords: [varName],
        operator: ':',
        terms: formattedVars[varName],
        availableTerms: formattedVars[varName],
        uniqueId: random(1000).toString(),
        querystring: formatQuery(varName, ':', formattedVars[varName])
      });
    })

    // update querystring
    updatedQuery.querystring = formatQueryString(updatedQuery.filters);
    return updatedQuery;
  }
}
