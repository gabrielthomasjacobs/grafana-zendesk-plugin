import { QueryVariableModel, ScopedVars } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { cloneDeep } from 'lodash';
import { ZendeskQuery } from 'types';

export class ZendeskMetricApplyQuery {
  query;
  variables;
  scopedVars;
  constructor(query: ZendeskQuery, scopedVars?: ScopedVars) {
    this.query = query;    
    this.variables = getTemplateSrv().getVariables() as QueryVariableModel[];
    this.scopedVars = scopedVars;
  }

  getFormattedVariables(): Record<string, string[]> {
    const entries = this.variables.map(
      (v) => {
        const varName = v.query.value;
        const value = Array.isArray(v.current.value) ? v.current.value : [v.current.value];
        return [varName, value]
      }
    );
    return Object.fromEntries(entries);
  }

  setScopedVars(){
    this.scopedVars ??= {};
    const formattedVars = this.getFormattedVariables();
    const fields  = Object.keys(formattedVars);
    for(let fieldName of fields) {
      this.scopedVars[fieldName] = {
          value: `${formattedVars[fieldName].map(v => `${fieldName}:${v}`).join(' ')}`, 
          text: formattedVars[fieldName]}
    }
  }

  applyTemplateVariables(): ZendeskQuery {
    this.setScopedVars();
    let querystring = this.query.querystring;
    const updatedQuerystring = getTemplateSrv().replace(querystring, this.scopedVars)
    const updatedQuery = cloneDeep(this.query);
    updatedQuery.querystring = updatedQuerystring;
    return updatedQuery;
  }
}
