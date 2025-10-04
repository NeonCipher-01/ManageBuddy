import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  User,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import createContextHook from '@nkzw/create-context-hook';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.uid);
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', result.user.uid);
      return result.user;
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Sign up successful:', result.user.uid);
      return result.user;
    } catch (error: any) {
      console.error('Sign up error:', error.message);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      console.log('Sign out successful');
    } catch (error: any) {
      console.error('Sign out error:', error.message);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    user,
    loading,
    signIn,
    signUp,
    signOut
  }), [user, loading, signIn, signUp, signOut]);
});
