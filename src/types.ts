import { DataQuery, DataSourceJsonData, QueryEditorProps } from '@grafana/data';
import { DataSource } from 'datasource';

export interface ZendeskQuery extends DataQuery {
  querystring: string,
  filters: SelectableQueryRow[]
}

export type ZendeskQueryEditorProps = QueryEditorProps<DataSource, ZendeskQuery, ZendeskDatasourceOptions>;

export interface ZendeskDatasourceOptions extends DataSourceJsonData {}

const QueryOperators = [":" , '-' , '>' , '<' , '>=' , '<='] as const;
export type QueryOperator = typeof QueryOperators[number];

export type SelectableQueryRow = {
  zendeskFields: ZendeskField[];
  selectedField: ZendeskField | undefined;
  operator: QueryOperator;
  terms: string[];
  availableTerms?: string[];
  uniqueId: string;
}

export type ZendeskField = {
  id: number;
  title: string;
  type: string;
  key: string;
  description: string;
  raw_title: string;
  raw_description: string;
  position: number;
  active: boolean;
  system: boolean;
  regexp_for_validation: string;
  created_at: string;
  updated_at: string;
  tag: string;
  custom_field_options?: Array<{ name: string,  value: string}>;
  system_field_options?: Array<{ name: string,  value: string}>;
  custom_statuses?: Array<{ active: boolean, agent_label: string, description: string, end_user_label: string, status_category: string, name: string,  value: string}>;
  removable: boolean;
  agent_description: string;
  end_user_description: string;
  url: string;
  [key: string]: string | boolean | number | null | any[] | undefined;
}

export type ZendeskFieldQuery = {
  ticket_fields: ZendeskField[];
}
