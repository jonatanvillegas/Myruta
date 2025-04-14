import { create } from 'zustand';
import { collection, addDoc, serverTimestamp, GeoPoint, getDoc, doc, getDocs } from 'firebase/firestore'; // Asegúrate de importar la configuración de Firebase
import rutas from '../assets/location/ruta.json'  // Importa las rutas del archivo JSON
import { db } from '@/config/firebaseConfig';

export type Driver = {
  name: string;
  plate: string;
  status: string;
  location: GeoPoint;
  ruta: GeoPoint[];
};

interface ClientState {
  drivers: Driver[];
  loading: boolean;
  obtenerDrivers: () => Promise<void>;
}

export const useClientStore = create<ClientState>((set) => ({
  loading: false,
  drivers: [],
  obtenerDrivers: async () => {
    set({ loading: true });

    try {
      // Obtenemos los conductores de la colección 'drivers' en Firestore
      const querySnapshot = await getDocs(collection(db, 'drivers'));

      const conductores: Driver[] = [];
      
      querySnapshot.forEach((doc) => {
        // Obtener los datos del conductor
        const data = doc.data();
        
        // Asumimos que el conductor tiene un campo 'location' de tipo GeoPoint
        const location = new GeoPoint(data.location.latitude, data.location.longitude);
        
        // Asignar la ruta estática (todas las rutas son iguales por ahora)
        const ruta = rutas.map((point: any) => new GeoPoint(point.latitude, point.longitude));
        
        // Crear el objeto de conductor con la ruta y agregarlo al arreglo
        const conductor: Driver = {
          name: data.name,
          plate: data.plate,
          status: data.status,
          location: location,
          ruta: ruta
        };

        conductores.push(conductor);
      });

      // Actualizamos el estado con los conductores y desactivamos el loading
      set({ drivers: conductores, loading: false });
    } catch (error) {
      console.error('Error al obtener los conductores:', error);
      set({ loading: false });
    }
  },
}));
