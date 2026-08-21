export interface PersonDetails {
  titleEn: string
  titleTe: string
  nameEn: string
  nameTe: string
  parentDetailsEn?: string
  parentDetailsTe?: string
  hometownEn?: string
  hometownTe?: string
}

export interface ParentsInfo {
  groomFatherEn: string
  groomFatherTe: string
  groomMotherEn: string
  groomMotherTe: string
  groomParentsEn: string
  groomParentsTe: string
  groomParentsCityEn: string
  groomParentsCityTe: string
  brideFatherEn: string
  brideFatherTe: string
  brideMotherEn?: string
  brideMotherTe?: string
  brideParentsEn: string
  brideParentsTe: string
  brideParentsCityEn: string
  brideParentsCityTe: string
  ancestorsEn?: string
  ancestorsTe?: string
}

export interface MuhurthamDetails {
  dateTime: Date
  dateStringEn: string
  dateStringTe: string
  timeStringEn: string
  timeStringTe: string
  thithiEn: string
  thithiTe: string
  nakshatramEn: string
  nakshatramTe: string
  lagnamEn: string
  lagnamTe: string
  fullMuhurthamAstroEn: string
  fullMuhurthamAstroTe: string
}

export interface WeddingEventDetails {
  title: string
  description: string
  location: string
  startDate: string
  endDate: string
}

export interface WeddingEvent {
  id: string
  emoji: string
  title: string
  titleTelugu: string
  subtitle: string
  day: string
  date: string
  time: string
  nakshatram: string
  nakshatramTelugu: string
  venueName: string
  venueAddress: string
  dressCode: string
  dressCodeTelugu: string
  calendarEvent: WeddingEventDetails
  mapLink: string
}

export interface VenueLocation {
  type: string
  typeTelugu: string
  name: string
  city: string
  address: string
  landmark: string
  date: string
  time: string
  map: string
  icon: string
  uberLink?: string
  appleMapsLink?: string
  parkingInfo?: string
  gateInfo?: string
}

export interface RitualStory {
  id: string
  number: string
  titleTelugu: string
  titleEnglish: string
  shloka: string
  significanceTelugu: string
  significanceEnglish: string
  culturalDetailsTelugu: string[]
  culturalDetailsEnglish: string[]
  image: string
}

export interface GalleryPhoto {
  url: string
  title: string
  alt: string
  tall: boolean
}

export interface AudioTrack {
  id: number
  titleTelugu: string
  titleEnglish: string
  subtitle: string
  url: string
  cover?: string
}

export interface WishItem {
  id: string
  name: string
  relation: string
  location?: string
  message: string
  audioUrl?: string
  audioDuration?: number
  videoUrl?: string
  photoUrl?: string
  timeAgo: string
  likes: number
}

export interface LiveStreamConfig {
  isLive: boolean
  titleEn: string
  titleTe: string
  streamUrl: string
  platform: 'youtube' | 'zoom' | 'facebook' | 'custom'
  startTimeEn: string
  startTimeTe: string
  descriptionEn: string
  descriptionTe: string
}

export interface WeddingSiteConfig {
  couple: {
    groom: PersonDetails
    bride: PersonDetails
    namesCombinedEn: string
    namesCombinedTe: string
    shortNamesEn: string
    shortNamesTe: string
    familyHeaderEn: string
    familyHeaderTe: string
    sanskritHeader: string
    sanskritHeaderTe: string
    taglineEn: string
    taglineTe: string
    avatarImage: string
    portraitImage: string
    coverCardImage: string
  }
  parents: ParentsInfo
  muhurtham: MuhurthamDetails
  events: WeddingEvent[]
  venues: VenueLocation[]
  rituals: RitualStory[]
  gallery: GalleryPhoto[]
  playlist: AudioTrack[]
  initialWishes: WishItem[]
  compliments: {
    te: string
    en: string
  }
  liveStream?: LiveStreamConfig
  socialShare: {
    whatsappInvitationText: (url: string) => string
    whatsappGeneralText: (url: string) => string
  }
}
