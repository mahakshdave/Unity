import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenHeader from '@/components/common/ScreenHeader';
import Colors from '@/constants/Colors';
import { mockTurfs } from '@/data/mockTurfs';
import { Turf } from '@/types/turf';
import { CircleMinus as MinusCircle, CirclePlus as PlusCircle, Users } from 'lucide-react-native';

export default function BookingPlayersScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { turfId, date, time, sport } = params;
  
  const [turf, setTurf] = useState<Turf | null>(null);
  const [playerCount, setPlayerCount] = useState(6);
  const [needMorePlayers, setNeedMorePlayers] = useState(false);
  const [playersNeeded, setPlayersNeeded] = useState(0);
  const [pricePerPlayer, setPricePerPlayer] = useState(0);
  
  useEffect(() => {
    if (turfId) {
      const turfData = mockTurfs.find(t => t.id === turfId);
      setTurf(turfData || null);
      
      if (turfData) {
        setPlayerCount(turfData.minPlayers);
        setPricePerPlayer(Math.ceil(turfData.pricing.hourly / turfData.minPlayers));
      }
    }
  }, [turfId]);
  
  const increasePlayerCount = () => {
    if (turf && playerCount < turf.maxPlayers) {
      setPlayerCount(playerCount + 1);
      updatePricePerPlayer(playerCount + 1);
    }
  };
  
  const decreasePlayerCount = () => {
    if (turf && playerCount > turf.minPlayers) {
      setPlayerCount(playerCount - 1);
      updatePricePerPlayer(playerCount - 1);
    }
  };
  
  const updatePricePerPlayer = (count: number) => {
    if (turf) {
      setPricePerPlayer(Math.ceil(turf.pricing.hourly / count));
    }
  };
  
  const handleContinue = () => {
    router.push({
      pathname: '/booking/payment',
      params: {
        turfId,
        date,
        time,
        sport,
        players: playerCount.toString(),
        needPlayers: needMorePlayers.toString(),
        playersNeeded: playersNeeded.toString(),
        pricePerPlayer: pricePerPlayer.toString(),
      },
    });
  };
  
  if (!turf) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Player Details" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Turf information not available</Text>
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

  return (
    <View style={styles.container}>
      <ScreenHeader title="Player Details" showBackButton />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.bookingDetails}>
          <Text style={styles.bookingTitle}>Booking Summary</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Turf:</Text>
            <Text style={styles.detailValue}>{turf.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{date as string}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{time as string}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Sport:</Text>
            <Text style={styles.detailValue}>{sport as string}</Text>
          </View>
        </View>
        
        <View style={styles.playerSection}>
          <Text style={styles.sectionTitle}>How many players are joining?</Text>
          
          <View style={styles.playerCounter}>
            <TouchableOpacity 
              style={[
                styles.counterButton,
                playerCount <= turf.minPlayers && styles.counterButtonDisabled,
              ]} 
              onPress={decreasePlayerCount}
              disabled={playerCount <= turf.minPlayers}
            >
              <MinusCircle size={24} color={playerCount <= turf.minPlayers ? Colors.neutral[300] : Colors.primary[500]} />
            </TouchableOpacity>
            
            <View style={styles.counterValueContainer}>
              <Text style={styles.counterValue}>{playerCount}</Text>
              <Text style={styles.counterCaption}>players</Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.counterButton,
                playerCount >= turf.maxPlayers && styles.counterButtonDisabled,
              ]} 
              onPress={increasePlayerCount}
              disabled={playerCount >= turf.maxPlayers}
            >
              <PlusCircle size={24} color={playerCount >= turf.maxPlayers ? Colors.neutral[300] : Colors.primary[500]} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.playerLimits}>
            <Text style={styles.limitText}>
              Min: {turf.minPlayers} players | Max: {turf.maxPlayers} players
            </Text>
          </View>
          
          <View style={styles.pricePerPlayerContainer}>
            <Text style={styles.pricePerPlayerLabel}>Price per player:</Text>
            <Text style={styles.pricePerPlayerValue}>₹{pricePerPlayer}</Text>
          </View>
          
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPriceLabel}>Total booking amount:</Text>
            <Text style={styles.totalPriceValue}>₹{pricePerPlayer * playerCount}</Text>
          </View>
        </View>
        
        <View style={styles.needPlayersSection}>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Need more players?</Text>
            <Switch
              trackColor={{ false: Colors.neutral[300], true: Colors.primary[200] }}
              thumbColor={needMorePlayers ? Colors.primary[500] : Colors.neutral[100]}
              onValueChange={setNeedMorePlayers}
              value={needMorePlayers}
            />
          </View>
          
          {needMorePlayers && (
            <View style={styles.playersNeededContainer}>
              <Text style={styles.playersNeededLabel}>How many players do you need?</Text>
              
              <View style={styles.playersNeededControls}>
                <TouchableOpacity 
                  style={styles.playersNeededButton}
                  onPress={() => setPlayersNeeded(Math.max(0, playersNeeded - 1))}
                  disabled={playersNeeded <= 0}
                >
                  <MinusCircle size={20} color={playersNeeded <= 0 ? Colors.neutral[300] : Colors.primary[500]} />
                </TouchableOpacity>
                
                <TextInput
                  style={styles.playersNeededInput}
                  value={playersNeeded.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text);
                    if (!isNaN(value) && value >= 0 && value <= turf.maxPlayers - playerCount) {
                      setPlayersNeeded(value);
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                
                <TouchableOpacity 
                  style={styles.playersNeededButton}
                  onPress={() => setPlayersNeeded(Math.min(turf.maxPlayers - playerCount, playersNeeded + 1))}
                  disabled={playersNeeded >= turf.maxPlayers - playerCount}
                >
                  <PlusCircle size={20} color={playersNeeded >= turf.maxPlayers - playerCount ? Colors.neutral[300] : Colors.primary[500]} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.findPlayersNote}>
                <Users size={16} color={Colors.primary[500]} />
                <Text style={styles.findPlayersNoteText}>
                  Other players will be able to join your match and pay their share directly.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  bookingDetails: {
    backgroundColor: Colors.background.alt,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  bookingTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  detailValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
    textTransform: 'capitalize',
  },
  playerSection: {
    backgroundColor: Colors.background.default,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  playerCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  counterButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.alt,
    borderRadius: 25,
  },
  counterButtonDisabled: {
    opacity: 0.5,
  },
  counterValueContainer: {
    alignItems: 'center',
  },
  counterValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: Colors.text.primary,
  },
  counterCaption: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  playerLimits: {
    alignItems: 'center',
    marginBottom: 16,
  },
  limitText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  pricePerPlayerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  pricePerPlayerLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  pricePerPlayerValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.primary[500],
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalPriceLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  totalPriceValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.primary[500],
  },
  needPlayersSection: {
    backgroundColor: Colors.background.default,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
  playersNeededContainer: {
    marginTop: 16,
  },
  playersNeededLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  playersNeededControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  playersNeededButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.alt,
    borderRadius: 20,
  },
  playersNeededInput: {
    width: 60,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius:
    8,
    marginHorizontal: 12,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
  },
  findPlayersNote: {
    flexDirection: 'row',
    backgroundColor: Colors.primary[50],
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  findPlayersNoteText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.default,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    padding: 16,
  },
  continueButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.inverse,
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
  backButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.inverse,
  },
});