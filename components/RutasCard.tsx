import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Driver } from '@/store/useClientStore';

export type RootStackParamList = {
  Home: undefined;
  Mapa: { driver: Driver };  // ← ahora pasamos un driver
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  driver: Driver;
}

const RutasCard: React.FC<Props> = ({ driver }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Mapa', { driver })}
    >
      <Text style={styles.nombre}>{driver.name}</Text>
      <Text style={styles.descripcion}>Placa: {driver.plate}</Text>
      <Text style={styles.descripcion}>Estado: {driver.status}</Text>
      <Text style={styles.descripcion}>
        Ubicación: {driver.location.latitude}, {driver.location.longitude}
      </Text>
      <Text style={styles.descripcion}>
        Ruta con {driver.ruta.length} puntos
      </Text>
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
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
  },
});

export default RutasCard;
