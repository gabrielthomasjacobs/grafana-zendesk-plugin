import { CoreApp, DataSourceInstanceSettings, MetricFindValue, ScopedVars } from '@grafana/data';
import { ZendeskQuery, ZendeskDatasourceOptions } from './types';
import { DataSourceWithBackend, getTemplateSrv } from '@grafana/runtime';
import { random } from 'lodash';
import { formatQueryString } from 'shared/QueryFormatter';

export class DataSource extends DataSourceWithBackend<ZendeskQuery, ZendeskDatasourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<ZendeskDatasourceOptions>) {
    super(instanceSettings);
    this.query = this.query.bind(this);
  }

  templateSrv = getTemplateSrv();

  async metricFindQuery(query: ZendeskQuery, options?: any): Promise<MetricFindValue[]> {
    if(query.filters.length < 1) {return Promise.resolve([])};
    const terms = query.filters[0].availableTerms || [];
    return Promise.resolve(terms.map(t => ({text: t, value: t})));
  }

  applyTemplateVariables(query: ZendeskQuery, scopedVars: ScopedVars): Record<string, any> {
    const updatedQuery = {...query};
    const variables = this.templateSrv.getVariables();
    const updates: Record<string, string[]> = {}

    variables.forEach((v: any) => {
      const filter = (v.query as ZendeskQuery)?.filters?.[0] || undefined;
      if(!filter) {return};
      const selectedTerms = v.options
        .filter((o: {text: string, value: string, selected: boolean}) => o.selected)
        .map((o: {text: string, value: string, selected: boolean}) => o.value);
      if(selectedTerms.length === 0) {return};
      const selectedKeyword = filter.selectedKeyword;
      if(selectedTerms.length > 0) {
        updates[selectedKeyword] = selectedTerms
      };
    })

    Object.keys(updates).forEach((k: string) => {
      const filter = updatedQuery.filters.find((f: any) => f.selectedKeyword === k);
      if(filter) {
        filter.terms = updates[k];
      } else {
        updatedQuery.filters.push({
          selectedKeyword: k, 
          availableKeywords: [k],
          availableTerms: updates[k],
          terms: updates[k],
          operator: ':',
          uniqueId: random(1000).toString(),
          querystring: ''
        });
      }
    });    
    updatedQuery.querystring = formatQueryString(query.filters);
    return updatedQuery;
  }

  getDefaultQuery(app: CoreApp): Partial<ZendeskQuery> {
    return {querystring: '', filters: []};
  }
}
