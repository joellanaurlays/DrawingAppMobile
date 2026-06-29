// src/screens/canvas/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  PanResponder, 
  GestureResponderEvent,
  Platform,
  Share
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { io, Socket } from 'socket.io-client';
import { styles } from './styles';
import { COLORS } from '../../constants/theme';

// Interface définissant les propriétés reçues par l'écran du Canvas
interface CanvasScreenProps {
  roomId: string;     
  onLogout: () => void; 
}

// Structure d'une ligne de dessin vectoriel
interface Line {
  path: string;
  color: string;
  strokeWidth: number;
}

// Configuration de l'URL du serveur de dessin en fonction de l'environnement
const SERVER_URL = 'https://drawingappmobile.onrender.com:3000';

export default function CanvasScreen({ roomId, onLogout }: CanvasScreenProps) {
  // États locaux de l'application
  const [currentLines, setCurrentLines] = useState<Line[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>(COLORS.indigoTart);
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [isEraser, setIsEraser] = useState<boolean>(false);

  // Références persistantes pour éviter les re-rendus inutiles
  const currentPath = useRef<string>('');
  const socketRef = useRef<Socket | null>(null);
  
  // Détermination de la couleur active 
  const activeColor = isEraser ? COLORS.white : selectedColor;

  // Cycle de vie : Initialisation de la connexion WebSocket et écouteurs de salon 
  useEffect(() => {
      // Connexion au serveur de synchronisation instantanée
      socketRef.current = io(SERVER_URL);

      // Signalement au serveur de l'entrée dans la salle spécifique 
      socketRef.current.emit('join-room', roomId);

      // Événement : Réception du tableau initial sauvegardé
      socketRef.current.on('init-canvas', (existingLines: Line[]) => {
        setCurrentLines(existingLines);
      });

      // Événement : Réception en temps réel d'un tracé d'un autre utilisateur 
      socketRef.current.on('receive-line', (newLine: Line) => {
        setCurrentLines((prev) => [...prev, newLine]);
      });

      // Événement : Réception de l'ordre de réinitialisation du tableau 
      socketRef.current.on('canvas-cleared', () => {
        setCurrentLines([]);
      });

      // Nettoyage de la connexion lors de la fermeture de l'écran
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
  }, [roomId]);

  // Gestionnaire d'événements tactiles / souris 
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      // Début du tracé au premier contact de l'utilisateur sur l'écran
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        // Initialisation de la commande SVG "Move To" (M)
        currentPath.current = `M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
        setCurrentLines((prev) => [
          ...prev, 
          { path: currentPath.current, color: activeColor, strokeWidth: strokeWidth }
        ]);
      },
      
      // Mise à jour continue du tracé pendant que le doigt glisse sur l'écran 
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        if (currentPath.current) {
          // Ajout de coordonnées avec la commande SVG "Line To" (L)
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
      
      // Fin du tracé 
      onPanResponderRelease: () => {
        if (currentPath.current && socketRef.current) {
          const finishedLine: Line = { 
            path: currentPath.current, 
            color: activeColor, 
            strokeWidth: strokeWidth 
          };
          // Envoi de la ligne définitive étiquetée avec l'ID du salon actuel
          socketRef.current.emit('send-line', { room: roomId, line: finishedLine });
        }
        currentPath.current = ''; // Réinitialisation de la mémoire du tracé en cours
      },
    })
  ).current;

  // Fonctionnalité d'invitation 
  const handleInviteFriend = async () => {
    try {
      const message = `Rejoins-moi sur DrawingApp pour dessiner ensemble ! ID du salon : ${roomId}`;
      // Déclenche la feuille de partage OS d'Android ou iOS
      await Share.share({
        message: message,
        title: 'Invitation DrawingApp',
      });
    } catch (error) {
      console.error("Erreur lors du partage de l'invitation :", error);
    }
  };

  // Vider localement l'écran et notifier l'ensemble du salon via le serveur 
  const clearCanvas = () => {
    setCurrentLines([]);
    currentPath.current = '';
    if (socketRef.current) {
      socketRef.current.emit('clear-canvas', roomId);
    }
  };

  // Annuler la dernière action de dessin 
  const undoLastAction = () => {
    setCurrentLines((prev) => prev.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      
      {/* header */}
      <View style={styles.headerBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {/* Icône symbolisant la clé ou la copie */}
          <Ionicons name="copy-outline" size={16} color={COLORS.champagneSilk} style={{ marginRight: 6 }} />
          {/* Affichage tronqué de l'ID unique de la salle */}
          <Text style={styles.roomTitle} numberOfLines={1}>
            Salon : {roomId.substring(0, 8)}...
          </Text>
          
          {/* Bouton Inviter un ami */}
          <TouchableOpacity 
            style={{ marginLeft: 12, padding: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 6 }} 
            onPress={handleInviteFriend}
          >
            <Ionicons name="person-add-outline" size={16} color={COLORS.champagneSilk} />
          </TouchableOpacity>
        </View>
        
        {/* Bouton pour se déconnecter et quitter l'espace de travail collaboratif*/}
        <TouchableOpacity style={styles.headerButton} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.white} />
          <Text style={styles.headerButtonText}>Quitter</Text>
        </TouchableOpacity>
      </View>

      {/* canvas */}
      <View style={styles.canvasContainer}>
        {/* La View intercepte tous les gestes de l'utilisateur grâce au panResponder */}
        <View style={styles.canvas} {...panResponder.panHandlers}>
          
          {/* Composant SVG assurant l'affichage fluide et net des tracés géométriques */}
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
          
          {/* Écran d'accueil indicatif si aucun utilisateur n'a encore dessiné */}
          {currentLines.length === 0 && (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>À vos pinceaux !</Text>
            </View>
          )}
        </View>
      </View>

      {/* Réglages et barre d'outils */}
      <View style={styles.controlPanel}>
        
        {/* Section de sélection du diamètre du pinceau */}
        <View style={styles.sizeSelectorRow}>
          <Text style={styles.label}>Épaisseur :</Text>
          <View style={styles.sizeButtonsGroup}>
            {[2, 4, 8, 16].map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeButton, strokeWidth === size && styles.sizeButtonActive]}
                onPress={() => setStrokeWidth(size)}
              >
                {/* Pastille visuelle proportionnelle à l'épaisseur sélectionnée */}
                <View style={[styles.sizeDot, { width: size, height: size, borderRadius: size / 2 }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section palette chromatique et outils utilitaires */}
        <View style={styles.toolbar}>
          
          {/* Palette de couleurs basée sur la charte graphique de mon application */}
          <View style={styles.toolGroup}>
            {[COLORS.indigoTart, COLORS.mulberryNight, COLORS.glaceApricot, COLORS.crushedCacao].map((color) => (
              <TouchableOpacity
                key={color}
                disabled={isEraser} // Bloqué si la gomme est active pour éviter les confusions d'outils
                style={[
                  styles.toolCircle,
                  { backgroundColor: color, opacity: isEraser ? 0.3 : 1 },
                  selectedColor === color && !isEraser && styles.toolCircleSelected
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          {/* Outil Gomme, Retour arrière (Undo) et Réinitialisation globale (Clear) */}
          <View style={styles.toolActionGroup}>
            {/* Actionneur de mode : Gomme / Pinceau */}
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

            {/* Actionneur d'annulation (Undo arrière d'un pas) */}
            <TouchableOpacity style={styles.actionButton} onPress={undoLastAction}>
              <Ionicons name="arrow-undo-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>

            {/* Actionneur de réinitialisation complète du canvas partagé */}
            <TouchableOpacity style={styles.actionButton} onPress={clearCanvas}>
              <Ionicons name="refresh-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>

        </View>
      </View>

    </View>
  );
}

// Styles utilitaires d'extension globale
const StyleSheet = { absoluteFill: { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 } };