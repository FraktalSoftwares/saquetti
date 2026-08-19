import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from '../../components';
import { qrSeloXml } from '../../assets/svg';
import { colors, radius, spacing, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { getCartaoCarimbo, type Carimbo } from '../../services/espelhoService';
import { diaLocalISO, horaCompletaDeISO } from '../../utils/datetime';
import type { AppStackScreenProps } from '../../navigation/types';

function carimboData(iso: string): string {
  const [y, m, d] = diaLocalISO(iso).split('-');
  return `${d}/${m}/${y} · ${horaCompletaDeISO(iso)}`;
}

/** Tela 7.3 Assinatura confirmada. */
export function AssinaturaConfirmadaScreen({
  navigation,
  route,
}: AppStackScreenProps<'AssinaturaConfirmada'>) {
  const insets = useSafeAreaInsets();
  const { colaborador } = useAuth();
  const nome = colaborador?.nomeCompleto ?? 'Colaborador';
  const [carimbo, setCarimbo] = useState<Carimbo | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getCartaoCarimbo(route.params.mesId).then((c) => {
        if (active) setCarimbo(c);
      });
      return () => {
        active = false;
      };
    }, [route.params.mesId]),
  );

  const geo =
    carimbo?.latitude != null && carimbo?.longitude != null
      ? `${carimbo.latitude.toFixed(6)}, ${carimbo.longitude.toFixed(6)}`
      : null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <View style={styles.circle}>
            <Ionicons name="checkmark" size={38} color={colors.successBright} />
          </View>
          <Text style={styles.title}>Cartão assinado!</Text>
          <Text style={styles.subtitle}>Sua assinatura eletrônica foi registrada com sucesso.</Text>
        </View>

        <View style={styles.carimbo}>
          <View style={styles.qrBox}>
            <SvgXml xml={qrSeloXml} width={78} height={78} />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.carimboLabel}>CARIMBO</Text>
            <Text style={styles.carimboNome}>{nome}</Text>
            <Text style={styles.carimboMeta}>{carimbo ? carimboData(carimbo.assinadoEm) : '—'}</Text>
            <Text style={styles.carimboMeta}>IP {carimbo?.ip ?? '—'}</Text>
            {geo && (
              <View style={styles.geoRow}>
                <Ionicons name="location-outline" size={12} color={colors.textMuted} />
                <Text style={styles.carimboMeta}>{geo}</Text>
              </View>
            )}
            <Text style={styles.qrLink}>QR Code de validação</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Button
          title="Voltar ao cartão"
          onPress={() => navigation.navigate('CartaoDetalhe', { mesId: route.params.mesId })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  flex1: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  head: { alignItems: 'center' },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.title, fontSize: 26, color: colors.textPrimary, marginTop: 18 },
  subtitle: { ...typography.body, fontSize: 14, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },

  carimbo: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginTop: spacing.xxl,
    backgroundColor: colors.receiptBg,
    borderRadius: radius.xl,
    padding: 18,
  },
  qrBox: { backgroundColor: colors.white, borderRadius: radius.md, padding: 8 },
  carimboLabel: { ...typography.overline, fontSize: 11, color: colors.textMuted, letterSpacing: 1 },
  carimboNome: { ...typography.bodySemibold, fontSize: 13, color: colors.white, marginTop: 8 },
  carimboMeta: { ...typography.caption, fontSize: 12, color: colors.textMuted, marginTop: 3 },
  geoRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  qrLink: { ...typography.caption, fontSize: 11, fontWeight: '600', color: colors.receiptIcon, marginTop: 6 },

  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
});
