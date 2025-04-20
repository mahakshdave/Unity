import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { Search, MapPin, Star, Filter } from 'lucide-react-native';
import { mockTurfs } from '@/data/mockTurfs';
import { Turf, TurfSport } from '@/types/turf';

const SPORTS: { id: TurfSport; name: string; icon: string }[] = [
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'badminton', name: 'Badminton', icon: '🏸' },
  { id: 'hockey', name: 'Hockey', icon: '🏑' },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

export default function HomeScreen() {
  const { user } = useAuth();
  const [selectedSport, setSelectedSport] = useState<TurfSport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTurfs = mockTurfs.filter(turf => {
    // Filter by sport if selected
    if (selectedSport && !turf.sports.includes(selectedSport)) {
      return false;
    }
    
    // Filter by search query if any
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        turf.name.toLowerCase().includes(query) ||
        turf.location.city.toLowerCase().includes(query) ||
        turf.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const renderTurfCard = ({ item }: { item: Turf }) => (
    <Link href={`/turf/${item.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.photos[0] }} style={styles.cardImage} />
          <View style={styles.sportBadges}>
            {item.sports.map((sport) => (
              <View key={sport} style={styles.sportBadge}>
                <Text>{SPORTS.find(s => s.id === sport)?.icon}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          
          <View style={styles.cardLocationContainer}>
            <MapPin size={14} color={Colors.neutral[500]} />
            <Text style={styles.cardLocation}>
              {item.location.city}, {item.location.state}
            </Text>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.ratingContainer}>
              <Star size={14} color={Colors.accent[500]} fill={Colors.accent[500]} />
              <Text style={styles.ratingText}>
                {item.rating.average} ({item.rating.count})
              </Text>
            </View>
            
            <Text style={styles.priceText}>
              ₹{item.pricing.hourly}/hr
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name}! 👋</Text>
            <Text style={styles.subGreeting}>Find and book your perfect turf</Text>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.neutral[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search turfs..."
              placeholderTextColor={Colors.neutral[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={Colors.neutral[600]} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.sportsFilter}>
          <Text style={styles.sectionTitle}>Sports</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sportsScroll}
          >
            <TouchableOpacity
              style={[
                styles.sportItem,
                selectedSport === null && styles.sportItemActive,
              ]}
              onPress={() => setSelectedSport(null)}
            >
              <Text style={[
                styles.sportText,
                selectedSport === null && styles.sportTextActive,
              ]}>All</Text>
            </TouchableOpacity>
            
            {SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={[
                  styles.sportItem,
                  selectedSport === sport.id && styles.sportItemActive,
                ]}
                onPress={() => setSelectedSport(sport.id)}
              >
                <Text style={styles.sportIcon}>{sport.icon}</Text>
                <Text style={[
                  styles.sportText,
                  selectedSport === sport.id && styles.sportTextActive,
                ]}>{sport.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.turfSection}>
          <Text style={styles.sectionTitle}>Available Turfs</Text>
          
          {filteredTurfs.length > 0 ? (
            <FlatList
              data={filteredTurfs}
              keyExtractor={(item) => item.id}
              renderItem={renderTurfCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + 16}
              decelerationRate="fast"
              contentContainerStyle={styles.turfList}
              scrollEventThrottle={16}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No turfs match your filters</Text>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setSelectedSport(null);
                  setSearchQuery('');
                }}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Deals</Text>
          
          <View style={styles.featuredCard}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg' }} 
              style={styles.featuredImage}
            />
            <View style={styles.featuredOverlay}>
              <Text style={styles.featuredTitle}>Weekend Special!</Text>
              <Text style={styles.featuredDescription}>Get 20% off on all bookings this weekend</Text>
              <TouchableOpacity style={styles.featuredButton}>
                <Text style={styles.featuredButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.primary[500],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: Colors.text.inverse,
  },
  subGreeting: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.primary[100],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.primary,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sportsFilter: {
    marginTop: 24,
  },
  sportsScroll: {
    paddingHorizontal: 16,
  },
  sportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.alt,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sportItemActive: {
    backgroundColor: Colors.primary[500],
  },
  sportIcon: {
    marginRight: 4,
    fontSize: 14,
  },
  sportText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.primary,
  },
  sportTextActive: {
    color: Colors.text.inverse,
  },
  turfSection: {
    marginTop: 24,
  },
  turfList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.background.default,
    borderRadius: 12,
    marginRight: 16,
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
  imageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  sportBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
  },
  sportBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cardLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLocation: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  priceText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[500],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary[500],
    borderRadius: 8,
  },
  resetButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.inverse,
  },
  featuredSection: {
    marginTop: 24,
  },
  featuredCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    justifyContent: 'center',
  },
  featuredTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.text.inverse,
    marginBottom: 8,
  },
  featuredDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.inverse,
    marginBottom: 16,
  },
  featuredButton: {
    backgroundColor: Colors.accent[500],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  featuredButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.inverse,
  },
});