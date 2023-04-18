import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './views/QueryEditor';
import { ZendeskQuery, ZendeskDatasourceOptions } from './types';
import { VariableQueryEditor } from 'components/VariableQueryEditor';

export const plugin = new DataSourcePlugin<DataSource, ZendeskQuery, ZendeskDatasourceOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor)
  .setVariableQueryEditor(VariableQueryEditor);
