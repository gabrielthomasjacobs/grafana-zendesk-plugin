import { getBackendSrv } from '@grafana/runtime';
import { ZendeskField, ZendeskFieldQuery } from 'types';
import { Observable, map } from 'rxjs'

const storeField = (field: ZendeskField) => {
  // store fields in local storage
  // workaround to share field metadata between metricFindQuery and metricApplyQuery
  window.sessionStorage.setItem(`zendesk_field_${field.title}`, JSON.stringify(field));
}

export const fetchFields = (baseURL: string): Observable<ZendeskField[]> => {
  return getBackendSrv()
    .fetch<ZendeskFieldQuery>({
      url: `${baseURL}/ticket_fields/`,
      method: 'GET'
    }).pipe(
      map((response) => response.data.ticket_fields),
      map(fields => fields.map(field => {storeField(field); return field}))
    )
};
