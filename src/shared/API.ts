import { getBackendSrv } from '@grafana/runtime';
import { ZendeskField } from 'types';
import { Observable, map } from 'rxjs'

export const fetchFields = (datasourceUID: string): Observable<ZendeskField[]> => {
  return getBackendSrv().fetch({
    url: `/api/datasources/uid/${datasourceUID}/resources/ticket_fields`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).pipe(
    map((response: any) => response.data.ticket_fields)
  );
};
