import { CoreApp, DataSourceInstanceSettings } from '@grafana/data';

import { ZendeskQuery, ZendeskDatasourceOptions } from './types';
import { DataSourceWithBackend } from '@grafana/runtime';
import { ticketQueryPresets } from 'views/QueryPresets';

export class DataSource extends DataSourceWithBackend<ZendeskQuery, ZendeskDatasourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<ZendeskDatasourceOptions>) {
    super(instanceSettings);
  }

  getDefaultQuery(app: CoreApp): Partial<ZendeskQuery> {
    return ticketQueryPresets[0].setValue;
  }
}
