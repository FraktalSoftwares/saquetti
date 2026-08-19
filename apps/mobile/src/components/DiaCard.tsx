import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';
import { StatusBadge } from './StatusBadge';
import type { DiaEspelho } from '../types';

/**
 * Card de dia do espelho (expansível). Usado no Espelho (com ações) e no
 * detalhamento do cartão (sem ações — só as marcações).
 */
export function DiaCard({
  dia,
  showActions = false,
  onVerDetalhes,
  onSolicitar,
  onJustificar,
}: {
  dia: DiaEspelho;
  showActions?: boolean;
  onVerDetalhes?: () => void;
  onSolicitar?: () => void;
  onJustificar?: () => void;
}) {
  const [aberto, setAberto] = useState(false);
  const expansivel = dia.punches.length > 0;

  const line2Color =
    dia.line2Tone === 'ok' ? colors.success : dia.line2Tone === 'falta' ? colors.danger : colors.textSecondary;

  return (
    <View style={styles.card}>
      <Pressable
        style={styles.header}
        onPress={() => expansivel && setAberto((v) => !v)}
        accessibilityRole={expansivel ? 'button' : undefined}
        accessibilityState={expansivel ? { expanded: aberto } : undefined}
      >
        <View style={styles.headerRow}>
          <View style={styles.dayCol}>
            <Text style={styles.dayNum}>{dia.dia}</Text>
            <Text style={styles.dayWd}>{dia.wd}</Text>
          </View>

          <View style={styles.middle}>
            {dia.tipo === 'folga' && <Text style={styles.folga}>Folga</Text>}
            {dia.tipo === 'semRegistro' && (
              <>
                <Text style={styles.semReg}>Sem registro</Text>
                {dia.line2 && <Text style={styles.semRegLine2}>{dia.line2}</Text>}
              </>
            )}
            {dia.tipo === 'normal' && (
              <>
                <Text style={styles.hours}>{dia.hours}</Text>
                {dia.line2 && <Text style={[styles.line2, { color: line2Color }]}>{dia.line2}</Text>}
              </>
            )}
          </View>

          <StatusBadge text={dia.badge.text} tone={dia.badge.tone} />

          <Ionicons
            name={expansivel ? (aberto ? 'chevron-up' : 'chevron-down') : 'chevron-forward'}
            size={18}
            color={colors.textMuted}
          />
        </View>

        {dia.punches.length > 0 && (
          <View style={styles.punches}>
            {dia.punches.map((p, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Text style={styles.sep}>·</Text>}
                {p ? (
                  <Text style={styles.punch}>{p}</Text>
                ) : (
                  <Text style={styles.punchMissing}>X</Text>
                )}
              </React.Fragment>
            ))}
          </View>
        )}
      </Pressable>

      {aberto && (
        <View style={styles.expanded}>
          {dia.marcacoes.map((m, i) => {
            const notLast = i < dia.marcacoes.length - 1;
            return (
              <View key={i} style={styles.marcRow}>
                <View style={styles.dotCol}>
                  {notLast && <View style={styles.line} />}
                  <View style={styles.dot} />
                </View>
                <View style={styles.marcBody}>
                  <Text style={styles.marcLabel}>{m.label}</Text>
                  <View style={styles.localRow}>
                    <Ionicons name="location-outline" size={11} color={colors.textMuted} />
                    <Text style={styles.local}>{m.local}</Text>
                  </View>
                </View>
                {m.hora ? (
                  <Text style={styles.marcHora}>{m.hora}</Text>
                ) : (
                  <Text style={styles.marcMissing}>X</Text>
                )}
              </View>
            );
          })}

          {showActions && (
            <>
              {onVerDetalhes && (
                <Pressable style={styles.verDetalhes} onPress={onVerDetalhes} hitSlop={6}>
                  <Text style={styles.verDetalhesText}>Ver detalhes do dia</Text>
                  <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                </Pressable>
              )}
              <View style={styles.actions}>
                <Pressable style={styles.actionBtn} onPress={onSolicitar}>
                  <Text style={styles.actionText}>Solicitar Ajuste</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={onJustificar}>
                  <Text style={styles.actionText}>Justificar Ausência</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  header: { padding: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  dayCol: { width: 34, alignItems: 'center' },
  dayNum: { fontFamily: typography.title.fontFamily, fontSize: 20, color: colors.textPrimary, lineHeight: 22 },
  dayWd: { ...typography.caption, fontSize: 10, fontWeight: '600', color: colors.textMuted, letterSpacing: 0.5, marginTop: 2 },
  middle: { flex: 1, minWidth: 0 },
  folga: { ...typography.bodySemibold, fontSize: 15, color: '#374151' },
  semReg: { ...typography.bodySemibold, fontSize: 15, color: colors.danger },
  semRegLine2: { ...typography.caption, fontSize: 12, fontWeight: '600', color: colors.danger, marginTop: 2 },
  hours: { ...typography.bodySemibold, fontSize: 15, color: colors.textPrimary },
  line2: { ...typography.caption, fontSize: 12, fontWeight: '600', marginTop: 2 },

  punches: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 9, paddingLeft: 48 },
  sep: { fontSize: 13, color: colors.border, lineHeight: 15 },
  punch: { fontSize: 13, fontWeight: '700', color: '#1F2937', letterSpacing: 0.2 },
  punchMissing: { fontSize: 13, fontWeight: '700', color: colors.danger },

  expanded: { paddingHorizontal: 15, paddingBottom: 16 },
  marcRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 13, paddingVertical: 9 },
  dotCol: { width: 11, alignSelf: 'stretch', position: 'relative' },
  line: { position: 'absolute', top: 13, left: 4.5, width: 2, bottom: -9, backgroundColor: colors.borderLight },
  dot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.primary, marginTop: 2 },
  marcBody: { flex: 1 },
  marcLabel: { fontSize: 13.5, fontWeight: '600', color: '#374151', fontFamily: typography.bodyMedium.fontFamily },
  localRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  local: { ...typography.caption, fontSize: 11, color: colors.textMuted },
  marcHora: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, fontFamily: typography.bodySemibold.fontFamily },
  marcMissing: { fontSize: 14, fontWeight: '700', color: colors.danger },

  verDetalhes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: spacing.sm,
    paddingVertical: 6,
  },
  verDetalhesText: {
    ...typography.bodySemibold,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionBtn: {
    flex: 1,
    height: 46,
    backgroundColor: '#EEF2FF',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { ...typography.bodySemibold, fontSize: 13.5, color: colors.primary },
});
