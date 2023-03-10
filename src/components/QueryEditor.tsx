import React, { PureComponent } from 'react';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';
import { HorizontalGroup, Input, Label } from '@grafana/ui';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  statusFilters: Record<string, boolean> = { new: true, open: false, hold: false, pending: false, solved: false };

  render() {
    const handleFilterChange = (key: string , value: boolean) => {
      this.statusFilters[key] = value;
      const newStatus = {status: Object.keys(this.statusFilters).filter(k => this.statusFilters[k])};
      this.props.onChange({ ...this.props.query, ...newStatus })
    };
    
    return (
      <HorizontalGroup>
        <Label>Status</Label>
        { Object.keys(this.statusFilters).map((key) => {
          return (<>
            <Input 
            type="checkbox" 
            id={`${key}Status`}
            checked={this.statusFilters[key]}
            onClick={(e) => handleFilterChange(key, e.currentTarget.checked)}/>
            <label htmlFor={`${key}Status`}>{key}</label>
          </>)
        })}
        {/* <Input 
          type="checkbox" 
          id="newStatus" 
          checked={this.statusFilters.new}
          onClick={(e) => handleFilterChange("new", e.currentTarget.checked)}/>
        <label htmlFor="newStatus">New</label>

        <Input 
          type="checkbox" 
          id="newStatus" 
          checked={this.statusFilters.new}
          onClick={(e) => handleFilterChange("new", e.currentTarget.checked)}/>
        <label htmlFor="newStatus">New</label>

        <Input 
          type="checkbox" 
          id="openStatus"
          checked={this.statusFilters.open}
          onChange={(e) => handleFilterChange("open", e.currentTarget.checked)}/>
        <label htmlFor="openStatus">Open</label>

        <Input
          type="checkbox"
          id="holdStatus"
          checked={this.statusFilters.hold}
          onClick={(e) => handleFilterChange("hold", e.currentTarget.checked)}/>
        <label htmlFor="holdStatus">Hold</label>

        <Input type="checkbox" id="pendingStatus"/>
        <label htmlFor="pendingStatus">Pending</label>

        <Input type="checkbox" id="solvedStatus"/>
        <label htmlFor="solvedStatus">Solved</label> */}

        {/* <Input
          type="select"
          label="Status"
          value={this.props.query.status}
          onChange={(e) => this.props.onChange({ ...this.props.query, status: e.currentTarget.value })}
        /> */}
      </HorizontalGroup>
    );
  }
}
