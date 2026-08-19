import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { Comprovante, LocalizacaoPonto, TipoMarcacao } from '../types';

export type AuthStackParamList = {
  Login: undefined;
  Recuperar: undefined;
  NovaSenha: undefined;
};

/** Stack da aba Home (mantem a bottom nav visivel, ex.: em Alertas). */
export type HomeStackParamList = {
  HomeMain: undefined;
  Alertas: undefined;
};

export type AbaCartao = 'cartao' | 'banco' | 'assinatura';

export type AppTabsParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  CartaoPonto: { aba?: AbaCartao } | undefined;
  // "Horários" é, no design, um atalho para o Espelho já na sub-aba Banco de Horas.
  Horarios: { aba?: AbaCartao } | undefined;
  Perfil: undefined;
};

/** Stack raiz do app autenticado: Tabs + fluxo de Registro de Ponto (cobre a bottom nav). */
export type AppStackParamList = {
  Tabs: NavigatorScreenParams<AppTabsParamList> | undefined;
  RegistrarPonto: undefined;
  FotoVerificacao: { tipo: TipoMarcacao; localizacao: LocalizacaoPonto | null };
  ConfirmarRegistro: {
    tipo: TipoMarcacao;
    localizacao: LocalizacaoPonto | null;
    fotoUri: string | null;
  };
  Comprovante: { comprovante: Comprovante };
  DetalhesDia: { diaId: string };
  CartaoDetalhe: { mesId: string };
  AssinarCartao: { mesId: string };
  CapturaAssinatura: { mesId: string };
  AssinaturaConfirmada: { mesId: string };
  VisualizarPdf: { mesId: string };
  Solicitacoes: undefined;
  NovaSolicitacao: { diaId?: string } | undefined;
  SolicitacaoDetalhe: { id: string };
  JustificarAusencia: { diaId?: string } | undefined;
  MeusDados: undefined;
  AlterarSenha: undefined;
  Notificacoes: undefined;
  NotificacaoDetalhe: { id: string };
};

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>;

/** Telas da aba Home também alcançam o stack raiz (ex.: abrir Registrar Ponto). */
export type HomeStackScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>;

/** Telas-aba (bottom tabs) que também alcançam o stack raiz (ex.: abrir Detalhes do dia). */
export type AppTabScreenProps<T extends keyof AppTabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<AppTabsParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>;
