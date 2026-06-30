import { StyleSheet, Platform, StatusBar } from 'react-native';
import { COLORS } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.crushedCacao,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
    paddingBottom: Platform.OS === 'android' ? 24 : 40,
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
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
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
  },
  canvas: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
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
    opacity: 0.6,
  },
  controlPanel: {
    backgroundColor: COLORS.mulberryNight,
    borderTopWidth: 1,
    borderTopColor: COLORS.champagneSilk,
    paddingBottom: 20,
  },
  sizeSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(206, 179, 171, 0.2)',
  },
  label: {
    color: COLORS.champagneSilk,
    fontSize: 14,
    marginRight: 12,
  },
  sizeButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  sizeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeButtonActive: {
    backgroundColor: COLORS.glaceApricot,
  },
  sizeDot: {
    backgroundColor: COLORS.white,
  },
  toolbar: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  toolGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  toolCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toolCircleSelected: {
    borderColor: COLORS.champagneSilk,
    transform: [{ scale: 1.1 }],
  },
  toolActionGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: COLORS.indigoTart,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eraserButtonActive: {
    backgroundColor: COLORS.glaceApricot,
  },
  actionButtonText: {
    fontSize: 18,
    color: COLORS.white,
  },
});