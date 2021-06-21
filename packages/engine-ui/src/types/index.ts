import * as state from './state'

export enum BookingStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  DELIVERED = 'delivered',
  DELIVERY_FAILED = 'delivery_failed',
  PICKED_UP = 'picked_up',
}

export type Capacity = { weight: number; volume: number }

interface BookingRoute {
  distance: number
  duration: number
  geometry: {
    coordinates: {
      lat: number
      lon: number
    }[]
    legs: any[]
    weight: number
    weight_name: string
  }
}

export type Events = {
  timestamp?: string
  type: string
}
export interface Booking {
  events: Events[]
  assignedTo: {
    id: string
  }
  id: string
  externalId?: string
  pickup: ParcelAddress
  delivery: ParcelAddress
  metadata: Metadata
  route: BookingRoute
  size: Size
  status: BookingStatus
}

type ParcelAddress = {
  name?: string
  lat: number
  lon: number
  street: string
  city: string
  timeWindows: TimeWindow[] | null
}

type Size = {
  weight?: number
  measurements?: number[]
}

type Metadata = {
  cargo?: string
  fragile: boolean
  sender: { name?: string; contact: string }
  recipient: { name?: string; contact: string }
}

type TransportMetadata = {
  fleet: string
  profile: string
  driver: {
    name?: string
    contact?: string
  }
}

export type TimeWindow = {
  earliest: string | Date
  latest: string | Date
}

export type InAppColor = string

export type Transport = {
  activities: Activity[] | null
  bookingIds: string[] | null
  capacity?: Capacity
  color: InAppColor
  currentRoute: any
  earliestStart: Date
  endAddress: Address
  id: string
  latestEnd: Date
  startAddress: Address
}

export type NotificationType = Transport | Booking

export interface ExcludedBooking {
  status: string
  id: string
  lat: number
  lon: number
}

export interface Plan {
  excludedBookings: ExcludedBooking[]
  routes: Route[]
}

export interface Route {
  activities: Activity[] | null
  bookingIds: string[] | null
  capacity?: { weight?: number; volume?: number }
  currentRoute: any
  earliestStart: Date
  endAddress: Address
  id: string
  latestEnd: Date
  startAddress: Address
}

export interface Address {
  lat: number
  lon: number
  name?: string
  city?: string
  street?: string
}

export interface Activity {
  address: Address
  index: number
  type: string
  id: string
  distance: number
  duration: number
}

export interface Signature {
  bookingId: string
  createdAt: string
  receipt: {
    base64Signature?: string
    photo?: string
    photoId?: string
  }
  __proto__: Object
  signedBy: string
  transportId: string
  type: string
}

export { state }
