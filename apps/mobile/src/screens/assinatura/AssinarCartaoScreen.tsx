import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackButton, Button } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { getMesCartao } from '../../services/espelhoService';
import type { MesCartao } from '../../types';
import type { AppStackScreenProps } from '../../navigation/types';

/** Tela 7.1 Assinar cartão (confirmação). */
export function AssinarCartaoScreen({ navigation, route }: AppStackScreenProps<'AssinarCartao'>) {
  const insets = useSafeAreaInsets();
  const { mesId } = route.params;
  const [mes, setMes] = useState<MesCartao | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getMesCartao(mesId).then((m) => active && setMes(m ?? null));
      return () => {
        active = false;
      };
    }, [mesId]),
  );

  const recusar = () =>
    Alert.alert('Recusar assinatura', 'O fluxo de recusa com justificativa estará disponível em breve.');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Assinar cartão</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Revise o resumo do cartão ponto de <Text style={styles.bold}>{mes?.mes ?? ''}</Text> antes de
          assinar.
        </Text>

        <View style={styles.card}>
          <Linha label="Período" value={mes?.periodo ?? '—'} />
          <Linha label="Trabalhadas" value={mes?.trabalhadas ?? '—'} />
          <Linha
            label="Saldo do banco"
            value={mes?.saldo ?? '—'}
            valueColor={mes?.saldoPositivo ? colors.success : colors.danger}
          />
          <Linha label="Inconsistências" value="2" valueColor="#D97706" />
        </View>

        <View style={styles.warn}>
          <Ionicons name="alert-circle-outline" size={18} color="#D97706" style={styles.warnIcon} />
          <Text style={styles.warnText}>
            Após assinar, o cartão ponto fica <Text style={styles.bold}>bloqueado para edições</Text>. Caso
            identifique uma falha, recuse a assinatura informando o motivo.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Button title="Prosseguir" onPress={() => navigation.navigate('CapturaAssinatura', { mesId })} />
        <Pressable style={styles.recusar} onPress={recusar}>
          <Text style={styles.recusarText}>Recusar assinatura</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Linha({
  label,
  value,
  valueColor = colors.textPrimary,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.linha}>
      <Text style={styles.linhaLabel}>{label}</Text>
      <Text style={[styles.linhaValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
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
  intro: { ...typography.body, fontSize: 15, color: '#374151', lineHeight: 22 },
  bold: { fontFamily: typography.bodySemibold.fontFamily, color: colors.textPrimary },

  card: {
    marginTop: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  linha: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 11 },
  linhaLabel: { ...typography.body, fontSize: 14, color: colors.textSecondary },
  linhaValue: { ...typography.bodySemibold, fontSize: 14 },

  warn: {
    flexDirection: 'row',
    gap: 10,
    marginTop: spacing.md,
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 11,
    padding: 13,
  },
  warnIcon: { marginTop: 1 },
  warnText: { flex: 1, ...typography.caption, fontSize: 12.5, color: colors.warningText, lineHeight: 18 },

  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  recusar: {
    height: 50,
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recusarText: { ...typography.bodySemibold, fontSize: 15, color: '#B91C1C' },
});
