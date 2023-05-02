import React, { useEffect, useState } from 'react';
import { Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { fetchFields } from 'shared/API';
import { firstValueFrom } from 'rxjs';
import { isFieldCustom } from 'shared/FieldUtils';

interface VariableQueryProps {
  query: SelectableValue<any>;
  onChange: (query: SelectableValue<any>, definition: string) => void;
}

export const VariableQueryEditor = ({ onChange, query }: VariableQueryProps) => {
  const [state, setState] = useState(query);
  const [fields, setFields] = useState<SelectableValue[]>([]);

  useEffect(() => {
    const fetchAvailableFields = async () => {
      const fields = await firstValueFrom(fetchFields());
      const formattedFields = fields.filter(field => {
        // only return fields that have options
        return field.system_field_options || field.custom_field_options || field.custom_statuses || field.type === 'tagger'
      }).map((field) => {
        const isCustomField = isFieldCustom(field);
        const isCustomStatusField = field.type === 'custom_status';
        const definition = {
          value: isCustomField ? (isCustomStatusField ? 'status' : `custom_field_${field.id}`) : field.title,
          label: field.title,
          description: field.description,
        }
        return definition
      });
      setFields(formattedFields);
    };
    
    fetchAvailableFields().catch((e) => console.error(e));
  }, [])

  const handleChange = (selection: SelectableValue<any>) =>{
    setState(selection)
    onChange(selection, `${selection.label}`)
  };

  return (
    <>
      <div className="gf-form">
        <span className="gf-form-label width-10">Query</span>
        <Select
          options={fields}
          value={state}
          onChange={(v) => handleChange(v)}
        />
      </div>
    </>
  );
};
