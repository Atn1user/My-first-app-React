import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Animated,
  Alert,
} from 'react-native';

export default function App() {

  const [nome, setNome] = useState('');
  const [nomeSalvo, setNomeSalvo] = useState('');

  const scaleValue = useRef(new Animated.Value(1)).current;

  // Animação do texto
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const salvarNome = () => {
    if (nome.trim() === '') {
      Alert.alert('Atenção', 'Digite um nome antes de salvar!');
      return;
    }

    setNomeSalvo(nome);
    setNome('');

    // Reset da animação
    fadeAnim.setValue(0);
    slideAnim.setValue(20);

    // Executa animação
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  };

  return(
    <View style={styles.container}>
      <View style={styles.card}>
        
        <Text style={styles.title}>Meu Primeiro App</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Digite seu nome"
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={salvarNome}
        >
          <Animated.View style={[styles.button, { transform: [{ scale: scaleValue }] }]}>
            <Text style={styles.buttonText}>Salvar</Text>
          </Animated.View>
        </TouchableWithoutFeedback>

        {nomeSalvo !== '' && (
          <Animated.Text
            style={[
              styles.resultado,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            👋 Olá, {nomeSalvo}!
          </Animated.Text>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F3F0FF",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5A189A",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#FAFAFA",
  },

  button: {
    backgroundColor: "#7B2CBF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  resultado: {
    marginTop: 25,
    fontSize: 20,
    textAlign: "center",
    color: "#5A189A",
    fontWeight: "600",
  }

});
