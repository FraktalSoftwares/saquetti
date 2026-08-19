import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/home/HomeScreen';
import { AlertasScreen } from '../screens/home/AlertasScreen';
import { CartaoPontoScreen } from '../screens/cartao/CartaoPontoScreen';
import { PerfilScreen } from '../screens/perfil/PerfilScreen';
import { colors, fontFamily } from '../theme';
import type { AppTabsParamList, HomeStackParamList } from './types';

const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();

/** Stack da aba Home: mantem a bottom nav visivel ao abrir Alertas. */
function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNav.Screen name="HomeMain" component={HomeScreen} />
      <HomeStackNav.Screen name="Alertas" component={AlertasScreen} />
    </HomeStackNav.Navigator>
  );
}

const Tab = createBottomTabNavigator<AppTabsParamList>();

const ICONS: Record<keyof AppTabsParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  CartaoPonto: 'grid-outline',
  Horarios: 'time-outline',
  Perfil: 'person-outline',
};

const LABELS: Record<keyof AppTabsParamList, string> = {
  Home: 'Home',
  CartaoPonto: 'Cartão Ponto',
  Horarios: 'Horários',
  Perfil: 'Perfil',
};

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: fontFamily.medium, fontSize: 11 },
        tabBarStyle: { borderTopColor: colors.borderLight, height: 88, paddingTop: 8 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size} color={color} />
        ),
        tabBarLabel: LABELS[route.name],
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="CartaoPonto" component={CartaoPontoScreen} />
      {/* "Horários": mesmo Espelho, aberto direto na sub-aba Banco de Horas (conforme design). */}
      <Tab.Screen name="Horarios" component={CartaoPontoScreen} initialParams={{ aba: 'banco' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
