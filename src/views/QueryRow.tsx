import { SelectableValue } from '@grafana/data';
import { HorizontalGroup, IconButton, InlineField, InlineFieldRow, MultiSelect, Select } from '@grafana/ui';
import React, { useEffect, useState } from 'react';
import { formatFieldNameForQuery, getFieldOptions } from 'shared/FieldUtils';
import { SelectableQueryRow, QueryOperator, ZendeskField } from 'types';

type Props = {
  row: SelectableQueryRow;
  uniqueID: string;
  onChange: (row: SelectableQueryRow) => void;
  onDelete: (id: string) => void;
}

export function QueryRow(props: Props) {
  const [selectedField, setSelectedField] = useState<SelectableValue<string>>({
    label: props.row.selectedField?.title,
    value: formatFieldNameForQuery(props.row.selectedField),
    description: props.row.selectedField?.description,
    id: props.row.selectedField?.id,
    options: getFieldOptions(props.row.selectedField)
  });
  
  const [operator, setOperator] = useState<QueryOperator>(props.row.operator);
  const [availableOptions, setAvailableOptions] = useState<Array<SelectableValue<string>>>([]);
  const [terms, setTerms] =  useState<Array<SelectableValue<string>>>(props.row.terms.map(v => ({label: v, value: v})) || []);

  const operators = [':', '-', '>', '<', '>=', '<='].map(v => ({label: v, value: v}));
  const emit = () => {
    const field: ZendeskField | undefined = props.row.zendeskFields?.find((field) => formatFieldNameForQuery(field) === selectedField?.value);
    const update = { ...props.row,
      selectedField: field,
      operator,
      terms: terms.filter(v => v.value !== '' && v.value !== undefined).map(v => v.value as string)
    }
    props.onChange(update);
  }

  const updateSelectedField = (fieldName: string) => {
    const field = props.row.zendeskFields?.find((field) => formatFieldNameForQuery(field) === fieldName);
    if(!field) { return; }
    setSelectedField({label: field.title, value: formatFieldNameForQuery(field)});
    setTerms([]);
  }

  useEffect(() => {
    const field = props.row.zendeskFields?.find((field) => selectedField.value === formatFieldNameForQuery(field));
    const newOptions = getFieldOptions(field).map(option => ({label: option.name, value: option.value}));
    setAvailableOptions([...newOptions, ...props.row.terms.map(v => ({label: v, value: v}))]);
  }, [selectedField, props.row.zendeskFields, props.row.terms])

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
            options={props.row.zendeskFields?.map((field) => ({
                label: field.title || '' ,
                value: formatFieldNameForQuery(field), 
                description: field.description || ''
              }))}
            value={ selectedField }
            onChange={(v) => { updateSelectedField(v.value || '') }}
            onBlur={() => emit()}
            allowCustomValue={false}
            width={30}
          />
        </InlineField>
        <InlineField label="Operator">
          <Select
            options={ operators }
            value={ operator }
            isSearchable={false}
            onChange={(selected) => setOperator(selected.value as QueryOperator || ':' as QueryOperator)}
          />
        </InlineField>
        <InlineField label="Values" grow>
          <MultiSelect 
            options={availableOptions}
            value={terms}
            onChange={(t) => setTerms(t) }
            onBlur={() => emit()}
            allowCustomValue={true}
            noOptionsMessage="Enter Custom Value"
            placeholder=''
            onCreateOption={(v) => {
              if(v.trim() === '' || !v) {return};
              const customValue: SelectableValue<string> = { value: v, label: v };
              setAvailableOptions([...availableOptions, customValue]);
              setTerms(terms.concat(customValue));
            }}
          />
        </InlineField>
      </InlineFieldRow>
    </HorizontalGroup>
  )
}
