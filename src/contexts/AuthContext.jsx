import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isDummyLogin, setIsDummyLogin] = useState(false);

  async function login(email, password) {
    if (email === "admin@gnit.edu" && password === "password") {
      // Mock login to bypass Firebase Auth configuration issues for now
      const dummyUser = { email: "admin@gnit.edu", uid: "mock-admin-123" };
      setCurrentUser(dummyUser);
      setIsDummyLogin(true);
      return Promise.resolve(dummyUser);
    }
    
    // Fallback if someone tries other credentials (won't happen with our PIN setup)
    return Promise.reject(new Error("Invalid credentials"));
  }

  function logout() {
    if (isDummyLogin) {
      setCurrentUser(null);
      setIsDummyLogin(false);
      return Promise.resolve();
    }
    return signOut(auth);
  }

  useEffect(() => {
    if (auth.app.options.apiKey === "YOUR_API_KEY") {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
