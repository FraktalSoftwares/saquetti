import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackButton } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { getEspelho } from '../../services/espelhoService';
import { useAuth } from '../../context/AuthContext';
import type { DiaEspelho } from '../../types';
import type { AppStackScreenProps } from '../../navigation/types';

type PdfRow = { dia: string; e1: string; s1: string; e2: string; s2: string; total: string };

const cel = (v: string | null | undefined) => v ?? '—';

function toRow(d: DiaEspelho): PdfRow {
  const p = d.punches;
  return {
    dia: `${d.dia}/06`,
    e1: cel(p[0]),
    s1: cel(p[1]),
    e2: cel(p[2]),
    s2: cel(p[3]),
    total: d.tipo === 'folga' ? 'Folga' : (d.hours ?? '—'),
  };
}

/** Tela 7.1b Visualizar PDF (espelho de ponto). */
export function VisualizarPdfScreen({ navigation }: AppStackScreenProps<'VisualizarPdf'>) {
  const insets = useSafeAreaInsets();
  const { colaborador } = useAuth();
  const [rows, setRows] = useState<PdfRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getEspelho().then((e) => {
        if (active) setRows(e.dias.map(toRow));
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const baixar = () => Alert.alert('Download', 'O download do PDF estará disponível em breve.');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Visualizar PDF</Text>
        <Pressable onPress={baixar} hitSlop={8} accessibilityLabel="Baixar PDF">
          <Ionicons name="download-outline" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.paper}>
          <View style={styles.paperHead}>
            <View style={styles.flex1}>
              <Text style={styles.docTitle}>Espelho de Ponto</Text>
              <Text style={styles.docSub}>Competência: Junho / 2026</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.empresa}>Saquetti</Text>
              <Text style={styles.cnpj}>CNPJ 12.345.678/0001-90</Text>
            </View>
          </View>

          <View style={styles.info}>
            <Info label="Colaborador" value={colaborador?.nomeCompleto ?? '—'} />
            <Info label="Matrícula" value="004821" />
            <Info label="Cargo" value="Analista Pleno" />
          </View>

          <View style={styles.table}>
            <View style={[styles.tr, styles.trHead]}>
              <Text style={[styles.th, styles.colDia]}>Dia</Text>
              <Text style={[styles.th, styles.colTime]}>Ent.</Text>
              <Text style={[styles.th, styles.colTime]}>Saída</Text>
              <Text style={[styles.th, styles.colTime]}>Ent.</Text>
              <Text style={[styles.th, styles.colTime]}>Saída</Text>
              <Text style={[styles.th, styles.colTotal]}>Total</Text>
            </View>
            {rows.map((r, i) => (
              <View key={i} style={styles.tr}>
                <Text style={[styles.td, styles.colDia]}>{r.dia}</Text>
                <Text style={[styles.td, styles.colTime]}>{r.e1}</Text>
                <Text style={[styles.td, styles.colTime]}>{r.s1}</Text>
                <Text style={[styles.td, styles.colTime]}>{r.e2}</Text>
                <Text style={[styles.td, styles.colTime]}>{r.s2}</Text>
                <Text style={[styles.td, styles.colTotal, styles.tdBold]}>{r.total}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total trabalhado</Text>
            <Text style={styles.totalValue}>146h30</Text>
          </View>

          <View style={styles.sign}>
            <View style={styles.signLine} />
            <Text style={styles.signLabel}>Assinatura do colaborador</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#525659' },
  flex1: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: { flex: 1, ...typography.h2, fontSize: 17, color: colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.4 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },

  paper: {
    backgroundColor: colors.white,
    borderRadius: 4,
    paddingVertical: 26,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  paperHead: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: colors.textPrimary, paddingBottom: 14 },
  docTitle: { fontFamily: typography.title.fontFamily, fontSize: 15, color: colors.textPrimary },
  docSub: { ...typography.caption, fontSize: 10.5, color: colors.textSecondary, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  empresa: { ...typography.caption, fontSize: 11, fontWeight: '700', color: colors.textPrimary },
  cnpj: { ...typography.caption, fontSize: 9, color: colors.textMuted, marginTop: 2 },

  info: { flexDirection: 'row', flexWrap: 'wrap', gap: 26, marginTop: 14 },
  infoItem: {},
  infoLabel: { ...typography.caption, fontSize: 8.5, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 },
  infoValue: { ...typography.caption, fontSize: 11, fontWeight: '600', color: colors.textPrimary },

  table: { marginTop: 16 },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.divider },
  trHead: { backgroundColor: colors.background },
  th: { ...typography.caption, fontSize: 9.5, fontWeight: '700', color: '#374151', paddingVertical: 6, paddingHorizontal: 3 },
  td: { ...typography.caption, fontSize: 9.5, color: '#374151', paddingVertical: 5, paddingHorizontal: 3 },
  tdBold: { fontWeight: '600', color: colors.textPrimary },
  colDia: { flex: 1.4, textAlign: 'left', paddingLeft: 5 },
  colTime: { flex: 1, textAlign: 'center' },
  colTotal: { flex: 1.2, textAlign: 'right', paddingRight: 5 },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 2, borderTopColor: colors.textPrimary },
  totalLabel: { ...typography.caption, fontSize: 11, fontWeight: '700', color: colors.textPrimary },
  totalValue: { ...typography.caption, fontSize: 11, fontWeight: '800', color: colors.textPrimary },

  sign: { marginTop: 34, alignItems: 'center' },
  signLine: { width: 170, borderBottomWidth: 1, borderBottomColor: colors.textPrimary },
  signLabel: { ...typography.caption, fontSize: 9, color: colors.textSecondary, marginTop: 4 },
});
