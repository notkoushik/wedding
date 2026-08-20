import type { WeddingEventDetails } from '../types/wedding'
import { weddingData } from '../data/weddingData'

export type { WeddingEventDetails }

export const WEDDING_CEREMONY_EVENT: WeddingEventDetails =
  weddingData.events.find((e) => e.id === 'muhurtham')?.calendarEvent || {
    title: `${weddingData.couple.namesCombinedEn} - Sumuhurtham (Wedding Ceremony)`,
    description: `Auspicious Wedding Ceremony of ${weddingData.couple.namesCombinedEn}.`,
    location: weddingData.venues[0]?.address || 'Hyderabad',
    startDate: '20260822T182900Z',
    endDate: '20260822T223000Z',
  }

export const RECEPTION_EVENT: WeddingEventDetails =
  weddingData.events.find((e) => e.id === 'reception')?.calendarEvent || {
    title: `${weddingData.couple.namesCombinedEn} - Wedding Reception`,
    description: `Grand Wedding Reception celebrating ${weddingData.couple.namesCombinedEn}.`,
    location: weddingData.venues[1]?.address || 'Visakhapatnam',
    startDate: '20260826T063000Z',
    endDate: '20260826T113000Z',
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
    `PRODID:-//${weddingData.couple.shortNamesEn} Wedding//EN`,
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
