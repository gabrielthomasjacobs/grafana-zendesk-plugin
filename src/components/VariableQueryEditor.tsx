import React, { useEffect, useState } from 'react';
import { Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { fetchFields } from 'shared/API';
import { firstValueFrom } from 'rxjs';
import { isFieldCustom } from 'shared/FieldUtils';

type SelectableField = {label: string, value: string, description: string};

interface VariableQueryProps {
  query: SelectableValue<SelectableField>;
  onChange: (query: SelectableValue<SelectableField>, definition: string) => void;
  datasource: any;
}

export const VariableQueryEditor = ({ onChange, query, datasource }: VariableQueryProps) => {
  const [state, setState] = useState(query);
  const [fields, setFields] = useState<SelectableValue[]>([]);

  useEffect(() => {
    const fetchAvailableFields = async () => {
      const fields = await firstValueFrom(fetchFields(datasource.uid));
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
  }, [datasource.uid])

  const handleChange = (selection: SelectableValue<SelectableField>) =>{
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
