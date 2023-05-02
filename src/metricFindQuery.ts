import { MetricFindValue, SelectableValue } from '@grafana/data';
import { Observable, map } from 'rxjs'
import { fetchFields } from 'shared/API';
import { isFieldCustom } from 'shared/FieldUtils';
import { ZendeskField} from 'types';

export default class ZendeskMetricFindQuery {
  query;
  constructor(query: SelectableValue) {
    this.query = query;
  }

  matchField = (fields: ZendeskField[]): ZendeskField => {
    let matches = fields
      .filter(field => field.system_field_options || isFieldCustom(field))
      .filter(field => {
        if(this.query.value.includes('custom_field_')) {
          const id = this.query.value.replace('custom_field_', '');
          return field.id === parseInt(id, 10);
        }
        if(this.query.value === 'status') {
          return field.type === 'custom_status' || field.title.toLowerCase() === this.query.value.toLowerCase();
        }
        return field.title.toLowerCase() === this.query.value.toLowerCase();
      })
    if(matches.length > 1) {
      return matches.filter(field => field.title === this.query.label)[0];
    }
    return matches[0];
  }

  mapFieldToFindValue = (field?: ZendeskField): {options: any[]} => {
    if(!field) { return {options: []} };
    if(field.type === 'tagger') { return ({options: field.custom_field_options || []})  }
    if(field.type === 'custom_status') { 
      return ({options: field.custom_statuses?.map((v: any) => ({name: v.agent_label, value: v.status_category})) || []})
    }
    return ({options: field.system_field_options || []}) || ({options: []})
  }

  metricFieldQuery = (): Observable<MetricFindValue[]> => {
    return fetchFields()
      .pipe(
        map(fields => this.matchField(fields)),
        map(field => this.mapFieldToFindValue(field)),
        map(def => def.options.map(option => ({text: option.name, value: option.value || option.name})))
      );
  }
}
