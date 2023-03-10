import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  status: string[];
}

export interface MyDataSourceOptions extends DataSourceJsonData {}
