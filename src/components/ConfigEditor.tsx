import React, { PureComponent } from 'react';
import { DataSourceHttpSettings } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { ZendeskDatasourceOptions } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<ZendeskDatasourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  render() {
    const { options } = this.props;
    options.url ||= "https://yourSubdomain.zendesk.com/api/v2/"
    options.basicAuthUser ||= "you@yourOrg.com/token"
    options.basicAuth ||= true;
    
    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <DataSourceHttpSettings
            defaultUrl="https://yourSubdomain.zendesk.com/api/v2/"
            dataSourceConfig={options}
            onChange={this.props.onOptionsChange}
          />
        </div>
      </div>
    );
  }
}
