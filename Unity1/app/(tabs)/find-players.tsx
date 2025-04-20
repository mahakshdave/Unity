import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import ScreenHeader from '@/components/common/ScreenHeader';
import Colors from '@/constants/Colors';
import { Calendar, MapPin, Clock, Users, Search } from 'lucide-react-native';
import { mockBookings, mockTurfs, playerRequests } from '@/data/mockTurfs';

type FilterType = 'all' | 'today' | 'tomorrow' | 'weekend';

export default function FindPlayersScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  // Filter bookings that need players
  const bookingsNeedingPlayers = mockBookings.filter(booking => 
    booking.needPlayers && 
    booking.playersNeeded > 0 &&
    booking.bookingStatus === 'confirmed'
  );
  
  // Get turf details for a booking
  const getTurfDetails = (turfId: string) => {
    return mockTurfs.find(turf => turf.id === turfId) || null;
  };
  
  // Apply filters
  const filteredBookings = bookingsNeedingPlayers.filter(booking => {
    // Apply search filter
    if (searchQuery) {
      const turf = getTurfDetails(booking.turfId);
      if (!turf) return false;
      
      const query = searchQuery.toLowerCase();
      return (
        turf.name.toLowerCase().includes(query) ||
        turf.location.city.toLowerCase().includes(query) ||
        booking.sport.toLowerCase().includes(query)
      );
    }
    
    // Apply date filter
    if (activeFilter === 'all') {
      return true;
    } else if (activeFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return booking.date === today;
    } else if (activeFilter === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      return booking.date === tomorrowStr;
    } else if (activeFilter === 'weekend') {
      // For demo purposes, assuming the next 2 days are the weekend
      const weekend = new Date();
      weekend.setDate(weekend.getDate() + 2);
      const weekendStr = weekend.toISOString().split('T')[0];
      return booking.date === weekendStr;
    }
    
    return true;
  });
  
  const renderBookingItem = ({ item }: { item: typeof bookingsNeedingPlayers[0] }) => {
    const turf = getTurfDetails(item.turfId);
    if (!turf) return null;
    
    return (
      <TouchableOpacity 
        style={styles.bookingCard}
        onPress={() => router.push(`/join-match/${item.id}`)}
      >
        <View style={styles.bookingHeader}>
          <View style={styles.turfImageContainer}>
            <Image source={{ uri: turf.photos[0] }} style={styles.turfImage} />
            <View style={styles.sportBadge}>
              <Text style={styles.sportBadgeText}>{item.sport}</Text>
            </View>
          </View>
          
          <View style={styles.bookingHeaderInfo}>
            <Text style={styles.turfName}>{turf.name}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={14} color={Colors.neutral[500]} />
              <Text style={styles.locationText}>{turf.location.city}, {turf.location.state}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.bookingDetails}>
          <View style={styles.bookingDetailRow}>
            <Calendar size={16} color={Colors.primary[500]} />
            <Text style={styles.bookingDetailText}>
              {item.date}
            </Text>
          </View>
          
          <View style={styles.bookingDetailRow}>
            <Clock size={16} color={Colors.primary[500]} />
            <Text style={styles.bookingDetailText}>
              {item.startTime} to {item.endTime}
            </Text>
          </View>
          
          <View style={styles.bookingDetailRow}>
            <Users size={16} color={Colors.primary[500]} />
            <Text style={styles.bookingDetailText}>
              {item.totalPlayers} players joined • {item.playersNeeded} spots left
            </Text>
          </View>
        </View>
        
        <View style={styles.bookingFooter}>
          <View>
            <Text style={styles.priceLabel}>Price per player</Text>
            <Text style={styles.priceValue}>₹{item.pricePerPlayer}</Text>
          </View>
          
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Match</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image 
        source={{ uri: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg' }} 
        style={styles.emptyStateImage}
      />
      <Text style={styles.emptyStateTitle}>No matches found</Text>
      <Text style={styles.emptyStateMessage}>
        There are no matches looking for players right now.
        Try changing your filters or check back later.
      </Text>
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={() => {
          setActiveFilter('all');
          setSearchQuery('');
        }}
      >
        <Text style={styles.resetButtonText}>Reset Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Find Players" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.neutral[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location, sport..."
            placeholderTextColor={Colors.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollableFilters 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </View>
      
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.bookingsList}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

type ScrollableFiltersProps = {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
};

function ScrollableFilters({ activeFilter, setActiveFilter }: ScrollableFiltersProps) {
  return (
    <View style={styles.scrollableFilters}>
      <TouchableOpacity
        style={[
          styles.filterItem,
          activeFilter === 'all' && styles.activeFilterItem,
        ]}
        onPress={() => setActiveFilter('all')}
      >
        <Text 
          style={[
            styles.filterText,
            activeFilter === 'all' && styles.activeFilterText,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterItem,
          activeFilter === 'today' && styles.activeFilterItem,
        ]}
        onPress={() => setActiveFilter('today')}
      >
        <Text 
          style={[
            styles.filterText,
            activeFilter === 'today' && styles.activeFilterText,
          ]}
        >
          Today
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterItem,
          activeFilter === 'tomorrow' && styles.activeFilterItem,
        ]}
        onPress={() => setActiveFilter('tomorrow')}
      >
        <Text 
          style={[
            styles.filterText,
            activeFilter === 'tomorrow' && styles.activeFilterText,
          ]}
        >
          Tomorrow
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterItem,
          activeFilter === 'weekend' && styles.activeFilterItem,
        ]}
        onPress={() => setActiveFilter('weekend')}
      >
        <Text 
          style={[
            styles.filterText,
            activeFilter === 'weekend' && styles.activeFilterText,
          ]}
        >
          Weekend
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.alt,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.primary,
  },
  filtersContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  scrollableFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  filterItem: {
    backgroundColor: Colors.background.alt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterItem: {
    backgroundColor: Colors.primary[500],
  },
  filterText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.primary,
  },
  activeFilterText: {
    color: Colors.text.inverse,
  },
  bookingsList: {
    padding: 16,
    flexGrow: 1,
  },
  bookingCard: {
    backgroundColor: Colors.background.default,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  bookingHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  turfImageContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  turfImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sportBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sportBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  bookingHeaderInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  turfName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  bookingDetails: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  bookingDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingDetailText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  bookingFooter: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  priceValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.primary[500],
  },
  joinButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.inverse,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.inverse,
  },
});