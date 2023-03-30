import { SelectableValue } from '@grafana/data';
import { HorizontalGroup, IconButton, InlineField, InlineFieldRow, MultiSelect, Select } from '@grafana/ui';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { formatQuery } from 'shared/QueryFormatter';
import { SelectableQueryRow, QueryOperator, queryValueDefaults } from 'types';

type Props = {
  row: SelectableQueryRow;
  uniqueID: string;
  onChange: (row: SelectableQueryRow, action?: string) => void;
  onDelete: (id: string) => void;
}

export function QueryRow(props: Props) {
  const [availableKeywords, setAvailableKeywords] = useState<Array<SelectableValue<string>>>(props.row.availableKeywords.map(v => ({value: v, label: v})));
  const [selectedKeyword, setSelectedKeyword] = useState<string>(props.row.selectedKeyword);
  const [operator, setOperator] = useState<QueryOperator>(props.row.operator);
  const [availableTerms, setAvailableTerms] = useState<Array<SelectableValue<string>>>(props.row.availableTerms?.map(v => ({value: v, label: v})) || []);
  const [terms, setTerms] = useState<string[]>(props.row.terms || []);

  const operators = [':', '-', '>', '<', '>=', '<='].map(v => ({label: v, value: v}));
  const emit = () => {
    const availableTerms: string[] = queryValueDefaults[selectedKeyword] || [];
    if(selectedKeyword.trim() === '' || _.isEqual(props.row, { ...props.row, selectedKeyword, operator, terms, availableTerms })) {return};
    const update = { ...props.row, selectedKeyword, operator, terms, availableTerms }
    update.querystring = formatQuery(update.selectedKeyword, update.operator, update.terms);
    props.onChange(update);
  }

  useEffect(emit);
  
  return (
    <HorizontalGroup>
      <InlineFieldRow>
        <InlineField style={{"alignItems": "center"}}>
          <IconButton 
            name='trash-alt' 
            variant='destructive'
            onClick={() => props.onDelete(props.uniqueID)} />
        </InlineField>
        <InlineField label="Field">
          <Select
            options={availableKeywords}
            value={selectedKeyword}
            onChange={(v) => {
              setSelectedKeyword(v.value as string || '');
              setAvailableTerms(queryValueDefaults[v.value as string]?.map(v => ({label: v, value: v})) || []);
            }}
            allowCustomValue={true}
            onCreateOption={(v) => {
              if(v.trim() === '' || !v) {return};
              const customValue: SelectableValue<string> = { value: v, label: v };
              setAvailableKeywords([...availableKeywords, customValue]);
              setSelectedKeyword(customValue.value as string);
            }}
          />
        </InlineField>
        <InlineField label="Operator">
          <Select
            options={operators}
            value={ operator }
            onChange={
              (selected) => {
                setOperator(selected.value as QueryOperator || ':' as QueryOperator);
              }
            }
          />
        </InlineField>
        <InlineField label="Values" grow>
          <MultiSelect 
            options={availableTerms}
            value={terms}
            onChange={(v) => {
              setTerms(v.map(v => v.value as string));
              emit();
            }}
            allowCustomValue={true}
            noOptionsMessage="Enter Custom Value"
            placeholder=''
            onCreateOption={(v) => {
              if(v.trim() === '' || !v) {return};
              const customValue: SelectableValue<string> = { value: v, label: v };
              setAvailableTerms([...availableTerms, customValue]);
              setTerms([...terms, customValue.value as string]);
              emit();
            }}
          />
        </InlineField>
      </InlineFieldRow>
    </HorizontalGroup>
  )
}
