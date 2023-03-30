import React, { useState } from 'react';
import { isFilterValid } from 'shared/Validator';
import { SelectableQueryRow, ZendeskQuery } from 'types';
import { QueryRowBuilder } from './QueryRowBuilder';

function QueryEditorTicketsTab(props: {query: ZendeskQuery, onChange: (update: ZendeskQuery) => void}){
  const [filters, setFilters] = useState<SelectableQueryRow[]>(props.query.filters || []);

  const handleQueryInputChange = (rows: SelectableQueryRow[]) => {
    const joinedQueryString = rows
      .filter((row) => isFilterValid(row))
      .map((row) => row.querystring)
      .join(' ');
    setFilters(rows)
    const update = {...props.query, filters: rows, querystring: joinedQueryString};
    props.onChange(update)
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <QueryRowBuilder
        onChange={(rows) => {handleQueryInputChange(rows)}}
        filters={filters}
        />
  </div>
  )
}

export { QueryEditorTicketsTab };
