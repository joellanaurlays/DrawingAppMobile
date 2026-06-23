import React, { useState, useRef } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  PanResponder, 
  GestureResponderEvent 
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { COLORS } from '../../constants/theme';

interface CanvasScreenProps {
  onLogout: () => void;
}

interface Line {
  path: string;
  color: string;
  strokeWidth: number;
}

export default function CanvasScreen({ onLogout }: CanvasScreenProps) {
  const [currentLines, setCurrentLines] = useState<Line[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(COLORS.indigoTart);
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [isEraser, setIsEraser] = useState<boolean>(false);

  const currentPath = useRef<string>('');
  const activeColor = isEraser ? COLORS.white : selectedColor;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current = `M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
        setCurrentLines((prev) => [
          ...prev, 
          { path: currentPath.current, color: activeColor, strokeWidth: strokeWidth }
        ]);
      },
      
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        if (currentPath.current) {
          currentPath.current += ` L ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
          
          setCurrentLines((prev) => {
            const next = [...prev];
            if (next.length > 0) {
              next[next.length - 1] = { 
                path: currentPath.current, 
                color: activeColor, 
                strokeWidth: strokeWidth 
              };
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

  const clearCanvas = () => {
    setCurrentLines([]);
    currentPath.current = '';
  };

  const undoLastAction = () => {
    setCurrentLines((prev) => prev.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      
      {/* 1. Header */}
      <View style={styles.headerBar}>
        <Text style={styles.roomTitle}>Studio de Dessin Local</Text>
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
                strokeWidth={line.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </Svg>
          {currentLines.length === 0 && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>À vos pinceaux !</Text>
            </View>
          )}
        </View>
      </View>

      {/* 3. Panneau de configuration & Outils */}
      <View style={styles.controlPanel}>
        
        {/* Sélecteur d'épaisseur */}
        <View style={styles.sizeSelectorRow}>
          <Text style={styles.label}>Épaisseur :</Text>
          <View style={styles.sizeButtonsGroup}>
            {[2, 4, 8, 16].map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeButton, strokeWidth === size && styles.sizeButtonActive]}
                onPress={() => setStrokeWidth(size)}
              >
                <View style={[styles.sizeDot, { width: size, height: size, borderRadius: size / 2 }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Barre d'outils */}
        <View style={styles.toolbar}>
          
          {/* Palette de couleurs */}
          <View style={styles.toolGroup}>
            {[COLORS.indigoTart, COLORS.mulberryNight, COLORS.glaceApricot, COLORS.crushedCacao].map((color) => (
              <TouchableOpacity
                key={color}
                disabled={isEraser}
                style={[
                  styles.toolCircle,
                  { backgroundColor: color, opacity: isEraser ? 0.3 : 1 },
                  selectedColor === color && !isEraser && styles.toolCircleSelected
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          {/* Outils & Actions avec icônes vectorielles */}
          <View style={styles.toolActionGroup}>
            
            {/* Action Mode : Gomme / Pinceau */}
            <TouchableOpacity 
              style={[styles.actionButton, isEraser && styles.eraserButtonActive]} 
              onPress={() => setIsEraser(!isEraser)}
            >
              <Ionicons 
                name={isEraser ? "brush-outline" : "trash-bin-outline"} 
                size={20} 
                color={COLORS.white} 
              />
            </TouchableOpacity>

            {/* Action : Annuler (Undo) */}
            <TouchableOpacity style={styles.actionButton} onPress={undoLastAction}>
              <Ionicons name="arrow-undo-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>

            {/* Action : Effacer tout (Clear) */}
            <TouchableOpacity style={styles.actionButton} onPress={clearCanvas}>
              <Ionicons name="refresh-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>

        </View>
      </View>

    </View>
  );
}

const StyleSheet = { absoluteFill: { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 } };