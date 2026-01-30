import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider } from '@/context/AuthContext';
//import { FormProvider } from '@/context/FormContext'; // ← importe o provider
//import { useColorScheme } from '@/hooks/useColorScheme';
import { useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

if (typeof global.structuredClone === "undefined") { global.structuredClone = (value) => JSON.parse(JSON.stringify(value)); }

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider> {/* ⬅️ Envolve tudo com o AuthProvider */}

        <Slot />
        <Toast />
        <StatusBar style="auto" />

      </AuthProvider>
    </ThemeProvider>
  );
}
