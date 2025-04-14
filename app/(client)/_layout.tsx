import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './home';
import MapaScreen from './MapaScreen';

export type RootStackParamList = {
    Home: undefined;
    Mapa: { ruta: Ruta };
  };
  
  export interface Ruta {
    id: string;
    nombre: string;
    descripcion: string;
  }
  
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function ClientLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Mapa" component={MapaScreen} />
    </Stack.Navigator>
  );
}
