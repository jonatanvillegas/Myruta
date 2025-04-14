import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Colors } from "@/constants/Colors";
import { useAuthStore } from "@/store/useAuthStore";
import { MapPin  } from 'lucide-react-native'

export default function SplashScreen() {
  const router = useRouter();
  const { usuario } = useAuthStore(); 
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();


    const timer = setTimeout(() => {
      if (!usuario) {

        router.replace("/(auth)/auth");
      } else if (usuario.rol === "client") {
        router.replace("/(client)/home");
      } else if (usuario.rol === "driver") {
        router.replace("/(driver)/home");
      } else if (usuario.rol === "admin") {
        router.replace("/(admin)/home");
      } else {
        router.replace("/(auth)/auth"); // fallback por si no trae rol
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >

        <MapPin  size={75} color="yellow" />
        <Text style={styles.appName}>MedRemind</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
  },
  appName: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
    letterSpacing: 1,
  },
});