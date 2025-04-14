import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Platform, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, Circle, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Mapa: { ruta: Ruta };
};

export interface Ruta {
  id: string;
  nombre: string;
  descripcion: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Mapa'>;

const MapaScreen: React.FC<Props> = ({ route, navigation }) => {
  const { ruta } = route.params;

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [busLocation, setBusLocation] = useState<LatLng>({
    latitude: 12.136389,
    longitude: -86.251389,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    async function startWatchingLocation() {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('Oops, esto no funciona en un emulador de Android. ¡Prueba en un dispositivo real!');
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado.');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // cada 2 segundos
          distanceInterval: 1, // o cuando se mueva al menos 1 metro
        },
        (location) => {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );
    }

    startWatchingLocation();

    // Limpieza al desmontar
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Simulación de movimiento del bus
  useEffect(() => {
    const interval = setInterval(() => {
      setBusLocation((prev) => ({
        latitude: prev.latitude + 0.0005,
        longitude: prev.longitude + 0.0005,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {!userLocation && !errorMsg ? (
        <ActivityIndicator size="large" color="#00BFFF" style={{ flex: 1 }} />
      ) : errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 12.136389,
            longitude: -86.251389,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Ubicación del usuario */}
          {userLocation && (
            <Marker coordinate={userLocation} title="Tú estás aquí" pinColor="blue" />
          )}

          {/* Marker del bus */}
          <Marker
            coordinate={busLocation}
            title={`Transporte - ${ruta.nombre}`}
            pinColor="red"
          />

          <Circle
            center={busLocation}
            radius={250} 
            strokeWidth={2}
            strokeColor="rgba(255, 87, 34, 0.8)"
            fillColor="rgba(255, 87, 34, 0.3)"
          />

          {/* Línea entre el bus y el usuario */}
          {userLocation && (
            <Polyline
              coordinates={[busLocation, userLocation]}
              strokeColor="#00BFFF"
              strokeWidth={3}
            />
          )}
          {userLocation && (
            <Circle
                center={userLocation}
                radius={250} // radio de 250 metros
                strokeWidth={2}
                strokeColor="rgba(34, 156, 255, 0.8)"
                fillColor="rgba(34, 82, 255, 0.3)"
            />
            )}
        </MapView>
      )}
      <Button title="Volver a lista" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  error: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    color: 'red',
    padding: 20,
  },
});

export default MapaScreen;
