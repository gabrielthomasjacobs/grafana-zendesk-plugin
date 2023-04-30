import { MetricFindValue } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { Observable, map } from 'rxjs'
import { ZendeskField, ZendeskFieldQuery } from 'types';

export default class ZendeskMetricFindQuery {
  baseURL; query;
  constructor(query: string, baseURL?: string) {
    this.baseURL = baseURL || '';
    this.query = query;
  }

  fetchFields = (): Observable<ZendeskField[]> => {
    return getBackendSrv()
      .fetch<ZendeskFieldQuery>({
        url: `${this.baseURL}/ticket_fields/`,
        method: 'GET'
      }).pipe(
        map((response) => response.data.ticket_fields)
      )
  };

  matchFields = (fields: ZendeskField[]): ZendeskField[] => {
    // return array of fields that match the query
    // can add more logic here to match on other properties, like description
    let matches = fields.filter(field => {
      const lowerTitle = field.title.toLowerCase();
      const lowerQuery = this.query.replace('^', '').toLowerCase();
      return lowerTitle.includes(lowerQuery)
    })

    // if query starts with ^, only return custom fields
    if(this.query.indexOf('^') === 0) {
      matches = matches.filter(field => Object.keys(field).some(key => key.indexOf('custom_') > -1))
    }

    return matches
  }

  mapFieldToFindValue = (field?: ZendeskField): {options: any[], isCustom: boolean} => {
    if(!field) { return {options: [], isCustom: false} };
    if(field.type === 'tagger') { return ({options: field.custom_field_options || [], isCustom: true})  }
    if(field.type === 'custom_status') { 
      return ({options: field.custom_statuses?.map((v: any) => ({name: v.agent_label, value: v.status_category})) || [], isCustom: false})
    }
    return ({options: field.system_field_options || [], isCustom: false}) || ({options: [], isCustom: false})
  }

  metricFieldQuery = (): Observable<MetricFindValue[]> => {
    return this.fetchFields()
      .pipe(
        map((fields) => this.matchFields(fields)[0]),
        map((field) => this.mapFieldToFindValue(field)),
        map((def) => def.options.map(option => ({text: option.name, value: option.name, isCustom: def.isCustom})))
      );
  }
}
