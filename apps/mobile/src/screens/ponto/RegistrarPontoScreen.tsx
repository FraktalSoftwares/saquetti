import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, BackButton, Button, MapMock } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { obterLocalizacao, type GpsResult } from '../../services/locationService';
import { getProximoTipo, getUltimaMarcacao } from '../../services/pontoService';
import { dataLonga, horaCompleta } from '../../utils/datetime';
import type { LocalizacaoPonto, TipoMarcacao } from '../../types';
import type { AppStackScreenProps } from '../../navigation/types';

/** Tela 3.1 Registrar Ponto (RF-007). */
export function RegistrarPontoScreen({ navigation }: AppStackScreenProps<'RegistrarPonto'>) {
  const insets = useSafeAreaInsets();
  const { colaborador } = useAuth();
  const exigeGps = colaborador?.capturarGps ?? true;

  const [relogio, setRelogio] = useState(() => horaCompleta(new Date()));
  const [gps, setGps] = useState<GpsResult | null>(exigeGps ? null : { status: 'ok', loc: SEM_GPS });
  const [tipo, setTipo] = useState<TipoMarcacao>('Entrada');
  const [ultima, setUltima] = useState<string | null>(null);

  // Tipo sugerido + última marcação (dados reais).
  useEffect(() => {
    getProximoTipo().then(setTipo);
    getUltimaMarcacao().then(setUltima);
  }, []);

  // Relógio ao vivo.
  useEffect(() => {
    const t = setInterval(() => setRelogio(horaCompleta(new Date())), 1000);
    return () => clearInterval(t);
  }, []);

  const capturarGps = () => {
    setGps(null);
    obterLocalizacao().then(setGps);
  };

  useEffect(() => {
    if (exigeGps) capturarGps();
  }, [exigeGps]);

  const loc = gps?.status === 'ok' ? gps.loc : null;
  const gpsPronto = !exigeGps || gps?.status === 'ok';
  const gpsCarregando = exigeGps && gps === null;

  const avancar = () => {
    if (!gpsPronto) return;
    const localizacao = exigeGps ? loc : null;
    if (colaborador?.capturarFoto) {
      navigation.navigate('FotoVerificacao', { tipo, localizacao });
    } else {
      navigation.navigate('ConfirmarRegistro', { tipo, localizacao, fotoUri: null });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header escuro */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <BackButton onPress={() => navigation.goBack()} color={colors.white} />
        <Text style={styles.headerTitle}>Registrar Ponto</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Card do colaborador */}
        <View style={styles.userCard}>
          <Avatar size={46} />
          <View>
            <Text style={styles.userName}>{colaborador?.nomeCompleto ?? 'Colaborador'}</Text>
            <Text style={styles.userDate}>{dataLonga(new Date())}</Text>
          </View>
        </View>

        {/* Horário atual */}
        <View style={styles.clockBlock}>
          <Text style={styles.clockLabel}>HORÁRIO ATUAL</Text>
          <Text style={styles.clock}>{relogio}</Text>
          {ultima && (
            <View style={styles.pill}>
              <Ionicons name="time-outline" size={15} color={colors.infoText} />
              <Text style={styles.pillText}>Última marcação: {ultima}</Text>
            </View>
          )}
        </View>

        {/* GPS */}
        {exigeGps && (
          <View style={styles.gpsBlock}>
            {gpsCarregando ? (
              <View style={styles.gpsLoading}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.gpsLoadingText}>Obtendo localização…</Text>
              </View>
            ) : gps?.status === 'ok' ? (
              <>
                <MapMock height={180} controls />
                <View style={styles.locCard}>
                  <Ionicons name="location-outline" size={20} color={colors.primary} />
                  <View style={styles.flex1}>
                    <Text style={styles.locTitle}>{loc?.logradouro}</Text>
                    <Text style={styles.locSub}>
                      {loc?.complemento}
                      {loc?.precisao != null ? `  ·  ±${Math.round(loc.precisao)} m` : ''}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <GpsErro status={gps?.status ?? 'error'} onRetry={capturarGps} />
            )}
          </View>
        )}

        <Button
          title="Registrar Ponto"
          onPress={avancar}
          disabled={!gpsPronto}
          style={styles.submit}
        />
      </ScrollView>
    </View>
  );
}

/** Estados de bloqueio do GPS (RF-007): permissão negada, GPS desligado, falha após retries. */
function GpsErro({
  status,
  onRetry,
}: {
  status: GpsResult['status'];
  onRetry: () => void;
}) {
  const msg =
    status === 'denied'
      ? 'Permissão de localização negada. Ative-a nas configurações do dispositivo para registrar o ponto.'
      : status === 'disabled'
        ? 'O GPS está desligado. Ative a localização do dispositivo para registrar o ponto.'
        : 'Não foi possível obter sua localização. Verifique o sinal e tente novamente.';
  return (
    <View style={styles.gpsErro}>
      <Ionicons name="location-outline" size={24} color={colors.danger} />
      <Text style={styles.gpsErroText}>{msg}</Text>
      <Pressable onPress={onRetry} hitSlop={8} style={styles.retry}>
        <Ionicons name="refresh" size={16} color={colors.primary} />
        <Text style={styles.retryText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

const SEM_GPS: LocalizacaoPonto = {
  latitude: 0,
  longitude: 0,
  precisao: null,
  logradouro: '',
  complemento: '',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  flex1: { flex: 1 },

  header: {
    backgroundColor: colors.headerDark,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...typography.h2,
    fontSize: 17,
    letterSpacing: 0.5,
    color: colors.white,
    textTransform: 'uppercase',
  },
  headerSpacer: { width: 40 },

  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  userName: { ...typography.bodySemibold, fontSize: 16, color: colors.textPrimary },
  userDate: { ...typography.body, color: colors.textSecondary, marginTop: 1 },

  clockBlock: { alignItems: 'center', marginTop: spacing.xxl },
  clockLabel: { ...typography.overline, color: colors.textSecondary, letterSpacing: 1 },
  clock: {
    fontFamily: typography.title.fontFamily,
    fontSize: 48,
    letterSpacing: -1,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    fontVariant: ['tabular-nums'],
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: spacing.md,
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  pillText: { ...typography.body, fontSize: 13, color: colors.infoText, fontWeight: '600' },

  gpsBlock: { marginTop: spacing.xl },
  gpsLoading: {
    height: 180,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  gpsLoadingText: { ...typography.body, color: colors.textSecondary },

  locCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  locTitle: { ...typography.bodySemibold, fontSize: 15, color: colors.textPrimary },
  locSub: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },

  gpsErro: {
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerBg,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  gpsErroText: { ...typography.body, color: colors.textPrimary, textAlign: 'center' },
  retry: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.xs },
  retryText: { ...typography.bodySemibold, color: colors.primary },

  submit: { marginTop: spacing.xxl },
});
