import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  Platform 
} from 'react-native';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

interface RoomScreenProps {
  onJoinRoom: (roomId: string) => void;
  onLogout: () => void;
}

interface RoomItem {
  id: string;
  name: string;
}

export default function RoomScreen({ onJoinRoom, onLogout }: RoomScreenProps) {
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Charger la liste des salons depuis Firestore
  const fetchRooms = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rooms'));
      const roomsList: RoomItem[] = [];
      querySnapshot.forEach((doc) => {
        roomsList.push({ id: doc.id, name: doc.data().name });
      });
      setRooms(roomsList);
    } catch (error) {
      console.error("Erreur lors de la récupération des salons :", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Créer un nouveau salon dans Firestore
  const handleCreateRoom = async () => {
    const cleanName = newRoomName.trim();
    if (!cleanName) {
      const msg = 'Veuillez donner un nom au salon.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Champ vide', msg);
      return;
    }

    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'rooms'), {
        name: cleanName,
        createdBy: auth.currentUser?.uid || 'Anonyme',
        createdAt: serverTimestamp(),
      });
      
      setNewRoomName('');
      fetchRooms(); // Rafraîchir la liste
      onJoinRoom(docRef.id); // Rejoindre instantanément le salon créé
    } catch (error) {
      const msg = 'Impossible de créer le salon.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Erreur', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Barre supérieure */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Salons disponibles</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Formulaire de création de salon */}
      <View style={styles.createBlock}>
        <TextInput
          style={styles.inputField}
          placeholder="Nom du nouveau salon..."
          placeholderTextColor="#FFFFFF"
          value={newRoomName}
          onChangeText={setNewRoomName}
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={handleCreateRoom}
          disabled={isLoading}
        >
          <Ionicons name="add-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Liste des salons existants */}
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.roomCard} 
            onPress={() => onJoinRoom(item.id)}
          >
            <View style={styles.roomInfo}>
              <Ionicons name="cube-outline" size={22} color="#CEB3AB" />
              <Text style={styles.roomName}>{item.name}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#CEB3AB" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun salon disponible. Créez-en un !</Text>
        }
      />
    </View>
  );
}