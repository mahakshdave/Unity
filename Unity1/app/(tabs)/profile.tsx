import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import ScreenHeader from '@/components/common/ScreenHeader';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { User, Settings, CreditCard, Bell, CircleHelp as HelpCircle, LogOut, ChevronRight, Heart } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };
  
  if (!user) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Profile" />
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Profile" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user.avatar || 'https://i.pravatar.cc/150?u=default' }}
            style={styles.profileImage}
          />
          
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
        </View>
        
        <View style={styles.menuSection}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Account Settings</Text>
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <User size={20} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuItemText}>Personal Information</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <CreditCard size={20} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <Heart size={20} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuItemText}>Favorite Turfs</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuSection}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Preferences</Text>
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <Bell size={20} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <Settings size={20} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuItemText}>App Settings</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuSection}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Support</Text>
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <HelpCircle size={20} color={Colors.primary[500]} />
              </View>
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleSignOut}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: Colors.error[50] }]}>
                <LogOut size={20} color={Colors.error[500]} />
              </View>
              <Text style={[styles.menuItemText, { color: Colors.error[500] }]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>TurfBuddy v1.0.0</Text>
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
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  editProfileButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[500],
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.alt,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.neutral[300],
  },
  menuSection: {
    marginBottom: 24,
  },
  menuHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  menuTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  appVersion: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});