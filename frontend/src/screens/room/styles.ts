// src/screens/room/styles.ts
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
  headerTitle: {
    color: COLORS.champagneSilk,
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: COLORS.indigoTart,
  },
  createBlock: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  inputField: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(206, 179, 171, 0.3)',
  },
  createButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.indigoTart,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  roomCard: {
    backgroundColor: COLORS.mulberryNight,
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(206, 179, 171, 0.1)',
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roomName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    color: COLORS.champagneSilk,
    textAlign: 'center',
    marginTop: 40,
    opacity: 0.6,
    fontSize: 14,
  },
});