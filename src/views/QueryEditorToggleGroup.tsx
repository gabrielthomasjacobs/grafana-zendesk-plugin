import { HorizontalGroup, InlineField, FilterPill } from '@grafana/ui';
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
    <InlineField label={props.label}>
      <HorizontalGroup>
        { Object.keys(props.value).map((option, index) => (
        <FilterPill
          selected={props.value[option]}
          label={option}
          key={index}
          onClick={() => {
            let update: {[key: string]: boolean} = { ...props.value };
            update[option] = !update[option];
            props.onChange(props.queryKey, update)
          }} />
      )) }
      </HorizontalGroup>
    </InlineField>
  )
};
