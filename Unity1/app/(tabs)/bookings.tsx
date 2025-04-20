import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import ScreenHeader from '@/components/common/ScreenHeader';
import Colors from '@/constants/Colors';
import { Calendar, MapPin, User } from 'lucide-react-native';
import { mockBookings, mockTurfs } from '@/data/mockTurfs';

type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<BookingStatus>('upcoming');
  const router = useRouter();
  
  // Filter bookings based on active tab
  const filteredBookings = mockBookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return booking.bookingStatus === 'confirmed';
    } else if (activeTab === 'completed') {
      return booking.bookingStatus === 'completed';
    } else {
      return booking.bookingStatus === 'cancelled';
    }
  });
  
  // Get turf details for a booking
  const getTurfDetails = (turfId: string) => {
    return mockTurfs.find(turf => turf.id === turfId) || null;
  };
  
  const renderBookingItem = ({ item }: { item: typeof mockBookings[0] }) => {
    const turf = getTurfDetails(item.turfId);
    if (!turf) return null;
    
    return (
      <TouchableOpacity 
        style={styles.bookingCard}
        onPress={() => router.push(`/booking-details/${item.id}`)}
      >
        <View style={styles.bookingHeader}>
          <View style={styles.turfImageContainer}>
            <Image source={{ uri: turf.photos[0] }} style={styles.turfImage} />
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
              {item.date} • {item.startTime} to {item.endTime}
            </Text>
          </View>
          
          <View style={styles.bookingDetailRow}>
            <User size={16} color={Colors.primary[500]} />
            <Text style={styles.bookingDetailText}>
              {item.totalPlayers} players • {item.sport}
            </Text>
          </View>
        </View>
        
        <View style={styles.bookingFooter}>
          <View>
            <Text style={styles.amountLabel}>Amount Paid</Text>
            <Text style={styles.amountValue}>₹{item.totalAmount}</Text>
          </View>
          
          {item.needPlayers && item.playersNeeded > 0 && (
            <View style={styles.playersNeededBadge}>
              <Text style={styles.playersNeededText}>
                Need {item.playersNeeded} players
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      {activeTab === 'upcoming' ? (
        <>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg' }} 
            style={styles.emptyStateImage}
          />
          <Text style={styles.emptyStateTitle}>No upcoming bookings</Text>
          <Text style={styles.emptyStateMessage}>
            Book a turf to get started and it will appear here
          </Text>
          <Link href="/(tabs)" asChild>
            <TouchableOpacity style={styles.bookTurfButton}>
              <Text style={styles.bookTurfButtonText}>Find a Turf</Text>
            </TouchableOpacity>
          </Link>
        </>
      ) : activeTab === 'completed' ? (
        <>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/47343/the-ball-stadion-horn-corner-47343.jpeg' }} 
            style={styles.emptyStateImage}
          />
          <Text style={styles.emptyStateTitle}>No completed bookings</Text>
          <Text style={styles.emptyStateMessage}>
            Your completed bookings will be displayed here
          </Text>
        </>
      ) : (
        <>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg' }} 
            style={styles.emptyStateImage}
          />
          <Text style={styles.emptyStateTitle}>No cancelled bookings</Text>
          <Text style={styles.emptyStateMessage}>
            Any bookings you cancel will appear here
          </Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Bookings" />
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'completed' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('completed')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'completed' && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'cancelled' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'cancelled' && styles.activeTabText,
            ]}
          >
            Cancelled
          </Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary[500],
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary[500],
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
  },
  turfImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    textTransform: 'capitalize',
  },
  bookingFooter: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  amountValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.primary[500],
  },
  playersNeededBadge: {
    backgroundColor: Colors.accent[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  playersNeededText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.accent[700],
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
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
  bookTurfButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookTurfButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.inverse,
  },
});