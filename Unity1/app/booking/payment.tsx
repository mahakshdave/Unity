import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenHeader from '@/components/common/ScreenHeader';
import Colors from '@/constants/Colors';
import { mockTurfs } from '@/data/mockTurfs';
import { Turf } from '@/types/turf';
import { CreditCard, Wallet, Ban as Bank, CircleCheck as CheckCircle2, ArrowRight, Shield, BadgeCheck, Check } from 'lucide-react-native';

type PaymentMethod = 'card' | 'wallet' | 'bank';

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { 
    turfId, 
    date, 
    time, 
    sport, 
    players, 
    needPlayers,
    playersNeeded,
    pricePerPlayer,
  } = params;
  
  const [turf, setTurf] = useState<Turf | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const totalPlayers = parseInt(players as string) || 0;
  const totalPrice = (parseInt(pricePerPlayer as string) || 0) * totalPlayers;
  const needMorePlayers = (needPlayers === 'true');
  const additionalPlayersNeeded = parseInt(playersNeeded as string) || 0;
  
  useEffect(() => {
    if (turfId) {
      const turfData = mockTurfs.find(t => t.id === turfId);
      setTurf(turfData || null);
    }
  }, [turfId]);
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Navigate to success screen
      router.replace('/booking/success');
    }, 2000);
  };
  
  if (!turf) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Payment" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Booking information not available</Text>
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
      <ScreenHeader title="Payment" showBackButton />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.orderSummary}>
          <Text style={styles.orderTitle}>Order Summary</Text>
          
          <View style={styles.orderDetails}>
            <View style={styles.orderItem}>
              <Text style={styles.orderItemLabel}>Turf</Text>
              <Text style={styles.orderItemValue}>{turf.name}</Text>
            </View>
            
            <View style={styles.orderItem}>
              <Text style={styles.orderItemLabel}>Date & Time</Text>
              <Text style={styles.orderItemValue}>{date as string}, {time as string}</Text>
            </View>
            
            <View style={styles.orderItem}>
              <Text style={styles.orderItemLabel}>Sport</Text>
              <Text style={styles.orderItemValue}>{sport as string}</Text>
            </View>
            
            <View style={styles.orderItem}>
              <Text style={styles.orderItemLabel}>Players</Text>
              <Text style={styles.orderItemValue}>{players} players</Text>
            </View>
            
            {needMorePlayers && additionalPlayersNeeded > 0 && (
              <View style={styles.orderItem}>
                <Text style={styles.orderItemLabel}>Looking for</Text>
                <Text style={styles.orderItemValue}>{additionalPlayersNeeded} more players</Text>
              </View>
            )}
            
            <View style={styles.divider} />
            
            <View style={styles.orderItem}>
              <Text style={styles.orderItemLabel}>Price per player</Text>
              <Text style={styles.orderItemValue}>₹{pricePerPlayer}</Text>
            </View>
            
            <View style={styles.orderItemTotal}>
              <Text style={styles.orderItemTotalLabel}>Total Amount</Text>
              <Text style={styles.orderItemTotalValue}>₹{totalPrice}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPaymentMethod === 'card' && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPaymentMethod('card')}
          >
            <View style={styles.paymentOptionLeft}>
              <View style={styles.paymentIcon}>
                <CreditCard size={24} color={Colors.primary[500]} />
              </View>
              <View style={styles.paymentOptionInfo}>
                <Text style={styles.paymentOptionTitle}>Credit/Debit Card</Text>
                <Text style={styles.paymentOptionDescription}>Pay using your credit or debit card</Text>
              </View>
            </View>
            
            {selectedPaymentMethod === 'card' && (
              <CheckCircle2 size={24} color={Colors.primary[500]} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPaymentMethod === 'wallet' && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPaymentMethod('wallet')}
          >
            <View style={styles.paymentOptionLeft}>
              <View style={styles.paymentIcon}>
                <Wallet size={24} color={Colors.primary[500]} />
              </View>
              <View style={styles.paymentOptionInfo}>
                <Text style={styles.paymentOptionTitle}>UPI/Wallet</Text>
                <Text style={styles.paymentOptionDescription}>Google Pay, PhonePe, Paytm, etc.</Text>
              </View>
            </View>
            
            {selectedPaymentMethod === 'wallet' && (
              <CheckCircle2 size={24} color={Colors.primary[500]} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPaymentMethod === 'bank' && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPaymentMethod('bank')}
          >
            <View style={styles.paymentOptionLeft}>
              <View style={styles.paymentIcon}>
                <Bank size={24} color={Colors.primary[500]} />
              </View>
              <View style={styles.paymentOptionInfo}>
                <Text style={styles.paymentOptionTitle}>Net Banking</Text>
                <Text style={styles.paymentOptionDescription}>Pay directly from your bank account</Text>
              </View>
            </View>
            
            {selectedPaymentMethod === 'bank' && (
              <CheckCircle2 size={24} color={Colors.primary[500]} />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.securityNotice}>
          <Shield size={16} color={Colors.primary[500]} />
          <Text style={styles.securityText}>
            Your payment information is secure. We use encryption to protect your data.
          </Text>
        </View>
        
        <View style={styles.policiesContainer}>
          <View style={styles.policyItem}>
            <BadgeCheck size={16} color={Colors.success[500]} />
            <Text style={styles.policyText}>Free cancellation up to 24 hours before the booking</Text>
          </View>
          <View style={styles.policyItem}>
            <BadgeCheck size={16} color={Colors.success[500]} />
            <Text style={styles.policyText}>Secure payment processing</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{totalPrice}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.payButton}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.payButtonText}>Pay Now</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </>
          )}
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
  orderSummary: {
    backgroundColor: Colors.background.default,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    overflow: 'hidden',
  },
  orderTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  orderDetails: {
    padding: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderItemLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  orderItemValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[200],
    marginVertical: 12,
  },
  orderItemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  orderItemTotalLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  orderItemTotalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.primary[500],
  },
  paymentMethods: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.background.default,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentOptionSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentOptionInfo: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  paymentOptionDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  securityNotice: {
    flexDirection: 'row',
    backgroundColor: Colors.background.alt,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  securityText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 8,
    flex: 1,
  },
  policiesContainer: {
    marginBottom: 24,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  policyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  totalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  payButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  payButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.inverse,
    marginRight: 8,
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