import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { Lock, Mail } from 'lucide-react-native';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signIn, isLoading } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError(null);
    
    try {
      await signIn(email, password);
    } catch (e) {
      setError('Invalid email or password');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg' }} 
            style={styles.headerImage}
          />
          <View style={styles.overlay}>
            <Text style={styles.title}>TurfBuddy</Text>
            <Text style={styles.subtitle}>Book turf, find players, play together</Text>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Sign In</Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Mail size={20} color={Colors.neutral[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={Colors.neutral[400]}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={Colors.neutral[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={Colors.neutral[400]}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View style={styles.demoAccountsContainer}>
            <Text style={styles.demoTitle}>Demo Accounts</Text>
            <View style={styles.demoAccount}>
              <Text style={styles.demoLabel}>Player: </Text>
              <Text style={styles.demoText}>player@example.com / password</Text>
            </View>
            <View style={styles.demoAccount}>
              <Text style={styles.demoLabel}>Admin: </Text>
              <Text style={styles.demoText}>admin@example.com / password</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background.default,
  },
  headerContainer: {
    height: 240,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  formContainer: {
    padding: 24,
  },
  formTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Poppins-Medium',
    color: '#B91C1C',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  button: {
    backgroundColor: Colors.primary[500],
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  footerLink: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary[500],
  },
  demoAccountsContainer: {
    marginTop: 40,
    padding: 16,
    backgroundColor: Colors.background.alt,
    borderRadius: 8,
  },
  demoTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  demoAccount: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  demoLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  demoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
});