import React, { useState } from 'react';
import { ZendeskQuery } from '../types';
import { SelectableValue } from '@grafana/data';
import { HorizontalGroup, InlineField, Input, MultiSelect } from '@grafana/ui';
import { random } from 'lodash';

interface VariableQueryProps {
  query: ZendeskQuery;
  onChange: (query: any, definition: string) => void;
}

export const VariableQueryEditor: React.FC<VariableQueryProps> = ({ onChange, query }) => {
  const id = random(1000).toString();
  const newQuery: ZendeskQuery = {
    refId: id,
    querystring: '',
    filters: [{
      uniqueId: id,
      selectedKeyword: '',
      querystring: '',
      terms: [],
      availableTerms: [],
      availableKeywords: [],
      operator: ':'
    }]
  }
  const [state, setState] = useState(query || newQuery);
  const [keyword, setKeyword] = useState(query.filters?.[0]?.selectedKeyword || '');
  const [availableTerms, setAvailableTerms] = useState<Array<SelectableValue<string>>>((query.filters?.[0]?.availableTerms || []).map(v => ({label: v, value: v})));

  const saveQuery = () => {
    onChange({...state, options: availableTerms.map(v => ({text: v.value, value: v.value}))}, `${keyword}: ${availableTerms.map(v => v.value).join(', ')}`);
  };

  const handleChange = ({keyword, terms, newTerm}: {keyword?: string, terms?: string[], newTerm?: string}) => {
    const update = structuredClone(state);
    if(keyword) {
      update.filters[0].selectedKeyword = keyword;
      setKeyword(keyword);
    }
    if(terms) {
      update.filters[0].availableTerms = terms;
      setAvailableTerms(terms.map(v => ({label: v, value: v})));
    }
    if(newTerm) {
      update.filters[0].availableTerms ??= [];
      if(update.filters[0].availableTerms.indexOf(newTerm) > -1) {return};
      update.filters[0].availableTerms = [...update.filters[0].availableTerms, newTerm];
      setAvailableTerms([...availableTerms, {label: newTerm, value: newTerm, refId: newTerm}]);
    }
    setState(update);
  }

  return (
    <>
      <HorizontalGroup>
        <InlineField label="field">
          <Input 
            value={keyword}
            onBlur={saveQuery}
            onChange={(v) => handleChange({keyword: v.currentTarget.value})} />
        </InlineField>
        <InlineField label="Available Options">
          <MultiSelect 
            options={availableTerms}
            value={availableTerms}
            onBlur={saveQuery}
            onChange={(v) => handleChange({terms: v.map(v => v.value || '')})}
            allowCustomValue={true}
            noOptionsMessage="Enter Custom Value"
            placeholder=''
            onCreateOption={(v) => handleChange({newTerm: v})}
          />
        </InlineField>
      </HorizontalGroup>
    </>
  );
};
