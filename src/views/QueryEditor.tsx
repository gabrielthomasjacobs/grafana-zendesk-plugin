import React, { useState } from 'react';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { ZendeskDatasourceOptions, ZendeskQuery } from '../types';
import { QueryEditorTicketsTab } from './QueryEditorTicketsTab';
import { Tab, TabContent, TabsBar } from '@grafana/ui';
type Props = QueryEditorProps<DataSource, ZendeskQuery, ZendeskDatasourceOptions>;

function QueryEditor(props: Props) {
  console.log(props)
  const [currentTab, setCurrentTab] = useState('tickets');
  const tabs = [
    {label: 'Tickets', active: currentTab === 'tickets', onChangeTab: () => setCurrentTab('tickets')},
    // {label: 'Sales', active: currentTab === 'sales', onChangeTab: () => setCurrentTab('sales')}
  ];

  const handleTabQueryChange = (update: ZendeskQuery) => {
    props.onChange({...props.query, ...update})
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <TabsBar>
        {tabs.map((tab, index) => {
          return (
            <Tab
              key={index}
              label={tab.label}
              active={tab.active}
              onChangeTab={tab.onChangeTab}
            />
          );
        })}
      </TabsBar>
      <TabContent>
        {tabs[0].active && 
          <QueryEditorTicketsTab 
            query={props.query}
            onChange={handleTabQueryChange}/>}
        {/* {tabs[1].active && <div>Second tab content</div>} */}
      </TabContent>
    </div>
  );
}

export { QueryEditor };
