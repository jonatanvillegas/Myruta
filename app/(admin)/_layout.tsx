import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminScreen from './home';
import CreateDriverScreen from './createDriver';
import LoadRoute from './loadRoute';

const Stack = createNativeStackNavigator();

const AdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen name="home" component={AdminScreen}  options={{ headerShown: false }}/>
      <Stack.Screen name="createDriver" component={CreateDriverScreen} />
      <Stack.Screen name="loadRoute" component={LoadRoute} />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
