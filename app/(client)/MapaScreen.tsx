import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Platform, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, Circle, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GeoPoint } from 'firebase/firestore';

// Tu tipo real de Driver
export type Driver = {
  name: string;
  plate: string;
  status: string;
  location: GeoPoint;
  ruta: GeoPoint[];
};

export type RootStackParamList = {
  Home: undefined;
  Mapa: { driver: Driver };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Mapa'>;

const MapaScreen: React.FC<Props> = ({ route, navigation }) => {
  const { driver } = route.params;

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [busLocation, setBusLocation] = useState<LatLng>({
    latitude: driver.location.latitude,
    longitude: driver.location.longitude,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    async function startWatchingLocation() {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('Esto no funciona en un emulador de Android.');
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
          timeInterval: 2000,
          distanceInterval: 1,
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

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Simulación de movimiento del bus
  useEffect(() => {
    if (driver.ruta.length === 0) return;
  
    let currentIndex = 0;
  
    const interval = setInterval(() => {
      const nextPoint = driver.ruta[currentIndex];
  
      setBusLocation({
        latitude: nextPoint.latitude,
        longitude: nextPoint.longitude,
      });
  
      // Si llega al final, vuelve a empezar o se detiene
      if (currentIndex < driver.ruta.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0; // <-- Si quieres que vuelva a empezar, si no, usa clearInterval(interval)
        // clearInterval(interval); // <-- para detenerlo cuando termina
      }
    }, 3000); // Cambia cada 3 segundos
  
    return () => clearInterval(interval);
  }, [driver.ruta]);
  

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
            latitude: driver.location.latitude,
            longitude: driver.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Ubicación del usuario */}
          {userLocation && (
            <Marker coordinate={userLocation} title="Tú estás aquí" pinColor="blue" />
          )}

          {/* Ubicación del bus */}
          <Marker
            coordinate={busLocation}
            title={`Transporte - ${driver.name}`}
            pinColor="red"
          />

          {/* Círculo alrededor del bus */}
          <Circle
            center={busLocation}
            radius={250}
            strokeWidth={2}
            strokeColor="rgba(255, 87, 34, 0.8)"
            fillColor="rgba(255, 87, 34, 0.3)"
          />

          {/* Línea entre bus y usuario */}
          {userLocation && (
            <Polyline
              coordinates={[busLocation, userLocation]}
              strokeColor="#00BFFF"
              strokeWidth={3}
            />
          )}

          {/* Círculo alrededor del usuario */}
          {userLocation && (
            <Circle
              center={userLocation}
              radius={250}
              strokeWidth={2}
              strokeColor="rgba(34, 156, 255, 0.8)"
              fillColor="rgba(34, 82, 255, 0.3)"
            />
          )}

          {/* Ruta del driver */}
          <Polyline
            coordinates={driver.ruta.map((punto) => ({
              latitude: punto.latitude,
              longitude: punto.longitude,
            }))}
            strokeColor="#FF5722"
            strokeWidth={4}
          />
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
