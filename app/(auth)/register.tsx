import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, Animated, StyleSheet, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';

const RegisterScreen = () => {
  const { registrar } = useAuthStore();
  const router = useRouter();

  const [datosRegister, setDatosRegister] = useState({
    nombre: '',
    correo: '',
    password: ''
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (field: string, value: string) => {
    setDatosRegister({ ...datosRegister, [field]: value });
  };

  // 🔹 Ejecutar registro y redirigir con delay
  const handleRegistro = async () => {
    const { nombre, correo, password } = datosRegister;

    if (!nombre || !correo || !password) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }

    try {
      await registrar(nombre, correo, password);
      Alert.alert('Registro exitoso', 'Redirigiendo al login...');

      setTimeout(() => {
        router.replace('/auth'); // <-- redirige al login
      }, 3000);

    } catch (error: any) {
      Alert.alert('Error en el registro', error.message);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Pantalla de Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre Completo"
        placeholderTextColor={Colors.dark.text}
        value={datosRegister.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={Colors.dark.text}
        value={datosRegister.correo}
        onChangeText={(text) => handleChange('correo', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        placeholderTextColor={Colors.dark.text}
        value={datosRegister.password}
        onChangeText={(text) => handleChange('password', text)}
      />

      <Button title="Registrarse" onPress={handleRegistro} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.dark.background
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: Colors.dark.text
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
});

export default RegisterScreen;
