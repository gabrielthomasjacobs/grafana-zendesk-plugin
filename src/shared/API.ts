import { getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { ZendeskField } from 'types';
import { Observable, map } from 'rxjs'

export const fetchFields = (): Observable<ZendeskField[]> => {
  const id = getDataSourceSrv().getInstanceSettings('Zendesk Datasource Plugin')?.id;

  return getBackendSrv().fetch({
    url: `/api/datasources/${id}/resources/ticket_fields`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).pipe(
    map((response: any) => response.data.ticket_fields)
  );
};
