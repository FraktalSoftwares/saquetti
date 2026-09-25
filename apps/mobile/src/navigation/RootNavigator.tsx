import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { SplashScreen } from '../screens/SplashScreen';
import { AuthStack } from './AuthStack';
import { AppNavigator } from './AppNavigator';

export function RootNavigator() {
  const { initializing, profileLoading, session, colaborador, recoveryMode } = useAuth();

  // Splash enquanto verificamos a sessao inicial ou validamos o perfil
  // (evita "piscar" a Home antes de confirmar o cadastro do colaborador).
  if (initializing || (session && profileLoading)) return <SplashScreen />;

  // Em recuperacao a sessao e valida, mas o usuario precisa definir a nova senha antes de entrar.
  const entrouNoApp = !!session && !!colaborador && !recoveryMode;

  return (
    <NavigationContainer>
      {entrouNoApp ? <AppNavigator /> : <AuthStack initialRoute={recoveryMode ? 'NovaSenha' : 'Login'} />}
    </NavigationContainer>
  );
}
