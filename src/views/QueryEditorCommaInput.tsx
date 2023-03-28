import { HorizontalGroup, InlineField, TagsInput } from '@grafana/ui';
import React, { useState } from 'react';

type Props = {
  value: string[],
  label: string,
  queryKey: string,
  onChange: (key: string, update: string[]) => void
}

export function CreateCommaInput(props: Props) {
  const [tags, setTags] = useState<string[]>(props.value || []);

  return(
    <HorizontalGroup>
      <InlineField label={props.label}>
        <TagsInput {...props} tags={tags} onChange={(value) => {
          setTags(value.map(v => v.trim()));
          props.onChange(props.queryKey, value);
        }} />
      </InlineField>
    </HorizontalGroup>
  )
};
