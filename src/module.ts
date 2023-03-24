import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { ZendeskQuery, ZendeskDatasourceOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, ZendeskQuery, ZendeskDatasourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
