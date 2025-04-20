import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenHeader from '@/components/common/ScreenHeader';
import Colors from '@/constants/Colors';
import { mockTurfs, generateAvailabilityForTurf } from '@/data/mockTurfs';
import { TurfAvailability, Turf, TurfSport } from '@/types/turf';
import { Calendar } from 'react-native-calendars';
import { format, addDays } from 'date-fns';

export default function BookingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [turf, setTurf] = useState<Turf | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availability, setAvailability] = useState<TurfAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<TurfSport | null>(null);
  
  // Generate dates for next 30 days
  const generateMarkedDates = () => {
    const today = new Date();
    const markedDates: any = {};
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const dateString = format(date, 'yyyy-MM-dd');
      
      markedDates[dateString] = {
        marked: true,
        dotColor: Colors.primary[300],
      };
    }
    
    // Highlight selected date
    if (selectedDate) {
      markedDates[selectedDate] = {
        ...markedDates[selectedDate],
        selected: true,
        selectedColor: Colors.primary[500],
      };
    }
    
    return markedDates;
  };
  
  useEffect(() => {
    if (id) {
      const turfData = mockTurfs.find(t => t.id === id);
      setTurf(turfData || null);
      
      if (turfData && turfData.sports.length > 0) {
        setSelectedSport(turfData.sports[0]);
      }
      
      setIsLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    if (turf && selectedDate) {
      // Simulate loading availability data
      setIsLoading(true);
      setTimeout(() => {
        const availabilityData = generateAvailabilityForTurf(turf.id, selectedDate);
        setAvailability(availabilityData);
        setIsLoading(false);
      }, 600);
    }
  }, [turf, selectedDate]);
  
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };
  
  const handleTimeSlotSelect = (startTime: string) => {
    setSelectedTimeSlot(startTime);
  };
  
  const handleContinue = () => {
    if (!selectedTimeSlot) return;
    
    // Navigate to the player selection screen
    router.push({
      pathname: '/booking/players',
      params: {
        turfId: turf?.id,
        date: selectedDate,
        time: selectedTimeSlot,
        sport: selectedSport,
      },
    });
  };
  
  if (isLoading && !turf) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Book Turf" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Loading turf details...</Text>
        </View>
      </View>
    );
  }
  
  if (!turf) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Book Turf" showBackButton />
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

  return (
    <View style={styles.container}>
      <ScreenHeader title="Book Turf" showBackButton />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.turfInfoContainer}>
          <Text style={styles.turfName}>{turf.name}</Text>
          <Text style={styles.turfLocation}>{turf.location.city}, {turf.location.state}</Text>
        </View>
        
        {turf.sports.length > 1 && (
          <View style={styles.sportsSection}>
            <Text style={styles.sectionTitle}>Select Sport</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sportsScrollContent}
            >
              {turf.sports.map((sport) => (
                <TouchableOpacity
                  key={sport}
                  style={[
                    styles.sportItem,
                    selectedSport === sport && styles.sportItemActive,
                  ]}
                  onPress={() => setSelectedSport(sport)}
                >
                  <Text 
                    style={[
                      styles.sportText,
                      selectedSport === sport && styles.sportTextActive,
                    ]}
                  >
                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Calendar
            markingType={'custom'}
            markedDates={generateMarkedDates()}
            minDate={format(new Date(), 'yyyy-MM-dd')}
            maxDate={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
            onDayPress={(day) => handleDateSelect(day.dateString)}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: Colors.text.primary,
              selectedDayBackgroundColor: Colors.primary[500],
              selectedDayTextColor: '#ffffff',
              todayTextColor: Colors.primary[500],
              dayTextColor: Colors.text.primary,
              textDisabledColor: Colors.neutral[300],
              dotColor: Colors.primary[500],
              selectedDotColor: '#ffffff',
              arrowColor: Colors.primary[500],
              monthTextColor: Colors.text.primary,
              indicatorColor: Colors.primary[500],
              textDayFontFamily: 'Poppins-Regular',
              textMonthFontFamily: 'Poppins-Medium',
              textDayHeaderFontFamily: 'Poppins-Medium',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
            style={styles.calendar}
          />
        </View>
        
        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>Select Time Slot</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary[500]} />
              <Text style={styles.loadingText}>Loading available slots...</Text>
            </View>
          ) : availability && availability.slots.length > 0 ? (
            <View style={styles.timeSlotsContainer}>
              {availability.slots.map((slot) => (
                <TouchableOpacity
                  key={slot.startTime}
                  style={[
                    styles.timeSlot,
                    !slot.available && styles.timeSlotUnavailable,
                    selectedTimeSlot === slot.startTime && styles.timeSlotSelected,
                  ]}
                  onPress={() => slot.available && handleTimeSlotSelect(slot.startTime)}
                  disabled={!slot.available}
                >
                  <Text 
                    style={[
                      styles.timeSlotText,
                      !slot.available && styles.timeSlotTextUnavailable,
                      selectedTimeSlot === slot.startTime && styles.timeSlotTextSelected,
                    ]}
                  >
                    {slot.startTime} - {slot.endTime}
                  </Text>
                  {slot.available && (
                    <Text 
                      style={[
                        styles.timeSlotPrice,
                        selectedTimeSlot === slot.startTime && styles.timeSlotTextSelected,
                      ]}
                    >
                      ₹{slot.price}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noSlotsContainer}>
              <Text style={styles.noSlotsText}>No time slots available for this date</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            (!selectedTimeSlot) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedTimeSlot}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  scrollContent: {
    paddingBottom: 100,
  },
  turfInfoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  turfName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  turfLocation: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  sportsSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  sportsScrollContent: {
    paddingBottom: 8,
  },
  sportItem: {
    backgroundColor: Colors.background.alt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  sportItemActive: {
    backgroundColor: Colors.primary[500],
  },
  sportText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.primary,
  },
  sportTextActive: {
    color: Colors.text.inverse,
  },
  dateSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  calendar: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  timeSection: {
    padding: 16,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    backgroundColor: Colors.background.alt,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    width: '31%',
    alignItems: 'center',
  },
  timeSlotUnavailable: {
    backgroundColor: Colors.neutral[100],
    opacity: 0.6,
  },
  timeSlotSelected: {
    backgroundColor: Colors.primary[500],
  },
  timeSlotText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  timeSlotTextUnavailable: {
    color: Colors.text.disabled,
  },
  timeSlotTextSelected: {
    color: Colors.text.inverse,
  },
  timeSlotPrice: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.primary[500],
    marginTop: 4,
  },
  noSlotsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noSlotsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
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
  continueButtonDisabled: {
    backgroundColor: Colors.neutral[300],
  },
  continueButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.inverse,
  },
});