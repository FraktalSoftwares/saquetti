import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, layout } from '../theme';
import { dataBR, DIAS_SEMANA_MIN, mesLongo } from '../utils/datetime';

function mesmaData(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

/** Campo de data com calendário em modal (funciona em web e nativo). */
export function DatePicker({
  value,
  onChange,
}: {
  value: Date;
  onChange: (d: Date) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const [view, setView] = useState(new Date(value.getFullYear(), value.getMonth(), 1));

  const abrir = () => {
    setView(new Date(value.getFullYear(), value.getMonth(), 1));
    setAberto(true);
  };

  const ano = view.getFullYear();
  const mes = view.getMonth();
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const hoje = new Date();

  const celulas: (number | null)[] = [
    ...Array.from({ length: primeiroDiaSemana }, () => null),
    ...Array.from({ length: diasNoMes }, (_, i) => i + 1),
  ];

  const irMes = (delta: number) => setView(new Date(ano, mes + delta, 1));

  return (
    <>
      <Pressable style={styles.field} onPress={abrir} accessibilityRole="button">
        <Text style={styles.value}>{dataBR(value)}</Text>
        <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
      </Pressable>

      <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => setAberto(false)}>
        <Pressable style={styles.backdrop} onPress={() => setAberto(false)}>
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation?.()}>
            <View style={styles.navRow}>
              <Pressable style={styles.navBtn} onPress={() => irMes(-1)} accessibilityLabel="Mês anterior">
                <Ionicons name="chevron-back" size={20} color="#374151" />
              </Pressable>
              <Text style={styles.mesLabel}>
                {mesLongo(mes)} {ano}
              </Text>
              <Pressable style={styles.navBtn} onPress={() => irMes(1)} accessibilityLabel="Próximo mês">
                <Ionicons name="chevron-forward" size={20} color="#374151" />
              </Pressable>
            </View>

            <View style={styles.weekRow}>
              {DIAS_SEMANA_MIN.map((d, i) => (
                <Text key={i} style={styles.weekDay}>
                  {d}
                </Text>
              ))}
            </View>

            <View style={styles.grid}>
              {celulas.map((dia, i) => {
                if (dia === null) return <View key={i} style={styles.cell} />;
                const d = new Date(ano, mes, dia);
                const selecionado = mesmaData(d, value);
                const ehHoje = mesmaData(d, hoje);
                return (
                  <Pressable
                    key={i}
                    style={styles.cell}
                    onPress={() => {
                      onChange(d);
                      setAberto(false);
                    }}
                  >
                    <View style={[styles.dayWrap, selecionado && styles.daySelected, ehHoje && !selecionado && styles.dayToday]}>
                      <Text style={[styles.dayText, selecionado && styles.dayTextSelected]}>{dia}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const CELL = 40;

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.inputHeight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
  },
  value: { flex: 1, ...typography.input, fontSize: 15, color: '#374151' },

  backdrop: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  card: { width: CELL * 7 + 24, backgroundColor: colors.surface, borderRadius: radius.xl, padding: 12 },

  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
  mesLabel: { ...typography.bodySemibold, fontSize: 16, color: colors.textPrimary },

  weekRow: { flexDirection: 'row' },
  weekDay: { width: CELL, textAlign: 'center', ...typography.caption, fontSize: 11, fontWeight: '600', color: colors.textMuted },

  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  cell: { width: CELL, height: CELL, alignItems: 'center', justifyContent: 'center' },
  dayWrap: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  daySelected: { backgroundColor: colors.primary },
  dayToday: { borderWidth: 1, borderColor: colors.primary },
  dayText: { ...typography.body, fontSize: 15, color: colors.textPrimary },
  dayTextSelected: { color: colors.white, fontFamily: typography.bodySemibold.fontFamily },
});
