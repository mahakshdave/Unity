import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Calendar, Share2, Chrome as Home } from 'lucide-react-native';

export default function BookingSuccessScreen() {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(100)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const handleViewBookings = () => {
    router.replace('/(tabs)/bookings');
  };
  
  const handleShareBooking = () => {
    // This would implement share functionality in a real app
    // For now, we'll just console log
    console.log('Sharing booking details');
  };
  
  const handleGoHome = () => {
    router.replace('/(tabs)');
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View 
          style={[
            styles.successContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.successIconContainer}>
            <View style={styles.checkIconContainer}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          </View>
          
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successMessage}>
            Your turf has been successfully booked. A confirmation has been sent to your email.
          </Text>
          
          <View style={styles.bookingDetailsCard}>
            <View style={styles.bookingDetail}>
              <Text style={styles.bookingDetailLabel}>Booking ID</Text>
              <Text style={styles.bookingDetailValue}>TB-29381</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.bookingDetail}>
              <Text style={styles.bookingDetailLabel}>Turf</Text>
              <Text style={styles.bookingDetailValue}>Green Valley Football Turf</Text>
            </View>
            
            <View style={styles.bookingDetail}>
              <Text style={styles.bookingDetailLabel}>Date & Time</Text>
              <Text style={styles.bookingDetailValue}>15 Apr 2025, 18:00 - 19:00</Text>
            </View>
            
            <View style={styles.bookingDetail}>
              <Text style={styles.bookingDetailLabel}>Sport</Text>
              <Text style={styles.bookingDetailValue}>Football</Text>
            </View>
            
            <View style={styles.bookingDetail}>
              <Text style={styles.bookingDetailLabel}>Players</Text>
              <Text style={styles.bookingDetailValue}>10 players</Text>
            </View>
            
            <View style={styles.bookingDetail}>
              <Text style={styles.bookingDetailLabel}>Amount Paid</Text>
              <Text style={styles.bookingDetailValue}>₹1,500</Text>
            </View>
          </View>
          
          {/* QR Code */}
          <View style={styles.qrCodeContainer}>
            <Text style={styles.qrCodeLabel}>Show this at the venue</Text>
            <Image 
              source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?data=TB-29381&size=200x200' }}
              style={styles.qrCode}
            />
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleViewBookings}
            >
              <Calendar size={20} color={Colors.text.inverse} />
              <Text style={styles.actionButtonText}>View Bookings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={handleShareBooking}
            >
              <Share2 size={20} color={Colors.primary[500]} />
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>Share</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={handleGoHome}
          >
            <Home size={20} color={Colors.text.secondary} />
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  content: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 48,
    color: Colors.text.inverse,
  },
  successTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bookingDetailsCard: {
    width: '100%',
    backgroundColor: Colors.background.alt,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  bookingDetail: {
    marginBottom: 12,
  },
  bookingDetailLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  bookingDetailValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[200],
    marginVertical: 12,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrCodeLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  qrCode: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: Colors.primary[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  actionButtonSecondary: {
    backgroundColor: Colors.background.default,
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  actionButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.inverse,
    marginLeft: 8,
  },
  actionButtonTextSecondary: {
    color: Colors.primary[500],
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  homeButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
});