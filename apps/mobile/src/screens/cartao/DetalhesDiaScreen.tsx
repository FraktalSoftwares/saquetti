import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { getDia } from '../../services/espelhoService';
import type { AppStackScreenProps } from '../../navigation/types';

/** Tela 4.1 Detalhamento do dia. */
export function DetalhesDiaScreen({ navigation, route }: AppStackScreenProps<'DetalhesDia'>) {
  const insets = useSafeAreaInsets();
  const dia = getDia(route.params.diaId);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Detalhes do dia</Text>
      </View>

      {!dia ? (
        <View style={styles.loading}>
          <Text style={styles.empty}>Dia não encontrado.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.dateTitle}>{dia.dataExtenso ?? `Dia ${dia.dia}`}</Text>
          {dia.resumoTag && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{dia.resumoTag}</Text>
            </View>
          )}

          <View style={styles.marcCard}>
            {dia.marcacoes.map((m, i) => (
              <View key={i} style={[styles.marcRow, i > 0 && styles.marcDivider]}>
                <View style={styles.dot} />
                <View style={styles.marcBody}>
                  <Text style={styles.marcLabel}>{m.label}</Text>
                  <View style={styles.localRow}>
                    <Ionicons name="location-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.local}>{m.local}</Text>
                  </View>
                </View>
                {m.hora ? (
                  <Text style={styles.hora}>{m.hora}</Text>
                ) : (
                  <Text style={styles.horaMissing}>X</Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.totais}>
            <Row label="Trabalhadas" value={dia.hours ?? '—'} />
            <Row label="Esperadas" value={dia.esperadas ?? '8h00'} style={styles.rowGap} />
            <View style={styles.hr} />
            <View style={styles.saldoRow}>
              <Text style={styles.saldoLabel}>Saldo do dia</Text>
              <Text style={[styles.saldoValue, { color: dia.saldoDiaPositivo ? colors.success : colors.danger }]}>
                {dia.saldoDia ?? '—'}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.actionBtn}
              onPress={() => navigation.navigate('NovaSolicitacao', { diaId: dia.id })}
            >
              <Text style={styles.actionText}>Solicitar Ajuste</Text>
            </Pressable>
            <Pressable
              style={styles.actionBtn}
              onPress={() => navigation.navigate('JustificarAusencia', { diaId: dia.id })}
            >
              <Text style={styles.actionText}>Justificar Ausência</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Row({ label, value, style }: { label: string; value: string; style?: object }) {
  return (
    <View style={[styles.totRow, style]}>
      <Text style={styles.totLabel}>{label}</Text>
      <Text style={styles.totValue}>{value}</Text>
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

  dateTitle: { ...typography.title, fontSize: 22, color: colors.textPrimary },
  tag: { alignSelf: 'flex-start', marginTop: spacing.sm, backgroundColor: colors.successBg, borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12 },
  tagText: { ...typography.caption, fontSize: 12, fontWeight: '700', color: colors.successText },

  marcCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
  },
  marcRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 13 },
  marcDivider: { borderTopWidth: 1, borderTopColor: colors.divider },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary, marginTop: 5 },
  marcBody: { flex: 1 },
  marcLabel: { fontSize: 14.5, fontWeight: '600', color: '#374151', fontFamily: typography.bodyMedium.fontFamily },
  localRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  local: { ...typography.caption, fontSize: 12, color: colors.textMuted },
  hora: { ...typography.bodySemibold, fontSize: 15, color: colors.textPrimary },
  horaMissing: { ...typography.bodySemibold, fontSize: 15, color: colors.danger },

  totais: { marginTop: spacing.lg, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.xl, padding: spacing.lg },
  totRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowGap: { marginTop: 10 },
  totLabel: { ...typography.body, fontSize: 14, color: colors.textSecondary },
  totValue: { ...typography.bodySemibold, fontSize: 15, color: colors.textPrimary },
  hr: { height: 1, backgroundColor: colors.borderLight, marginVertical: 12 },
  saldoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  saldoLabel: { ...typography.bodySemibold, fontSize: 14, color: colors.textPrimary },
  saldoValue: { fontFamily: typography.title.fontFamily, fontSize: 18 },

  actions: { flexDirection: 'row', gap: 10, marginTop: spacing.lg },
  actionBtn: { flex: 1, height: 50, backgroundColor: '#EEF2FF', borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  actionText: { ...typography.bodySemibold, fontSize: 14, color: colors.primary },
});
