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
  onLogout: () => void;
}

interface Line {
  path: string;
  color: string;
  strokeWidth: number;
}

// Configuration de l'URL du serveur en fonction de la plateforme
const SERVER_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.0.198:3000';
const ROOM_ID = 'salon-dessin-1';

export default function CanvasScreen({ onLogout }: CanvasScreenProps) {
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

    // Rejoindre le salon spécifique
    socketRef.current.emit('join-room', ROOM_ID);

    // Charger l'historique du tableau
    socketRef.current.on('init-canvas', (existingLines: Line[]) => {
      setCurrentLines(existingLines);
    });

    // Recevoir les tracés des autres utilisateurs
    socketRef.current.on('receive-line', (newLine: Line) => {
      setCurrentLines((prev) => [...prev, newLine]);
    });

    // Écouter si le tableau est vidé à distance
    socketRef.current.on('canvas-cleared', () => {
      setCurrentLines([]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Gestionnaire des mouvements tactiles et de souris (PanResponder)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      // Début du tracé au premier contact
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current = `M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
        setCurrentLines((prev) => [
          ...prev, 
          { path: currentPath.current, color: activeColor, strokeWidth: strokeWidth }
        ]);
      },
      
      // Mise à jour du tracé pendant le déplacement
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
      
      // Fin du tracé et envoi de la ligne complète au serveur
      onPanResponderRelease: () => {
        if (currentPath.current && socketRef.current) {
          const finishedLine: Line = { 
            path: currentPath.current, 
            color: activeColor, 
            strokeWidth: strokeWidth 
          };
          socketRef.current.emit('send-line', { room: ROOM_ID, line: finishedLine });
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
      socketRef.current.emit('clear-canvas', ROOM_ID);
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
        <Text style={styles.roomTitle}>Studio de Dessin Partagé</Text>
        
        {/* Bouton pour quitter et revenir à l'écran de connexion */}
        <TouchableOpacity style={styles.headerButton} onPress={onLogout}>
          <Text style={styles.headerButtonText}>Quitter</Text>
        </TouchableOpacity>
      </View>

      {/* canvas */}
      <View style={styles.canvasContainer}>
        {/* Vue réactive qui intercepte les mouvements de l'utilisateur */}
        <View style={styles.canvas} {...panResponder.panHandlers}>
          
          {/* Composant SVG pour le rendu vectoriel des lignes */}
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
          
          {/* Affichage d'un texte indicatif si le tableau est complètement vide */}
          {currentLines.length === 0 && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>À vos pinceaux !</Text>
            </View>
          )}
        </View>
      </View>

      {/* control panel */}
      <View style={styles.controlPanel}>
        
        {/* LIGNE DE SÉLECTION D'ÉPAISSEUR */}
        <View style={styles.sizeSelectorRow}>
          <Text style={styles.label}>Épaisseur :</Text>
          <View style={styles.sizeButtonsGroup}>
            {/* Boucle sur les tailles disponibles (2px, 4px, 8px, 16px) */}
            {[2, 4, 8, 16].map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeButton, strokeWidth === size && styles.sizeButtonActive]}
                onPress={() => setStrokeWidth(size)}
              >
                {/* Pastille visuelle proportionnelle à l'épaisseur */}
                <View style={[styles.sizeDot, { width: size, height: size, borderRadius: size / 2 }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* toolbar */}
        <View style={styles.toolbar}>
          
          {/* Section gauche : Les cercles de couleur de ton thème */}
          <View style={styles.toolGroup}>
            {[COLORS.indigoTart, COLORS.mulberryNight, COLORS.glaceApricot, COLORS.crushedCacao].map((color) => (
              <TouchableOpacity
                key={color}
                disabled={isEraser} // Désactivé si la gomme est active pour éviter les confusions
                style={[
                  styles.toolCircle,
                  { backgroundColor: color, opacity: isEraser ? 0.3 : 1 },
                  selectedColor === color && !isEraser && styles.toolCircleSelected
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          {/* Outil Gomme, Retour arrière et Réinitialisation */}
          <View style={styles.toolActionGroup}>
            
            {/* Bouton de bascule Mode Pinceau / Mode Gomme */}
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

            {/* Bouton pour annuler le dernier tracé (Undo) */}
            <TouchableOpacity style={styles.actionButton} onPress={undoLastAction}>
              <Ionicons name="arrow-undo-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>

            {/* Bouton pour vider l'ensemble de la surface de dessin (Clear) */}
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