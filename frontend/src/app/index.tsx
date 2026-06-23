import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from '../screens/login';
import CanvasScreen from '../screens/canvas';

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <CanvasScreen onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});