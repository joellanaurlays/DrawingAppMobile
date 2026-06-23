// src/screens/canvas/index.tsx
import React, { useState, useRef } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  PanResponder, 
  GestureResponderEvent 
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from './styles';
import { COLORS } from '../../constants/theme';

interface CanvasScreenProps {
  onLogout: () => void;
}

interface Line {
  path: string;
  color: string;
}

export default function CanvasScreen({ onLogout }: CanvasScreenProps) {
  const [currentLines, setCurrentLines] = useState<Line[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(COLORS.indigoTart);
  const currentPath = useRef<string>('');

  // Gestion du dessin au toucher
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      // Début du tracé
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current = `M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
        setCurrentLines((prev) => [...prev, { path: currentPath.current, color: selectedColor }]);
      },
      
      // Pendant le déplacement du doigt
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        if (currentPath.current) {
          currentPath.current += ` L ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
          
          // Mettre à jour la dernière ligne en cours de tracé
          setCurrentLines((prev) => {
            const next = [...prev];
            if (next.length > 0) {
              next[next.length - 1] = { path: currentPath.current, color: selectedColor };
            }
            return next;
          });
        }
      },
      
      onPanResponderRelease: () => {
        currentPath.current = '';
      },
    })
  ).current;

  // Action : Effacer tout le tableau
  const clearCanvas = () => {
    setCurrentLines([]);
    currentPath.current = '';
  };

  // Action : Annuler le dernier trait (Undo)
  const undoLastAction = () => {
    setCurrentLines((prev) => prev.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      
      {/* 1. Barre supérieure (Header) */}
      <View style={styles.headerBar}>
        <Text style={styles.roomTitle}>Salle de Dessin #1</Text>
        <TouchableOpacity style={styles.headerButton} onPress={onLogout}>
          <Text style={styles.headerButtonText}>Quitter</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Zone de dessin (Canvas) */}
      <View style={styles.canvasContainer}>
        <View style={styles.canvas} {...panResponder.panHandlers}>
          <Svg style={StyleSheet.absoluteFill}>
            {currentLines.map((line, index) => (
              <Path
                key={index}
                d={line.path}
                fill="none"
                stroke={line.color}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </Svg>
          {currentLines.length === 0 && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Touchez l'écran pour dessiner</Text>
            </View>
          )}
        </View>
      </View>

      {/* 3. Barre d'outils inférieure (Toolbar) */}
      <View style={styles.toolbar}>
        
        {/* Sélection des couleurs de ton thème */}
        <View style={styles.toolGroup}>
          {[COLORS.indigoTart, COLORS.mulberryNight, COLORS.glaceApricot, COLORS.crushedCacao].map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.toolCircle,
                { backgroundColor: color },
                selectedColor === color && styles.toolCircleSelected
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        {/* Boutons d'actions */}
        <View style={styles.toolActionGroup}>
          <TouchableOpacity style={styles.actionButton} onPress={undoLastAction}>
            <Text style={styles.actionButtonText}>↩</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={clearCanvas}>
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

// Petit hack propre pour éviter l'import inutile de StyleSheet dans le corps
const StyleSheet = { absoluteFill: { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 } };