// src/screens/canvas/styles.ts
import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.crushedCacao,
  },
  headerBar: {
    height: 60,
    backgroundColor: COLORS.mulberryNight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.champagneSilk,
  },
  roomTitle: {
    color: COLORS.champagneSilk,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: COLORS.indigoTart,
  },
  headerButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  canvasContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  canvas: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // Styles pour le texte indicatif au centre de l'écran
  placeholderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', 
  },
  placeholderText: {
    color: COLORS.champagneSilk,
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
  },
  toolbar: {
    height: 75,
    backgroundColor: COLORS.mulberryNight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.champagneSilk,
  },
  toolGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  toolCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  // Bordure pour mettre en valeur la couleur sélectionnée
  toolCircleSelected: {
    borderColor: COLORS.champagneSilk,
    transform: [{ scale: 1.1 }], // Grossit légèrement le cercle sélectionné
  },
  toolActionGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.indigoTart,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 20,
    color: COLORS.white,
  },
});