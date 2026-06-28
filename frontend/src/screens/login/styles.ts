import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.mulberryNight, // Fond identique à ton image monlogin.png
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.champagneSilk,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
    marginTop: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  formBlock: {
    width: '100%',
    alignItems: 'center',
  },
  inputField: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.champagneSilk, // Couleur claire texturée du thème
    borderRadius: 18, // Coins bien arrondis comme sur la maquette
    paddingHorizontal: 20,
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 16,
    textAlign: 'left',
  },
  mainButton: {
    width: '100%',
    height: 52,
    backgroundColor: COLORS.indigoTart, // Bouton sombre de ton image exemple
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  mainButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  forgotLink: {
    marginTop: 20,
    paddingVertical: 5,
  },
  forgotText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '400',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 35,
  },
  switchButton: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white, // Bouton blanc éclatant tout en bas
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchButtonText: {
    color: COLORS.crushedCacao,
    fontSize: 15,
    fontWeight: '500',
  },
});