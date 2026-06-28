// src/screens/login/index.tsx
import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Alert,
  Image 
} from 'react-native';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { auth } from '../../services/firebase'; // Importation de notre configuration Firebase
import { styles } from './styles';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Gestion de l'état de chargement

  const handleNameChange = (text: string) => {
    const filteredText = text.replace(/[^a-zA-ZÀ-ÿ\s-]/g, '');
    setName(filteredText);
  };

  const handleProcess = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    // 1. Contrôles de validation locaux
    if (!cleanEmail || !cleanPassword || (isRegistering && !cleanName)) {
      const msg = 'Veuillez remplir tous les champs.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Erreur', msg);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      const msg = "L'adresse e-mail n'est pas valide.";
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Format invalide', msg);
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(cleanPassword)) {
      const msg = 'Le mot de passe doit contenir au moins 8 caractères, un chiffre et un caractère spécial.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Sécurité insuffisante', msg);
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        // LOGIQUE FIREBASE : Inscription d'un nouvel utilisateur
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        
        // Ajouter le nom de l'utilisateur à son profil Firebase Auth
        await updateProfile(userCredential.user, { displayName: cleanName });
        
        const msg = 'Votre compte a bien été créé !';
        Platform.OS === 'web' ? alert(msg) : Alert.alert('Succès', msg);
        onLoginSuccess();
      } else {
        // LOGIQUE FIREBASE : Connexion de l'utilisateur
        await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
        onLoginSuccess();
      }
    } catch (error: any) {
      // Gestion des erreurs Firebase courantes
      let errorMessage = "Une erreur est survenue lors de l'authentification.";
      if (error.code === 'auth/email-already-in-use') errorMessage = 'Cette adresse e-mail est déjà utilisée.';
      if (error.code === 'auth/invalid-credential') errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
      
      Platform.OS === 'web' ? alert(errorMessage) : Alert.alert('Échec', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        
        {/* Conteneur Logo Cercle */}
        <View style={styles.logoWrapper}>
          <Image 
            source={require('../../../assets/images/logoDrawing.png')} 
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>

        {/* Formulaire unique */}
        <View style={styles.formBlock}>
          
          {isRegistering && (
            <TextInput
              style={styles.inputField}
              placeholder="Nom complet"
              placeholderTextColor="#FFFFFF"
              value={name}
              onChangeText={handleNameChange}
              autoCapitalize="words"
              editable={!isLoading}
            />
          )}

          <TextInput
            style={styles.inputField}
            placeholder="E-mail"
            placeholderTextColor="#FFFFFF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Mot de passe"
            placeholderTextColor="#FFFFFF"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />

          {/* Bouton d'authentification principal */}
          <TouchableOpacity 
            style={[styles.mainButton, { opacity: isLoading ? 0.6 : 1 }]} 
            onPress={handleProcess}
            disabled={isLoading}
          >
            <Text style={styles.mainButtonText}>
              {isLoading ? 'Chargement...' : (isRegistering ? "S'inscrire" : 'Se connecter')}
            </Text>
          </TouchableOpacity>

          {!isRegistering && (
            <TouchableOpacity 
              style={styles.forgotLink} 
              onPress={() => Alert.alert('Aide', 'Fonctionnalité bientôt disponible.')}
            >
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bouton de bascule au bas de l'écran */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.switchButton} 
            onPress={() => {
              if (!isLoading) {
                setIsRegistering(!isRegistering);
                setEmail('');
                setPassword('');
                setName('');
              }
            }}
          >
            <Text style={styles.switchButtonText}>
              {isRegistering ? 'Déjà un compte ? Se connecter' : 'Créer un compte'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}