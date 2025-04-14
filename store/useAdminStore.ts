import { create } from 'zustand';
import { collection, addDoc, serverTimestamp, GeoPoint, getDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig'; // Asegúrate de que auth esté correctamente configurado

type DriverStatus = 'activo' | 'inactivo' | 'pausa';

interface Driver {
  id: string;
  name: string;
  email?: string;
  phone: string;
  plate: string;
  role: 'driver';
  status: DriverStatus;
  location?: GeoPoint;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminState {
  loading: boolean;
  error: string | null;
  crearDriver: (driverData: {
    name: string;
    phone: string;
    plate: string;
    status: DriverStatus;
    location?: GeoPoint;
    correoTrim: string;
    password: string;
  }) => Promise<void>;
  obtenerDrivers: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  loading: false,
  error: null,

  crearDriver: async ({ name, phone, plate, status, location, correoTrim, password }) => {
    try {
      set({ loading: true, error: null });

      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, correoTrim, password);
      const user = userCredential.user;

      // Crear el conductor en Firestore
      const docRef = await addDoc(collection(db, 'drivers'), {
        name,
        phone,
        plate,
        role: 'driver',
        status,
        location: location || null,
        email: user.email, // Guarda el correo del usuario de Firebase
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert('Éxito', `Conductor creado con ID: ${docRef.id}`);
    } catch (error: any) {
      set({ error: error.message });
      Alert.alert('Error', error.message);
      console.log('Error', error.message)
    } finally {
      set({ loading: false });
    }
  },
  obtenerDrivers: async () => {
    set({ loading: true, error: null }); 
    try {
      const userDoc = await getDoc(doc(db, "drivers"));
    } catch (error) {
      
    }
  }
}));
