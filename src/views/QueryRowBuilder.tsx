import { Button, VerticalGroup } from '@grafana/ui'
import { uniqueId } from 'lodash';
import React, { useState }  from 'react'
import { SelectableQueryRow, ZendeskField } from 'types';
import { QueryRow } from './QueryRow';

type Props = {
  onChange: (rows: SelectableQueryRow[]) => void;
  filters: SelectableQueryRow[];
  availableFields: ZendeskField[];
}

export function QueryRowBuilder(props: Props) {
  const [queryRows, setQueryRows] = useState<SelectableQueryRow[]>(props.filters);
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
    addRow({
      selectedField: undefined,
      zendeskFields: props.availableFields,
      operator: ':',
      terms: [],
      uniqueId: uniqueId()
    });
  }

  const handleRowUpdate = (row: SelectableQueryRow, rowIndex: number) => {
    if(row.selectedField?.title?.trim() === '') {return};
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
