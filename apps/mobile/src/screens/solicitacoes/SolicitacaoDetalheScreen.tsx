import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackButton, StatusBadge } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { badgeToneStatus, getSolicitacao } from '../../services/solicitacoesService';
import type { Solicitacao } from '../../types';
import type { AppStackScreenProps } from '../../navigation/types';

/** Tela 5.2 Detalhe da solicitação. */
export function SolicitacaoDetalheScreen({ navigation, route }: AppStackScreenProps<'SolicitacaoDetalhe'>) {
  const insets = useSafeAreaInsets();
  const [sol, setSol] = useState<Solicitacao | null>(null);

  useFocusEffect(
    useCallback(() => {
      setSol(getSolicitacao(route.params.id) ?? null);
    }, [route.params.id]),
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Detalhe da solicitação</Text>
      </View>

      {!sol ? (
        <View style={styles.loading}>
          <Text style={styles.empty}>Solicitação não encontrada.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleRow}>
            <Text style={styles.tipo}>{sol.tipo}</Text>
            <StatusBadge text={sol.status} tone={badgeToneStatus(sol.status)} />
          </View>

          <View style={styles.card}>
            <Linha label="Data" value={sol.data} first />
            {sol.horario && <Linha label="Horário solicitado" value={sol.horario} />}
            {sol.motivo && <Linha label="Motivo" value={sol.motivo} />}
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>STATUS</Text>
            <View style={styles.timeline}>
              {sol.eventos.map((ev, i) => {
                const last = i === sol.eventos.length - 1;
                const cor = ev.estado === 'done' ? colors.primary : ev.estado === 'current' ? '#EAB308' : colors.borderLight;
                return (
                  <View key={i} style={styles.evRow}>
                    <View style={styles.evCol}>
                      <View style={[styles.evDot, { backgroundColor: cor }]} />
                      {!last && <View style={styles.evLine} />}
                    </View>
                    <View style={styles.evBody}>
                      <Text style={styles.evLabel}>{ev.label}</Text>
                      <Text style={styles.evWhen}>{ev.quando}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Linha({ label, value, first }: { label: string; value: string; first?: boolean }) {
  return (
    <View style={[styles.linha, !first && styles.linhaGap]}>
      <Text style={styles.linhaLabel}>{label}</Text>
      <Text style={styles.linhaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { ...typography.body, color: colors.textSecondary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: { ...typography.h2, fontSize: 17, color: colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.4 },
  content: { padding: spacing.lg },

  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tipo: { ...typography.title, fontSize: 20, color: colors.textPrimary },

  card: {
    marginTop: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  linha: { flexDirection: 'row', justifyContent: 'space-between' },
  linhaGap: { marginTop: 11 },
  linhaLabel: { ...typography.body, fontSize: 14, color: colors.textSecondary },
  linhaValue: { ...typography.bodySemibold, fontSize: 14, color: colors.textPrimary },

  statusCard: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  statusTitle: { ...typography.overline, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5 },
  timeline: { marginTop: spacing.md },
  evRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  evCol: { alignItems: 'center', alignSelf: 'stretch' },
  evDot: { width: 11, height: 11, borderRadius: 6, marginTop: 3 },
  evLine: { width: 2, flex: 1, minHeight: 24, backgroundColor: colors.borderLight },
  evBody: { paddingBottom: 14 },
  evLabel: { ...typography.bodySemibold, fontSize: 14, color: colors.textPrimary },
  evWhen: { ...typography.caption, color: colors.textMuted },
});
