import { InlineField, Select } from '@grafana/ui';
import React, { useState } from 'react';
import { defaultQuery, ZendeskQuery, ZendeskQueryEditorProps } from 'types';
import { CreateCommaInput } from './QueryEditorCommaInput';
import { CreateToggleGroup } from './QueryEditorToggleGroup';
import { ticketQueryPresets } from './QueryPresets';

function QueryEditorTicketsTab(props: ZendeskQueryEditorProps){
  const [query, setQuery] = useState<ZendeskQuery>(props.query);
  const [queryPreset, setSelectedPreset] = useState<typeof ticketQueryPresets[number]>(ticketQueryPresets[0]);

  const handleQueryInputChange = (key: string, update: {[key: string]: any}) => {
    const newQuery = { ...query, ...{[key]: update} }
    setQuery(newQuery)
    props.onChange(newQuery)
  }

  const toggleAllOff = (value: {[key: string]: boolean}) => {
    Object.keys(value).forEach((key) => {
      value[key] = false;
    })
  }

  const updateQueryFromPreset = (preset: typeof ticketQueryPresets[number]) => {
    let newQuery: typeof defaultQuery = {...defaultQuery, ...{tags: []}};
    toggleAllOff(newQuery.status);
    toggleAllOff(newQuery.priority);
    newQuery.status = {...newQuery.status, ...preset.setValue.status};
    newQuery.priority = {...newQuery.priority, ...preset.setValue.priority};
    newQuery.tags = preset.setValue.tags || [];
    const update = {...query, ...newQuery};
    setQuery(update);
    props.onChange(update)
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <InlineField label="Focus">
        <Select
          options={ticketQueryPresets}
          value={queryPreset}
          onChange={(v) => {
            setSelectedPreset(v as any || ticketQueryPresets[0]);
            updateQueryFromPreset(v as any || ticketQueryPresets[0]);
          }}
        />
      </InlineField>

      <CreateToggleGroup
        label="Status"
        queryKey="status"
        availableValues={defaultQuery.status}
        onChange={handleQueryInputChange}
        value={query.status} />
      <CreateToggleGroup
        label="Priority"
        queryKey="priority"
        availableValues={defaultQuery.priority}
        onChange={handleQueryInputChange}
        value={query.priority} />
      <CreateCommaInput
        label="Tags"
        queryKey='tags'
        value={query.tags}
        onChange={handleQueryInputChange}/>
  </div>
  )
}

export { QueryEditorTicketsTab };
