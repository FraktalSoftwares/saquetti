import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTabs } from './AppTabs';
import { RegistrarPontoScreen } from '../screens/ponto/RegistrarPontoScreen';
import { FotoVerificacaoScreen } from '../screens/ponto/FotoVerificacaoScreen';
import { ConfirmarRegistroScreen } from '../screens/ponto/ConfirmarRegistroScreen';
import { ComprovanteScreen } from '../screens/ponto/ComprovanteScreen';
import { DetalhesDiaScreen } from '../screens/cartao/DetalhesDiaScreen';
import { CartaoDetalheScreen } from '../screens/cartao/CartaoDetalheScreen';
import { AssinarCartaoScreen } from '../screens/assinatura/AssinarCartaoScreen';
import { CapturaAssinaturaScreen } from '../screens/assinatura/CapturaAssinaturaScreen';
import { AssinaturaConfirmadaScreen } from '../screens/assinatura/AssinaturaConfirmadaScreen';
import { VisualizarPdfScreen } from '../screens/assinatura/VisualizarPdfScreen';
import { SolicitacoesScreen } from '../screens/solicitacoes/SolicitacoesScreen';
import { NovaSolicitacaoScreen } from '../screens/solicitacoes/NovaSolicitacaoScreen';
import { SolicitacaoDetalheScreen } from '../screens/solicitacoes/SolicitacaoDetalheScreen';
import { JustificarAusenciaScreen } from '../screens/solicitacoes/JustificarAusenciaScreen';
import { MeusDadosScreen } from '../screens/perfil/MeusDadosScreen';
import { AlterarSenhaScreen } from '../screens/perfil/AlterarSenhaScreen';
import { NotificacoesScreen } from '../screens/notificacoes/NotificacoesScreen';
import { NotificacaoDetalheScreen } from '../screens/notificacoes/NotificacaoDetalheScreen';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

/**
 * Stack do app autenticado. As telas de Registro de Ponto ficam acima das Tabs
 * (cobrem a bottom nav), como no design.
 */
export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
      <Stack.Screen name="RegistrarPonto" component={RegistrarPontoScreen} />
      <Stack.Screen name="FotoVerificacao" component={FotoVerificacaoScreen} />
      <Stack.Screen name="ConfirmarRegistro" component={ConfirmarRegistroScreen} />
      <Stack.Screen name="Comprovante" component={ComprovanteScreen} />
      <Stack.Screen name="DetalhesDia" component={DetalhesDiaScreen} />
      <Stack.Screen name="CartaoDetalhe" component={CartaoDetalheScreen} />
      <Stack.Screen name="AssinarCartao" component={AssinarCartaoScreen} />
      <Stack.Screen
        name="CapturaAssinatura"
        component={CapturaAssinaturaScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="AssinaturaConfirmada" component={AssinaturaConfirmadaScreen} />
      <Stack.Screen name="VisualizarPdf" component={VisualizarPdfScreen} />
      <Stack.Screen name="Solicitacoes" component={SolicitacoesScreen} />
      <Stack.Screen name="NovaSolicitacao" component={NovaSolicitacaoScreen} />
      <Stack.Screen name="SolicitacaoDetalhe" component={SolicitacaoDetalheScreen} />
      <Stack.Screen name="JustificarAusencia" component={JustificarAusenciaScreen} />
      <Stack.Screen name="MeusDados" component={MeusDadosScreen} />
      <Stack.Screen name="AlterarSenha" component={AlterarSenhaScreen} />
      <Stack.Screen name="Notificacoes" component={NotificacoesScreen} />
      <Stack.Screen name="NotificacaoDetalhe" component={NotificacaoDetalheScreen} />
    </Stack.Navigator>
  );
}
