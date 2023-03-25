import React, { useState } from 'react';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { defaultQuery, ZendeskDatasourceOptions, ZendeskQuery } from '../types';
import { Button, HorizontalGroup, Input, Label } from '@grafana/ui';

type Props = QueryEditorProps<DataSource, ZendeskQuery, ZendeskDatasourceOptions>;

function QueryEditor(props: Props) {
  const [query, setQuery] = useState(props.query);

  const CreateToggleGroup = ({queryKey, label}: 
    {queryKey: 'status' | 'priority', label?: string}) => {
    return(
      <HorizontalGroup>
        <Label>{label || queryKey}</Label>
        { Object.keys(defaultQuery[queryKey] || {}).map((option, index) => (
          <Button
            key={index}
            onClick={() => {
              let update = { ...query[queryKey] };
              update[option] = !update[option];
              setQuery({ ...query, ...{[queryKey]: update} })
              props.onChange({ ...query, ...{[queryKey]: update} })
            }}
            style={ (query[queryKey][option]) ? { backgroundColor: '#2196f3', color: 'white' } : {backgroundColor: 'gray', color: 'white' }}>
              {option}</Button>
        )) }
      </HorizontalGroup>
    )
  }

  const handleTagsChange = (value: string) => {
    props.onChange({ ...props.query, ...{tags: value.replace(' ', '').split(',')}})
  }

  const createTagsInput = () => {
    return (
      <HorizontalGroup>
          <Label>Tags</Label>
          <Input
            type="text"
            value={props.query?.tags?.join(', ') || ''}
            onChange={(e) => handleTagsChange(e.currentTarget.value)}
          />
      </HorizontalGroup>
    )
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        {CreateToggleGroup({queryKey: 'status', label: 'Status'})}
        {CreateToggleGroup({queryKey: 'priority', label: 'Priority'})}
        {createTagsInput()}
      </div>
  );
}

export { QueryEditor };
