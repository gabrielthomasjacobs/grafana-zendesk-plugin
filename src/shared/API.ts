import { getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { ZendeskField, ZendeskFieldQuery } from 'types';
import { Observable, map } from 'rxjs'

export const fetchFields = (): Observable<ZendeskField[]> => {
  const baseUrl = getDataSourceSrv().getInstanceSettings('Zendesk Datasource Plugin')?.url || '';
  return getBackendSrv()
    .fetch<ZendeskFieldQuery>({
      url: `${baseUrl}/ticket_fields/`,
      method: 'GET'
    }).pipe(
      map((response) => response.data.ticket_fields)
    )
};
