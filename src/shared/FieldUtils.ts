import { ZendeskField } from 'types'

export const isFieldCustom = (field: ZendeskField): boolean => {
  return Object.keys(field).some(key => key.indexOf('custom_') > -1)
}

/**
 * Formats field name for use in a Zendesk query
 * 
 * @param
 * field ZendeskField object  
 * 
 * @returns
 * the fields title, or `custom_field_${field.id}` if the field is custom
 * Special check for custom statuses, which should be queried as `status`
 **/ 
export const formatFieldNameForQuery = (field: ZendeskField | undefined): string | undefined => {
  if(field === undefined) { return undefined };
  if(isFieldCustom(field)) {
    if(field.type === 'custom_status') { return 'status' }
    return `custom_field_${field.id}`
  }
  return field.title
}

/**
 * Returns list of options for a field. If no options, returns empty array
 * 
 * @param
 * field ZendeskField object  
 * 
 * @returns
 * the fields title, or `custom_field_${field.id}` if the field is custom
 * Special check for custom statuses, which should be queried as `status`
 **/ 
export const getFieldOptions = (field: ZendeskField | undefined): Array<{name: string, value: string}> => {
  if(field === undefined) { return [] };
  return field.custom_field_options || 
          field.custom_statuses?.map(status => ({name: status.agent_label, value: status.status_category})) || 
          field.system_field_options || []
}

export const generateEmptyField = (): ZendeskField => {
  return {
    id: 0,
    key: '',
    title: '',
    raw_title: '',
    raw_description: '',
    type: '',
    url: '',
    description: '',
    position: 0,
    active: false,
    required: false,
    collapsed_for_agents: false,
    regexp_for_validation: '',
    title_in_portal: '',
    visible_in_portal: false,
    editable_in_portal: false,
    required_in_portal: false,
    tag: '',
    created_at: '',
    updated_at: '',
    removable: false,
    agent_description: '',
    end_user_description: '',
    system: true
  }
}
