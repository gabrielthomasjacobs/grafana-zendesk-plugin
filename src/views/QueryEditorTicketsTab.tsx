import React, { useEffect, useState } from 'react';
import { isFilterValid } from 'shared/Validator';
import { SelectableQueryRow, ZendeskField, ZendeskQuery } from 'types';
import { QueryRowBuilder } from './QueryRowBuilder';
import { formatQuery } from 'shared/QueryFormatter';
import { fetchFields } from 'shared/API';
import { firstValueFrom } from 'rxjs';
import { formatFieldNameForQuery } from 'shared/FieldUtils';

function QueryEditorTicketsTab(props: {query: ZendeskQuery, onChange: (update: ZendeskQuery) => void, dataSourceUID: string}){
  const [filters, setFilters] = useState<SelectableQueryRow[]>(props.query.filters || []);
  const [zendeskFields, setZendeskFields] = useState<ZendeskField[]>([]);

  useEffect(() => {
    const fetchZendeskFields = async () => {
      const fields = await firstValueFrom(fetchFields(props.dataSourceUID));
      setZendeskFields(fields);
    }
    fetchZendeskFields();
  }, [props.dataSourceUID])

  const handleQueryInputChange = (rows: SelectableQueryRow[]) => {
    const joinedQueryString = rows
      .filter((row) => isFilterValid(row))
      .map((row) => {
        const formattedFieldName = formatFieldNameForQuery(row.selectedField);
        if(!formattedFieldName) {return ''};
        return formatQuery(formattedFieldName, row.operator, row.terms)
      })
      .join(' ');
    setFilters(rows)
    const update = {...props.query, filters: rows, querystring: joinedQueryString};
    props.onChange(update)
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <QueryRowBuilder
        onChange={(rows) => {handleQueryInputChange(rows)}}
        availableFields={zendeskFields}
        filters={filters}
        />
  </div>
  )
}

export { QueryEditorTicketsTab };
