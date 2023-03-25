import { HorizontalGroup, Label, Input } from '@grafana/ui';
import React from 'react';

type Props = {
  value: string[],
  label: string,
  queryKey: string,
  onChange: (key: string, update: string[]) => void
}

const splitOnComma = (value: string) => {
  return value.replace(' ', '').split(',')
}

export function CreateCommaInput(props: Props) {
  return(
    <HorizontalGroup>
      <Label>{props.label}</Label>
      <Input
        type="text"
        value={props.value?.join(', ') || ''}
        onChange={(e) => props.onChange(props.queryKey, splitOnComma(e.currentTarget.value))}
        onBlur={(e) => props.onChange(props.queryKey, splitOnComma(e.currentTarget.value))}
      />
    </HorizontalGroup>
  )
};
