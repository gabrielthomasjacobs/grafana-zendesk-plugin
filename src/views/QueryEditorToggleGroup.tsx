import { HorizontalGroup, Label, Button } from '@grafana/ui';
import React from 'react';

type toggleGroupValues = {[key: string]: boolean}

type Props = {
  queryKey: string,
  value: toggleGroupValues,
  availableValues: toggleGroupValues,
  label: string,
  onChange: (key: string, update: toggleGroupValues) => void
}

export function CreateToggleGroup(props: Props) {
  return(
    <HorizontalGroup>
      <Label>{props.label}</Label>
      { Object.keys(props.value).map((option, index) => (
        <Button
          key={index}
          onClick={() => {
            let update: {[key: string]: boolean} = { ...props.value };
            update[option] = !update[option];
            props.onChange(props.queryKey, update)
          }}
          style={ (props.value[option]) ? { backgroundColor: '#2196f3', color: 'white' } : {backgroundColor: 'gray', color: 'white' }}>
            {option}</Button>
      )) }
    </HorizontalGroup>
  )
};
