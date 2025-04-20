import { Turf } from '@/types/turf';

export const mockTurfs: Turf[] = [
  {
    id: '1',
    name: 'Green Valley Football Turf',
    description: 'State-of-the-art football turf with premium artificial grass and professional floodlights for night games.',
    location: {
      address: '123 Sports Lane, Green Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      coordinates: {
        latitude: 19.0760,
        longitude: 72.8777,
      },
    },
    sports: ['football'],
    surfaces: ['artificial_grass'],
    facilities: ['parking', 'changing_rooms', 'floodlights', 'refreshments'],
    photos: [
      'https://images.pexels.com/photos/186239/pexels-photo-186239.jpeg',
      'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg',
      'https://images.pexels.com/photos/8032834/pexels-photo-8032834.jpeg',
    ],
    pricing: {
      hourly: 1500,
      currency: 'INR',
    },
    availableHours: {
      opening: '06:00',
      closing: '23:00',
    },
    minPlayers: 6,
    maxPlayers: 12,
    rating: {
      average: 4.7,
      count: 152,
    },
    owner: {
      id: '2',
      name: 'Admin User',
    },
  },
  {
    id: '2',
    name: 'SportzHub Arena',
    description: 'Multi-sport facility featuring high-quality surfaces for football, cricket, and basketball with excellent amenities.',
    location: {
      address: '45 Athletic Avenue, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      coordinates: {
        latitude: 12.9716,
        longitude: 77.5946,
      },
    },
    sports: ['football', 'cricket', 'basketball'],
    surfaces: ['artificial_grass', 'synthetic'],
    facilities: ['parking', 'changing_rooms', 'showers', 'floodlights', 'equipment_rental', 'refreshments', 'spectator_area'],
    photos: [
      'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg',
      'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg',
      'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg',
    ],
    pricing: {
      hourly: 2000,
      currency: 'INR',
    },
    availableHours: {
      opening: '05:30',
      closing: '22:30',
    },
    minPlayers: 4,
    maxPlayers: 22,
    rating: {
      average: 4.9,
      count: 213,
    },
    owner: {
      id: '2',
      name: 'Admin User',
    },
  },
  {
    id: '3',
    name: 'Urban Kicks',
    description: 'Centrally located football turf with night play facilities and a vibrant atmosphere.',
    location: {
      address: '78 Downtown Road, Andheri',
      city: 'Mumbai',
      state: 'Maharashtra',
      coordinates: {
        latitude: 19.1136,
        longitude: 72.8697,
      },
    },
    sports: ['football'],
    surfaces: ['synthetic'],
    facilities: ['floodlights', 'refreshments', 'equipment_rental'],
    photos: [
      'https://images.pexels.com/photos/1619860/pexels-photo-1619860.jpeg',
      'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
    ],
    pricing: {
      hourly: 1200,
      currency: 'INR',
    },
    availableHours: {
      opening: '16:00',
      closing: '01:00',
    },
    minPlayers: 6,
    maxPlayers: 12,
    rating: {
      average: 4.2,
      count: 89,
    },
    owner: {
      id: '2',
      name: 'Admin User',
    },
  },
  {
    id: '4',
    name: 'Premium Sports Complex',
    description: 'Luxury sports facility with multiple turfs, premium amenities, and professional coaching available.',
    location: {
      address: '10 Elite Street, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      coordinates: {
        latitude: 17.4256,
        longitude: 78.4069,
      },
    },
    sports: ['football', 'tennis', 'cricket', 'basketball'],
    surfaces: ['artificial_grass', 'clay', 'concrete'],
    facilities: ['parking', 'changing_rooms', 'showers', 'floodlights', 'equipment_rental', 'refreshments', 'spectator_area'],
    photos: [
      'https://images.pexels.com/photos/3601422/pexels-photo-3601422.jpeg',
      'https://images.pexels.com/photos/5885700/pexels-photo-5885700.jpeg',
      'https://images.pexels.com/photos/128457/pexels-photo-128457.jpeg',
    ],
    pricing: {
      hourly: 2500,
      currency: 'INR',
    },
    availableHours: {
      opening: '06:00',
      closing: '22:00',
    },
    minPlayers: 2,
    maxPlayers: 22,
    rating: {
      average: 4.8,
      count: 176,
    },
    owner: {
      id: '2',
      name: 'Admin User',
    },
  },
];

export const generateAvailabilityForTurf = (turfId: string, date: string) => {
  // Mock function to generate available slots for a given turf and date
  const availableSlots = [];
  const turf = mockTurfs.find(t => t.id === turfId);
  
  if (!turf) return { turfId, date, slots: [] };
  
  const opening = parseInt(turf.availableHours.opening.split(':')[0]);
  const closing = parseInt(turf.availableHours.closing.split(':')[0]);
  
  // Generate slots every hour
  for (let hour = opening; hour < closing; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    // Randomly determine if slot is available (80% chance of being available)
    const available = Math.random() > 0.2;
    
    availableSlots.push({
      startTime,
      endTime,
      available,
      price: turf.pricing.hourly,
    });
  }
  
  return {
    turfId,
    date,
    slots: availableSlots,
  };
};

export const mockBookings = [
  {
    id: 'booking1',
    turfId: '1',
    userId: '1',
    date: '2025-04-15',
    startTime: '18:00',
    endTime: '19:00',
    sport: 'football',
    totalPlayers: 10,
    pricePerPlayer: 150,
    totalAmount: 1500,
    paymentStatus: 'completed',
    bookingStatus: 'confirmed',
    createdAt: '2025-04-10T15:30:00Z',
    needPlayers: true,
    playersNeeded: 2,
  },
  {
    id: 'booking2',
    turfId: '2',
    userId: '1',
    date: '2025-04-20',
    startTime: '16:00',
    endTime: '18:00',
    sport: 'cricket',
    totalPlayers: 22,
    pricePerPlayer: 180,
    totalAmount: 4000,
    paymentStatus: 'completed',
    bookingStatus: 'confirmed',
    createdAt: '2025-04-12T10:15:00Z',
    needPlayers: false,
    playersNeeded: 0,
  },
];

export const playerRequests = [
  {
    id: 'req1',
    bookingId: 'booking1',
    userId: 'player2',
    userName: 'Rahul Sharma',
    userAvatar: 'https://i.pravatar.cc/150?u=player2',
    status: 'pending',
    requestedAt: '2025-04-12T14:30:00Z',
  },
  {
    id: 'req2',
    bookingId: 'booking1',
    userId: 'player3',
    userName: 'Priya Patel',
    userAvatar: 'https://i.pravatar.cc/150?u=player3',
    status: 'accepted',
    requestedAt: '2025-04-11T09:45:00Z',
  },
];