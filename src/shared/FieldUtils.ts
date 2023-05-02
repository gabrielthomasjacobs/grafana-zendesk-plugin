import { ZendeskField } from 'types'

export const isFieldCustom = (field: ZendeskField): boolean => {
  return Object.keys(field).some(key => key.indexOf('custom_') > -1)
}

export const formatFieldnameForQuery = (field: ZendeskField | undefined): string | undefined => {
  if(field === undefined) { return undefined };
  if(isFieldCustom(field)) {
    if(field.type === 'custom_status') { return 'status' }
    return `custom_field_${field.id}`
  }
  return field.title
}

export const getFieldOptions = (field: ZendeskField | undefined): Array<{name: string, value: string}> => {
  if(field === undefined) { return [] };
  return field.custom_field_options || 
          field.custom_statuses?.map(status => ({name: status.agent_label, value: status.status_category})) || 
          field.system_field_options || []
}
