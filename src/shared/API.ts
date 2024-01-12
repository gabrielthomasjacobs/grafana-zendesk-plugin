import { getBackendSrv } from '@grafana/runtime';
import { ZendeskField } from 'types';
import { Observable, map } from 'rxjs'

export const fetchFields = (datasourceId: number): Observable<ZendeskField[]> => {

  return getBackendSrv().fetch({
    url: `/api/datasources/uid/${datasourceId}/resources/ticket_fields`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).pipe(
    map((response: any) => response.data.ticket_fields)
  );
};
