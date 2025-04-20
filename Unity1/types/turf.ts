// Turf type definitions

export type TurfFacility = 
  | 'parking'
  | 'changing_rooms'
  | 'showers'
  | 'floodlights'
  | 'equipment_rental'
  | 'refreshments'
  | 'spectator_area';

export type TurfSport = 
  | 'football'
  | 'cricket'
  | 'tennis'
  | 'basketball'
  | 'volleyball'
  | 'badminton'
  | 'hockey';

export type TurfSurface = 
  | 'natural_grass'
  | 'artificial_grass'
  | 'synthetic'
  | 'clay'
  | 'concrete'
  | 'wood';

export type TurfRating = {
  average: number;
  count: number;
};

export interface Turf {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  sports: TurfSport[];
  surfaces: TurfSurface[];
  facilities: TurfFacility[];
  photos: string[];
  pricing: {
    hourly: number;
    currency: string;
  };
  availableHours: {
    opening: string; // 24-hour format, e.g., "09:00"
    closing: string; // 24-hour format, e.g., "22:00"
  };
  minPlayers: number;
  maxPlayers: number;
  rating: TurfRating;
  owner: {
    id: string;
    name: string;
  };
}

export interface TurfAvailability {
  turfId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  slots: {
    startTime: string; // 24-hour format, e.g., "09:00"
    endTime: string; // 24-hour format, e.g., "10:00"
    available: boolean;
    price: number;
  }[];
}

export interface BookingDetails {
  id: string;
  turfId: string;
  userId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // 24-hour format, e.g., "09:00"
  endTime: string; // 24-hour format, e.g., "10:00"
  sport: TurfSport;
  totalPlayers: number;
  pricePerPlayer: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  bookingStatus: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string; // ISO datetime string
  needPlayers: boolean;
  playersNeeded: number;
}

export interface PlayerRequest {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: string; // ISO datetime string
}