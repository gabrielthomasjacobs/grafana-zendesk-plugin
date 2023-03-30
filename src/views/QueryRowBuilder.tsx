import { Button, VerticalGroup } from '@grafana/ui'
import { uniqueId } from 'lodash';
import React, { useState }  from 'react'
import { DefaultKeywords, SelectableQueryRow } from 'types';
import { QueryRow } from './QueryRow';

type Props = {
  onChange: (rows: SelectableQueryRow[]) => void;
  filters: SelectableQueryRow[];
}

export function QueryRowBuilder(props: Props) {
  const [queryRows, setQueryRows] = useState<SelectableQueryRow[]>(props.filters);
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const unusedKeywords = [...DefaultKeywords, ...customKeywords]
    .filter(v => !queryRows.map(f => f.selectedKeyword).includes(v));

  const addRow = (row: SelectableQueryRow) => {
    const update = [...queryRows, row];
    setQueryRows(update);
    props.onChange(update);
  }

  const removeRow = (id: string) => {
    const update = queryRows.filter((rows) => rows.uniqueId !== id);
    setQueryRows(update);
    props.onChange(update);
  }

  const newQueryRow = () => {
    const newRow: SelectableQueryRow = {
      selectedKeyword: '',
      operator: ':',
      terms: [],
      availableKeywords: unusedKeywords,
      uniqueId: uniqueId(),
      querystring: '',
    }
    addRow(newRow);
  }

  const handleRowUpdate = (row: SelectableQueryRow, rowIndex: number) => {
    if(row.selectedKeyword.trim() === '') {return};
    if(!(DefaultKeywords as unknown as string[]).includes(row.selectedKeyword)) {
      setCustomKeywords([...customKeywords, row.selectedKeyword]);
    }
    const update = [...queryRows];
    update[rowIndex] = row;
    setQueryRows(update);
    props.onChange(update);
  }

  return (
    <>
      <VerticalGroup>
        <Button
          icon='plus'
          onClick={newQueryRow}>
            Add Filter
        </Button>
        {queryRows.map((row, i) => {
          return (
            <QueryRow
              key={row.uniqueId}
              uniqueID={row.uniqueId}
              row={row}
              onChange={(row) => handleRowUpdate(row, i)}
              onDelete={() => removeRow(row.uniqueId)} />
          )})}
      </VerticalGroup>
    </>
  )
}
