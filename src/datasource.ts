import { CoreApp, DataSourceInstanceSettings, MetricFindValue, ScopedVars } from '@grafana/data';
import { ZendeskQuery, ZendeskDatasourceOptions } from './types';
import { DataSourceWithBackend } from '@grafana/runtime';
import ZendeskMetricFindQuery from 'metricFindQuery';
import { firstValueFrom } from 'rxjs';
import { ZendeskMetricApplyQuery } from 'metricApplyQuery';

export class DataSource extends DataSourceWithBackend<ZendeskQuery, ZendeskDatasourceOptions> {
  instanceSettings: DataSourceInstanceSettings<ZendeskDatasourceOptions>;

  constructor(instanceSettings: DataSourceInstanceSettings<ZendeskDatasourceOptions>) {
    super(instanceSettings);
    this.query = this.query.bind(this);
    this.instanceSettings = instanceSettings;
  }

  async metricFindQuery(query: {label: string, value: string, description: string}, options?: unknown): Promise<MetricFindValue[]> {
    if (!query) { return Promise.resolve([]) }
    const metricFindQuery = new ZendeskMetricFindQuery(query, this.instanceSettings.id);
    return firstValueFrom(metricFindQuery.metricFieldQuery())
  }

  applyTemplateVariables(query: ZendeskQuery, scopedVars: ScopedVars): ZendeskQuery {
    const metricapplyQuery = new ZendeskMetricApplyQuery(query, scopedVars);
    return metricapplyQuery.applyTemplateVariables();
  }

  getDefaultQuery(app: CoreApp): Partial<ZendeskQuery> {
    return {querystring: '', filters: []};
  }
}
