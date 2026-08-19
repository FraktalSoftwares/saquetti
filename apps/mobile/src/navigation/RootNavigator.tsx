import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { SplashScreen } from '../screens/SplashScreen';
import { AuthStack } from './AuthStack';
import { AppNavigator } from './AppNavigator';

export function RootNavigator() {
  const { initializing, profileLoading, session, colaborador } = useAuth();

  // Splash enquanto verificamos a sessao inicial ou validamos o perfil
  // (evita "piscar" a Home antes de confirmar o cadastro do colaborador).
  if (initializing || (session && profileLoading)) return <SplashScreen />;

  const entrouNoApp = !!session && !!colaborador;

  return (
    <NavigationContainer>
      {entrouNoApp ? <AppNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}
