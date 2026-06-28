import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from '../screens/login';
import RoomScreen from '../screens/room';
import CanvasScreen from '../screens/canvas';

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentRoomId(null);
  };

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
      ) : !currentRoomId ? (
        <RoomScreen 
          onJoinRoom={(roomId) => setCurrentRoomId(roomId)} 
          onLogout={handleLogout} 
        />
      ) : (
        <CanvasScreen 
          roomId={currentRoomId} 
          onLogout={() => setCurrentRoomId(null)} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});