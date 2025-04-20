import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';
import { Platform } from 'react-native';

// Web fallback for SecureStore
const secureStoreWeb = {
  getItemAsync: async (key: string): Promise<string | null> => {
    return localStorage.getItem(key);
  },
  // Add getValueWithKeyAsync to support internal implementation
  getValueWithKeyAsync: async (key: string): Promise<string | null> => {
    return localStorage.getItem(key);
  },
  setItemAsync: async (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value);
    return;
  },
  deleteItemAsync: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
    return;
  },
};

// Use secureStoreWeb for web platform, otherwise use SecureStore
const storage = Platform.OS === 'web' ? secureStoreWeb : SecureStore;

type User = {
  id: string;
  name: string;
  email: string;
  role: 'player' | 'admin';
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, role: 'player' | 'admin') => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

// This hook can be used to access the user info.
export function useAuth() {
  return useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const inAdminGroup = segments[0] === '(admin)';
    
    if (user === null && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/(auth)/sign-in');
    } else if (user !== null) {
      // If the user is signed in and trying to go to auth...
      if (inAuthGroup) {
        // Redirect away from the sign-in page.
        router.replace('/(tabs)');
      }
      
      // If the user is not an admin but trying to access admin routes
      if (inAdminGroup && user.role !== 'admin') {
        router.replace('/(tabs)');
      }
      
      // If the user is an admin and on the tabs, redirect to admin
      if (!inAdminGroup && !inAuthGroup && user.role === 'admin') {
        router.replace('/(admin)');
      }
    }
  }, [user, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useProtectedRoute(user);

  useEffect(() => {
    // Load stored user data on app start
    const loadUser = async () => {
      try {
        const userJson = await storage.getItemAsync('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This would be a real API call in production
      // For demo purposes, we're simulating a successful login
      
      // Mock data - in real app, this would come from your API
      let mockUser = null;
      
      if (email === 'player@example.com' && password === 'password') {
        mockUser = {
          id: '1',
          name: 'John Player',
          email: 'player@example.com',
          role: 'player',
          avatar: 'https://i.pravatar.cc/150?u=player',
        };
      } else if (email === 'admin@example.com' && password === 'password') {
        mockUser = {
          id: '2',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          avatar: 'https://i.pravatar.cc/150?u=admin',
        };
      } else {
        throw new Error('Invalid credentials');
      }
      
      // Store user in secure storage
      await storage.setItemAsync('user', JSON.stringify(mockUser));
      setUser(mockUser as User);
    } catch (e) {
      console.error('Failed to sign in', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string, role: 'player' | 'admin') => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to create a user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
      };
      
      // Store user in secure storage
      await storage.setItemAsync('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (e) {
      console.error('Failed to sign up', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Remove user from secure storage
      await storage.deleteItemAsync('user');
      setUser(null);
    } catch (e) {
      console.error('Failed to sign out', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}