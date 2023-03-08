import React, { PureComponent } from 'react';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';
import { HorizontalGroup, Input, Label } from '@grafana/ui';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  render() {
    return (
      <HorizontalGroup>
        <Label>Status</Label>
        <Input
          type="string"
          label="Status"
          value={this.props.query.status}
          onChange={(e) => this.props.onChange({ ...this.props.query, status: e.currentTarget.value })}
        />
      </HorizontalGroup>
    );
  }
}
