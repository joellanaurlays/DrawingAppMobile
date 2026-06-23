// src/screens/canvas/index.tsx
import React from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { styles } from './styles';

interface CanvasScreenProps {
  onLogout: () => void;
}

export default function CanvasScreen({ onLogout }: CanvasScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Barre supérieure d'actions */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerButton} onPress={onLogout}>
          <Ionicons name="exit-outline" size={20} color={COLORS.white} />
          <Text style={styles.headerButtonText}>Quitter</Text>
        </TouchableOpacity>
        
        <Text style={styles.roomTitle}>Salon #001</Text>
        
        <TouchableOpacity style={styles.headerButton} onPress={() => Alert.alert('Succès', 'Dessin sauvegardé')}>
          <Ionicons name="save-outline" size={20} color={COLORS.white} />
          <Text style={styles.headerButtonText}>Sauver</Text>
        </TouchableOpacity>
      </View>

      {/* Zone centrale du Canvas */}
      <View style={styles.canvasContainer}>
        <View style={styles.canvas}>
          <Text style={styles.canvasPlaceholderText}>Espace de Dessin Collaboratif</Text>
          <Text style={styles.canvasSubPlaceholderText}>(Prêt pour l'étape 2 : Moteur de dessin local)</Text>
        </View>
      </View>

      {/* Barre d'outils inférieure */}
      <View style={styles.toolbar}>
        <View style={styles.toolGroup}>
          <TouchableOpacity style={[styles.toolCircle, { backgroundColor: COLORS.mulberryNight }]} />
          <TouchableOpacity style={[styles.toolCircle, { backgroundColor: COLORS.indigoTart }]} />
          <TouchableOpacity style={[styles.toolCircle, { backgroundColor: COLORS.glaceApricot }]} />
        </View>
        
        <View style={styles.toolActionGroup}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="pencil" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="trash-bin" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}