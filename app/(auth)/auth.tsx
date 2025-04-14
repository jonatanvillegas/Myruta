import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, Animated, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

const AuthScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { login, error, loading } = useAuthStore();

  const router = useRouter(); 

  const [dataLogin, setDataLogin] = useState({
    correo: '',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setDataLogin({ ...dataLogin, [field]: value });
  };

  const handleLogin = async () => {
    const { correo, password } = dataLogin;
    if (!correo || !password) {
      Alert.alert('Campos requeridos', 'Por favor completa ambos campos');
      return;
    }

    try {
      await login(correo, password);
      Alert.alert('Éxito', 'Inicio de sesión correcto');
      router.replace("/");
      // Aquí podrías navegar o hacer algo más después del login
    } catch (e) {
      Alert.alert('Error', error || 'Hubo un problema al iniciar sesión');
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Pantalla de Autenticación</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={dataLogin.correo}
        onChangeText={(text) => handleChange('correo', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={Colors.dark.text}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={dataLogin.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
        placeholderTextColor={Colors.dark.text}
      />

      <Button title={loading ? 'Cargando...' : 'Iniciar Sesión'} onPress={handleLogin} />

      <Link href="/register" style={styles.link}>
        ¿No tienes cuenta? Regístrate aquí
      </Link>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: Colors.dark.text,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    color: Colors.dark.text,
  },
  link: {
    marginTop: 16,
    color: Colors.dark.text,
    textDecorationLine: 'underline',
  },
});

export default AuthScreen;
