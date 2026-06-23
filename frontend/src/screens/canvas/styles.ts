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
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  canvasPlaceholderText: {
    color: COLORS.indigoTart,
    fontSize: 18,
    fontWeight: '600',
  },
  canvasSubPlaceholderText: {
    color: COLORS.champagneSilk,
    fontSize: 12,
    marginTop: 8,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.champagneSilk,
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
  },
});