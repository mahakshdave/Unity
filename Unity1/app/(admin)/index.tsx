import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import ScreenHeader from '@/components/common/ScreenHeader';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { mockTurfs, mockBookings } from '@/data/mockTurfs';
import { Bell, Calendar, MapPin, ChartBar as BarChart3, LogOut, Plus, Radar, Users, Clock } from 'lucide-react-native';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  // Filter turfs owned by the current admin
  const adminTurfs = mockTurfs.filter(turf => turf.owner.id === user?.id);
  
  // Get all bookings for the admin's turfs
  const adminBookings = mockBookings.filter(booking => 
    adminTurfs.some(turf => turf.id === booking.turfId)
  );
  
  // Calculate statistics
  const totalBookings = adminBookings.length;
  const confirmedBookings = adminBookings.filter(b => b.bookingStatus === 'confirmed').length;
  const totalRevenue = adminBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };
  
  // Render single turf card
  const renderTurfCard = (turf: typeof mockTurfs[0]) => {
    return (
      <TouchableOpacity 
        key={turf.id}
        style={styles.turfCard}
        onPress={() => router.push(`/turf/${turf.id}`)}
      >
        <Image source={{ uri: turf.photos[0] }} style={styles.turfImage} />
        <View style={styles.turfCardContent}>
          <Text style={styles.turfName}>{turf.name}</Text>
          <View style={styles.turfLocation}>
            <MapPin size={14} color={Colors.neutral[500]} />
            <Text style={styles.turfLocationText}>{turf.location.city}, {turf.location.state}</Text>
          </View>
          
          <View style={styles.turfStats}>
            <View style={styles.turfStatItem}>
              <Users size={14} color={Colors.primary[600]} />
              <Text style={styles.turfStatText}>{turf.minPlayers}-{turf.maxPlayers}</Text>
            </View>
            
            <View style={styles.turfStatItem}>
              <Clock size={14} color={Colors.primary[600]} />
              <Text style={styles.turfStatText}>{turf.availableHours.opening}-{turf.availableHours.closing}</Text>
            </View>
            
            <View style={styles.turfStatItem}>
              <Text style={styles.turfPrice}>₹{turf.pricing.hourly}/hr</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Admin Dashboard" 
        rightComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSignOut}>
              <LogOut size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
        }
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.adminInfoSection}>
          <View style={styles.adminInfo}>
            <Image 
              source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?u=admin' }} 
              style={styles.adminImage}
            />
            <View>
              <Text style={styles.adminName}>Welcome, {user?.name}</Text>
              <Text style={styles.adminSubtitle}>Turf Owner</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: Colors.primary[100] }]}>
                <Radar size={24} color={Colors.primary[600]} />
              </View>
              <Text style={styles.statValue}>{adminTurfs.length}</Text>
              <Text style={styles.statLabel}>Active Turfs</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: Colors.accent[100] }]}>
                <Calendar size={24} color={Colors.accent[600]} />
              </View>
              <Text style={styles.statValue}>{totalBookings}</Text>
              <Text style={styles.statLabel}>Total Bookings</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: Colors.success[100] }]}>
                <BarChart3 size={24} color={Colors.success[500]} />
              </View>
              <Text style={styles.statValue}>₹{totalRevenue}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsSection}>
          <Link href="/admin/bookings" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Calendar size={24} color={Colors.primary[500]} />
              <Text style={styles.actionButtonText}>View Bookings</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/admin/add-turf" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Plus size={24} color={Colors.primary[500]} />
              <Text style={styles.actionButtonText}>Add New Turf</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        <View style={styles.turfsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Turfs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {adminTurfs.length > 0 ? (
            <View style={styles.turfsList}>
              {adminTurfs.map(turf => renderTurfCard(turf))}
            </View>
          ) : (
            <View style={styles.noTurfsContainer}>
              <Text style={styles.noTurfsText}>You haven't added any turfs yet</Text>
              <Link href="/admin/add-turf" asChild>
                <TouchableOpacity style={styles.addTurfButton}>
                  <Text style={styles.addTurfButtonText}>Add Turf</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>
        
        <View style={styles.recentBookingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <Link href="/admin/bookings" asChild>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          {adminBookings.length > 0 ? (
            <View style={styles.recentBookingsList}>
              {adminBookings.slice(0, 2).map(booking => {
                const turf = adminTurfs.find(t => t.id === booking.turfId);
                if (!turf) return null;
                
                return (
                  <View key={booking.id} style={styles.bookingItem}>
                    <View style={styles.bookingItemLeft}>
                      <View style={styles.bookingIconContainer}>
                        <Calendar size={24} color={Colors.primary[500]} />
                      </View>
                      
                      <View style={styles.bookingDetails}>
                        <Text style={styles.bookingTurf}>{turf.name}</Text>
                        <Text style={styles.bookingInfo}>
                          {booking.date} • {booking.startTime} to {booking.endTime}
                        </Text>
                        <Text style={styles.bookingExtra}>
                          {booking.totalPlayers} players • {booking.sport}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.bookingAmount}>₹{booking.totalAmount}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.noBookingsContainer}>
              <Text style={styles.noBookingsText}>No bookings yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginRight: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  adminInfoSection: {
    backgroundColor: Colors.primary[500],
    padding: 20,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  adminName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.inverse,
  },
  adminSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.primary[100],
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.background.default,
    borderRadius: 8,
    padding: 16,
    width: '31%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  actionsSection: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: Colors.background.alt,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  actionButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 12,
  },
  turfsSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[500],
  },
  turfsList: {
    gap: 16,
  },
  turfCard: {
    backgroundColor: Colors.background.default,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  turfImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  turfCardContent: {
    padding: 16,
  },
  turfName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  turfLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  turfLocationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  turfStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  turfStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  turfStatText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  turfPrice: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.primary[500],
  },
  noTurfsContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: Colors.background.alt,
    borderRadius: 8,
  },
  noTurfsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  addTurfButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addTurfButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.inverse,
  },
  recentBookingsSection: {
    padding: 16,
  },
  recentBookingsList: {
    gap: 12,
  },
  bookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.default,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  bookingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookingDetails: {
    flex: 1,
  },
  bookingTurf: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
  },
  bookingInfo: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  bookingExtra: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    textTransform: 'capitalize',
  },
  bookingAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.primary[500],
  },
  noBookingsContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: Colors.background.alt,
    borderRadius: 8,
  },
  noBookingsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
  },
});