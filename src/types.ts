import { DataQuery, DataSourceJsonData, QueryEditorProps } from '@grafana/data';
import { DataSource } from 'datasource';

export interface ZendeskQuery extends DataQuery {
  status: { [key: string]: boolean; };
  priority: { [key: string]: boolean; }
  tags: string[];
}

export const defaultQuery: Pick<ZendeskQuery, "status" | "priority" | "tags"> = {
  status: { new: true, open: true, pending: true, hold: true, solved: true },
  priority: { low: true, normal: true, high: true, urgent: true },
  tags: [],
}

export type ZendeskQueryEditorProps = QueryEditorProps<DataSource, ZendeskQuery, ZendeskDatasourceOptions>;

export interface ZendeskDatasourceOptions extends DataSourceJsonData {}
