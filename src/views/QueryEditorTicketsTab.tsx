import React, { useState } from 'react';
import { defaultQuery, ZendeskQueryEditorProps } from 'types';
import { CreateCommaInput } from './QueryEditorCommaInput';
import { CreateToggleGroup } from './QueryEditorToggleGroup';


function QueryEditorTicketsTab(props: ZendeskQueryEditorProps){
  const [query, setQuery] = useState(props.query);

  const handleQueryInputChange = (key: string, update: {[key: string]: any}) => {
    const newQuery = { ...query, ...{[key]: update} }
    setQuery(newQuery)
    props.onChange(newQuery)
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
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
