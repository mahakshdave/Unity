import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { useLocalSearchParams, Link, useRouter } from 'expo-router';
import ScreenHeader from '@/components/common/ScreenHeader';
import Colors from '@/constants/Colors';
import { mockTurfs } from '@/data/mockTurfs';
import { MapPin, Clock, Users, Star, Calendar } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SPORTS_MAP: Record<string, string> = {
  football: 'Football',
  cricket: 'Cricket',
  basketball: 'Basketball',
  tennis: 'Tennis',
  volleyball: 'Volleyball',
  badminton: 'Badminton',
  hockey: 'Hockey',
};

const FACILITIES_MAP: Record<string, string> = {
  parking: 'Parking',
  changing_rooms: 'Changing Rooms',
  showers: 'Showers',
  floodlights: 'Floodlights',
  equipment_rental: 'Equipment Rental',
  refreshments: 'Refreshments',
  spectator_area: 'Spectator Area',
};

const SURFACES_MAP: Record<string, string> = {
  natural_grass: 'Natural Grass',
  artificial_grass: 'Artificial Grass',
  synthetic: 'Synthetic',
  clay: 'Clay',
  concrete: 'Concrete',
  wood: 'Wood',
};

export default function TurfDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const turf = mockTurfs.find(t => t.id === id);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  if (!turf) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Turf Details" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Turf not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  // Animation for header transparency
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const renderDot = (index: number) => {
    return (
      <View
        key={index}
        style={[
          styles.dot,
          index === activeImageIndex && styles.activeDot,
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.animatedHeader,
        { opacity: headerOpacity }
      ]}>
        <ScreenHeader title={turf.name} showBackButton />
      </Animated.View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.imageCarouselContainer}>
          <FlatList
            data={turf.photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.floor(
                event.nativeEvent.contentOffset.x / width
              );
              setActiveImageIndex(index);
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.turfImage} />
            )}
            keyExtractor={(_, index) => index.toString()}
          />
          
          <View style={styles.paginationDots}>
            {turf.photos.map((_, index) => renderDot(index))}
          </View>
          
          <TouchableOpacity 
            style={styles.backButtonAbsolute}
            onPress={() => router.back()}
          >
            <View style={styles.backButtonCircle}>
              <Text style={styles.backButtonText}>←</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.turfName}>{turf.name}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.neutral[500]} />
            <Text style={styles.locationText}>{turf.location.address}, {turf.location.city}</Text>
          </View>
          
          <View style={styles.ratingRow}>
            <View style={styles.rating}>
              <Star size={16} color={Colors.accent[500]} fill={Colors.accent[500]} />
              <Text style={styles.ratingText}>{turf.rating.average} ({turf.rating.count} reviews)</Text>
            </View>
            
            <Text style={styles.price}>₹{turf.pricing.hourly}/hr</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Clock size={20} color={Colors.primary[500]} />
              <Text style={styles.detailText}>
                {turf.availableHours.opening} - {turf.availableHours.closing}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Users size={20} color={Colors.primary[500]} />
              <Text style={styles.detailText}>
                {turf.minPlayers}-{turf.maxPlayers} players
              </Text>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{turf.description}</Text>
          
          <Text style={styles.sectionTitle}>Sports</Text>
          <View style={styles.tagsContainer}>
            {turf.sports.map((sport) => (
              <View key={sport} style={styles.tag}>
                <Text style={styles.tagText}>{SPORTS_MAP[sport]}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Facilities</Text>
          <View style={styles.tagsContainer}>
            {turf.facilities.map((facility) => (
              <View key={facility} style={styles.tag}>
                <Text style={styles.tagText}>{FACILITIES_MAP[facility]}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Surface Types</Text>
          <View style={styles.tagsContainer}>
            {turf.surfaces.map((surface) => (
              <View key={surface} style={styles.tag}>
                <Text style={styles.tagText}>{SURFACES_MAP[surface]}</Text>
              </View>
            ))}
          </View>
          
          {/* Spacing to ensure bottom buttons don't cover content */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
      
      <View style={styles.bottomBar}>
        <Link href={`/booking/${turf.id}`} asChild>
          <TouchableOpacity style={styles.checkAvailabilityButton}>
            <Calendar size={20} color="#FFFFFF" />
            <Text style={styles.checkAvailabilityButtonText}>Check Availability</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  animatedHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    backgroundColor: Colors.background.default,
  },
  imageCarouselContainer: {
    position: 'relative',
  },
  turfImage: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  paginationDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  backButtonAbsolute: {
    position: 'absolute',
    left: 16,
    top: 50,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: Colors.text.primary,
  },
  contentContainer: {
    padding: 16,
  },
  turfName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 6,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  price: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary[500],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[200],
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  detailText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 6,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: Colors.background.alt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.text.primary,
  },
  bottomSpacing: {
    height: 80,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.default,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  checkAvailabilityButton: {
    flex: 1,
    backgroundColor: Colors.primary[500],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkAvailabilityButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.inverse,
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});