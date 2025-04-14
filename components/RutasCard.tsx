import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Home: undefined;
    Mapa: { ruta: Ruta };
  };
  
  export interface Ruta {
    id: string;
    nombre: string;
    descripcion: string;
  }
  
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  ruta: Ruta;
}

const RutasCard: React.FC<Props> = ({ ruta }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Mapa', { ruta })}
    >
      <Text style={styles.nombre}>{ruta.nombre}</Text>
      <Text style={styles.descripcion}>{ruta.descripcion}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
  },
});

export default RutasCard;
