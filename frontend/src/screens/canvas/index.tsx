import React, { useState, useRef, useEffect } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  PanResponder, 
  GestureResponderEvent,
  Platform
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { io, Socket } from 'socket.io-client';
import { styles } from './styles';
import { COLORS } from '../../constants/theme';

interface CanvasScreenProps {
  roomId: string;
  onLogout: () => void;
}

interface Line {
  path: string;
  color: string;
  strokeWidth: number;
}

// Configuration de l'URL du serveur en fonction de la plateforme
const SERVER_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.0.198:3000';

export default function CanvasScreen({ roomId, onLogout }: CanvasScreenProps) {
  const [currentLines, setCurrentLines] = useState<Line[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(COLORS.indigoTart);
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [isEraser, setIsEraser] = useState<boolean>(false);

  const currentPath = useRef<string>('');
  const socketRef = useRef<Socket | null>(null);
  
  // Utilisation de la couleur active (Blanc si la gomme est activée, sinon la couleur choisie)
  const activeColor = isEraser ? COLORS.white : selectedColor;

  // Initialisation et écouteurs WebSockets
  useEffect(() => {
      socketRef.current = io(SERVER_URL);

      // Rejoindre la salle dynamique transmise par Firestore
      socketRef.current.emit('join-room', roomId);

      socketRef.current.on('init-canvas', (existingLines: Line[]) => {
        setCurrentLines(existingLines);
      });

      socketRef.current.on('receive-line', (newLine: Line) => {
        setCurrentLines((prev) => [...prev, newLine]);
      });

      socketRef.current.on('canvas-cleared', () => {
        setCurrentLines([]);
      });

      // Écouter un tracé qui commence chez un autre utilisateur
      socketRef.current.on('receive-cursor-start', (newLine: Line) => {
        setCurrentLines((prev) => [...prev, newLine]);
      });

      // Écouter la mise à jour continue du tracé de l'autre utilisateur
      socketRef.current.on('receive-cursor-move', (updatedPath: string) => {
        setCurrentLines((prev) => {
          const next = [...prev];
          if (next.length > 0) {
            next[next.length - 1].path = updatedPath;
          }
          return next;
        });
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
  }, [roomId]);

  // Gestionnaire des mouvements (PanResponder) mis à jour pour le vrai temps réel
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      // 1. Début du tracé
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current = `M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
        
        const newLine: Line = { path: currentPath.current, color: activeColor, strokeWidth: strokeWidth };
        
        setCurrentLines((prev) => [...prev, newLine]);

        //signale immédiatement au serveur qu'on commence une ligne
        socketRef.current?.emit('draw-cursor-start', { room: roomId, line: newLine });
      },
      
      // 2. Pendant le déplacement (Vrai Temps Réel)
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

          // On envoie la mise à jour du tracé en continu pendant le mouvement
          socketRef.current?.emit('draw-cursor-move', { 
            room: roomId, 
            path: currentPath.current 
          });
        }
      },
      
      // 3. Fin du tracé
      onPanResponderRelease: () => {
        if (currentPath.current && socketRef.current) {
          const finishedLine: Line = { 
            path: currentPath.current, 
            color: activeColor, 
            strokeWidth: strokeWidth 
          };
          // On valide la ligne définitive auprès du serveur
          socketRef.current.emit('send-line', { room: roomId, line: finishedLine });
        }
        currentPath.current = '';
      },
    })
  ).current;

  // Effacer localement et notifier le serveur
  const clearCanvas = () => {
    setCurrentLines([]);
    currentPath.current = '';
    if (socketRef.current) {
      // Utilisation du roomId dynamique
      socketRef.current.emit('clear-canvas', roomId);
    }
  };

  // Annuler la dernière action (local uniquement)
  const undoLastAction = () => {
    setCurrentLines((prev) => prev.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      
      {/* header */}
      <View style={styles.headerBar}>
        <Text style={styles.roomTitle}>Salon : {roomId.substring(0, 6)}...</Text>
        
        <TouchableOpacity style={styles.headerButton} onPress={onLogout}>
          <Text style={styles.headerButtonText}>Quitter</Text>
        </TouchableOpacity>
      </View>

      {/* canvas */}
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

      {/*  Réglages et barre d'outils */}
      <View style={styles.controlPanel}>
        
        {/* LIGNE DE SÉLECTION D'ÉPAISSEUR */}
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

        {/* BARRE D'OUTILS */}
        <View style={styles.toolbar}>
          
          {/* Palette de couleurs de mon thème */}
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

          {/* Outil Gomme, Retour arrière et Réinitialisation avec icônes vectorielles */}
          <View style={styles.toolActionGroup}>
            
            {/* Bouton Mode Pinceau / Mode Gomme */}
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

            {/* Bouton Annuler (Undo) */}
            <TouchableOpacity style={styles.actionButton} onPress={undoLastAction}>
              <Ionicons name="arrow-undo-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>

            {/* Bouton Effacer tout (Clear) */}
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