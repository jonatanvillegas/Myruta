import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import RutasCard from '@/components/RutasCard';

export type RootStackParamList = {
  Home: undefined;
  Mapa: { ruta: Ruta };
};

export interface Ruta {
  id: string;
  nombre: string;
  descripcion: string;
}

const HomeScreen: React.FC = () => {
  const rutas: Ruta[] = [
    { id: '1', nombre: 'Ruta A', descripcion: 'Ruta principal para el cliente' },
    { id: '2', nombre: 'Ruta B', descripcion: 'Ruta alterna que conecta con otros puntos' },
    { id: '3', nombre: 'Ruta C', descripcion: 'Ruta rápida para entrega express' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, Cliente</Text>
      <FlatList
        data={rutas}
        renderItem={({ item }) => <RutasCard ruta={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});

export default HomeScreen;
