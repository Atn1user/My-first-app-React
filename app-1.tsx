import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Animated,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const scaleValue = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    const usuarioSalvo = await AsyncStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
  };

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

  const fazerLogin = async () => {
    if (email.trim() === '' || senha.trim() === '') {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const usuario = { email, senha };

    await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
    setUsuarioLogado(usuario);

    setEmail('');
    setSenha('');

    fadeAnim.setValue(0);
    slideAnim.setValue(20);

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

  const logout = async () => {
    await AsyncStorage.removeItem('usuario');
    setUsuarioLogado(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Text style={styles.title}>Tela de Login</Text>

        {usuarioLogado ? (
          <>
            <Animated.Text
              style={[
                styles.resultado,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              ✅ Bem-vindo, {usuarioLogado.email}
            </Animated.Text>

            <TouchableWithoutFeedback onPress={logout}>
              <View style={[styles.button, { marginTop: 20, backgroundColor: '#D00000' }]}>
                <Text style={styles.buttonText}>Sair</Text>
              </View>
            </TouchableWithoutFeedback>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <TouchableWithoutFeedback
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={fazerLogin}
            >
              <Animated.View style={[styles.button, { transform: [{ scale: scaleValue }] }]}>
                <Text style={styles.buttonText}>Entrar</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </>
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
    elevation: 10,
  },
  title: {
    fontSize: 26,
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
  },
  resultado: {
    fontSize: 18,
    textAlign: "center",
    color: "#5A189A",
    fontWeight: "600",
  }
});
