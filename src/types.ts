import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface ZendeskQuery extends DataQuery {
  status: string[];
  priority: string[];
  tags: string[];
}

export interface ZendeskDatasourceOptions extends DataSourceJsonData {}
