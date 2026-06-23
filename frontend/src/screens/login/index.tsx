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
import { styles } from './styles';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // FILTRE EN TEMPS RÉEL : Bloque les chiffres et caractères spéciaux au clavier
  const handleNameChange = (text: string) => {
    // On ne garde que les lettres (majuscules/minuscules, accents), les espaces et les tirets
    const filteredText = text.replace(/[^a-zA-ZÀ-ÿ\s-]/g, '');
    setName(filteredText);
  };

  const handleProcess = () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    // 1. Contrôle des champs vides
    if (!cleanEmail || !cleanPassword || (isRegistering && !cleanName)) {
      const msg = 'Veuillez remplir tous les champs.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Erreur', msg);
      return;
    }

    // 2. Contrôle du format e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      const msg = "L'adresse e-mail n'est pas valide.";
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Format invalide', msg);
      return;
    }

    // 3. Contrôle de la sécurité du mot de passe (8 caractères min, 1 chiffre, 1 car. spécial)
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(cleanPassword)) {
      const msg = 'Le mot de passe doit contenir au moins 8 caractères, un chiffre et un caractère spécial.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Sécurité insuffisante', msg);
      return;
    }

    if (isRegistering) {
      const msg = 'Votre compte a bien été créé !';
      if (Platform.OS === 'web') {
        alert(msg);
        onLoginSuccess();
      } else {
        Alert.alert('Succès', msg, [{ text: 'Continuer', onPress: () => onLoginSuccess() }]);
      }
    } else {
      onLoginSuccess();
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

        {/* Formulaire */}
        <View style={styles.formBlock}>
          
          {isRegistering && (
            <TextInput
              style={styles.inputField}
              placeholder="Nom complet"
              placeholderTextColor="#FFFFFF"
              value={name}
              onChangeText={handleNameChange} // Utilise le filtre au moment de presser les touches
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.inputField}
            placeholder="E-mail ou numéro mobile"
            placeholderTextColor="#FFFFFF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
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
          />

          <TouchableOpacity style={styles.mainButton} onPress={handleProcess}>
            <Text style={styles.mainButtonText}>
              {isRegistering ? "S'inscrire" : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          {!isRegistering && (
            <TouchableOpacity 
              style={styles.forgotLink} 
              onPress={() => Alert.alert('Aide', 'Redirection vers la récupération de compte.')}
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
              setIsRegistering(!isRegistering);
              setEmail('');
              setPassword('');
              setName('');
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