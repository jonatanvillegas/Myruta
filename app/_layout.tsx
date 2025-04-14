import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/useAuthStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { usuario, inicializarSesion, loading } = useAuthStore();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    inicializarSesion();
  }, []);

  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);

  if (!loaded || loading) {
    return null;
  }


  const renderStack = () => {
    const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

    if (!usuario) {
      return (
        <ThemeProvider value={theme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      );
    }
    const roleScreens: Record<string, string> = {
      client: "(client)",
      driver: "(driver)",
      admin: "(admin)"
    };

    const stackName = roleScreens[usuario.rol];

    // Si el rol no existe en el objeto
    if (!stackName) {
      return (
        <ThemeProvider value={theme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider value={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name={stackName} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  };


  return renderStack();
}
