export interface WeddingEventDetails {
  title: string
  description: string
  location: string
  startDate: string // ISO string '2026-08-22T23:59:00+05:30'
  endDate: string   // ISO string '2026-08-23T04:00:00+05:30'
}

export const WEDDING_CEREMONY_EVENT: WeddingEventDetails = {
  title: 'Mohan Praneeth & Leepika - Sumuhurtham (Wedding Ceremony)',
  description: 'Auspicious Wedding Ceremony of Mohan Praneeth and Leepika. Śrāvaṇa Śuddha Daśami, Varabha Nāma Saṁvatsara, Mula Nakshatram, Mesha Lagnam.',
  location: 'I Conventions, Sri Devi Theatre Road, Chanda Nagar, Ameenpur, Hyderabad, Telangana',
  startDate: '20260822T182900Z', // 2026-08-22 23:59 IST is 18:29 UTC
  endDate: '20260822T223000Z',   // 2026-08-23 04:00 IST is 22:30 UTC
}

export const RECEPTION_EVENT: WeddingEventDetails = {
  title: 'Mohan Praneeth & Leepika - Wedding Reception',
  description: 'Grand Wedding Reception celebrating Mohan Praneeth and Leepika.',
  location: 'Sri Sai Surya Function Hall, Kommadi Junction, Srinivas Nagar, Madhuravada, Visakhapatnam',
  startDate: '20260826T063000Z', // 2026-08-26 12:00 IST is 06:30 UTC
  endDate: '20260826T113000Z',   // 2026-08-26 17:00 IST is 11:30 UTC
}

export function createGoogleCalendarUrl(event: WeddingEventDetails): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${event.startDate}/${event.endDate}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function downloadIcsFile(event: WeddingEventDetails, filename: string = 'wedding-invitation.ics') {
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mohan & Leepika Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `DTSTART:${event.startDate}`,
    `DTEND:${event.endDate}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
