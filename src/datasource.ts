import { CoreApp, DataSourceInstanceSettings } from '@grafana/data';

import { ZendeskQuery, ZendeskDatasourceOptions } from './types';
import { DataSourceWithBackend } from '@grafana/runtime';

export class DataSource extends DataSourceWithBackend<ZendeskQuery, ZendeskDatasourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<ZendeskDatasourceOptions>) {
    super(instanceSettings);
  }

  getDefaultQuery(app: CoreApp): Partial<ZendeskQuery> {
    return { status: ["new"] };
  }
}
