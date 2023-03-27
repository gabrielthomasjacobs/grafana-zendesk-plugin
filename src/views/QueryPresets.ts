import { ZendeskQuery } from 'types';

export const ticketQueryPresets: Array<{ label: string, disable: string[], setValue: Partial<ZendeskQuery> }> = [
  {label: 'All tickets', disable: [], setValue: {
    status: {new: true, open: true, pending: true, solved: true, hold: true},
    priority: {low: true, normal: true, high: true, urgent: true},
    tags: []
  }},
  {label: 'Unresolved Tickets', disable: [], setValue: {
    status: {new: true, open: true, pending: true},
    priority: {low: true, normal: true, high: true, urgent: true},
    tags: []
  }}
]
