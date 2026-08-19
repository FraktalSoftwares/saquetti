import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RecuperarSenhaScreen } from '../screens/auth/RecuperarSenhaScreen';
import { NovaSenhaScreen } from '../screens/auth/NovaSenhaScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Recuperar" component={RecuperarSenhaScreen} />
      <Stack.Screen name="NovaSenha" component={NovaSenhaScreen} />
    </Stack.Navigator>
  );
}
