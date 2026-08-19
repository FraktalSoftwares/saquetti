import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackButton, Button, DiaCard, Segmented } from '../../components';
import { ResumoCard } from './CartaoPontoScreen';
import { colors, radius, spacing, typography } from '../../theme';
import { getEspelho, getMesCartao } from '../../services/espelhoService';
import type { DiaEspelho, MesCartao } from '../../types';
import type { AbaCartao, AppStackScreenProps } from '../../navigation/types';

/** Tela 4.3 Cartão – detalhamento do mês (assinatura eletrônica). */
export function CartaoDetalheScreen({ navigation, route }: AppStackScreenProps<'CartaoDetalhe'>) {
  const insets = useSafeAreaInsets();
  const [mes, setMes] = useState<MesCartao | null>(null);
  const [dias, setDias] = useState<DiaEspelho[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [e, m] = await Promise.all([getEspelho(), getMesCartao(route.params.mesId)]);
        if (!active) return;
        setMes(m ?? null);
        setDias(e.dias);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [route.params.mesId]),
  );

  const pendente = mes?.status === 'pendente';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          Assinatura – {mes?.mes ?? ''}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[styles.content, pendente && { paddingBottom: 160 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.segmentedWrap}>
              <Segmented<AbaCartao>
                value="assinatura"
                onChange={(v) => {
                  if (v === 'assinatura') navigation.goBack();
                  else navigation.navigate('Tabs', { screen: 'CartaoPonto', params: { aba: v } });
                }}
                options={[
                  { value: 'cartao', label: 'Cartão Ponto' },
                  { value: 'banco', label: 'Banco' },
                  { value: 'assinatura', label: 'Assinatura' },
                ]}
              />
            </View>

            {mes &&
              (pendente ? (
                <BannerPendente
                  mes={mes}
                  onAssinar={() => navigation.navigate('AssinarCartao', { mesId: mes.id })}
                />
              ) : (
                <BannerAssinado />
              ))}

            {mes && (
              <View style={styles.resumoWrap}>
                <ResumoCard
                  trabalhadas={mes.trabalhadas}
                  esperadas="140h00"
                  saldo={mes.saldo}
                  saldoPositivo={mes.saldoPositivo}
                />
              </View>
            )}

            <Text style={styles.listTitle}>Registros do mês</Text>
            <View style={styles.dayList}>
              {dias.map((d) => (
                <DiaCard key={d.id} dia={d} />
              ))}
            </View>
          </ScrollView>

          {pendente && mes && (
            <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
              <Button
                title="Assinar cartão ponto"
                onPress={() => navigation.navigate('AssinarCartao', { mesId: mes.id })}
              />
              <Button
                title="Visualizar PDF"
                variant="secondary"
                onPress={() => navigation.navigate('VisualizarPdf', { mesId: mes.id })}
                style={styles.pdfBtn}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
}

function BannerPendente({ mes, onAssinar }: { mes: MesCartao; onAssinar: () => void }) {
  return (
    <Pressable style={styles.bannerPend} onPress={onAssinar}>
      <Ionicons name="alert-circle" size={22} color={colors.warning} />
      <View style={styles.flex1}>
        <Text style={styles.bannerPendTitle}>Assinatura pendente</Text>
        <Text style={styles.bannerPendSub}>{mes.alerta ?? 'Conclua a assinatura do mês.'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#EA580C" />
    </Pressable>
  );
}

function BannerAssinado() {
  return (
    <View style={styles.bannerOk}>
      <Ionicons name="checkmark-circle" size={22} color={colors.success} />
      <View style={styles.flex1}>
        <Text style={styles.bannerOkTitle}>Cartão assinado</Text>
        <Text style={styles.bannerOkSub}>Assinado · bloqueado para edições</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  flex1: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: { flex: 1, ...typography.h2, fontSize: 17, color: colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.4 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },

  segmentedWrap: { marginBottom: spacing.md },
  resumoWrap: { marginTop: spacing.md },

  bannerPend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 11,
    padding: 13,
  },
  bannerPendTitle: { ...typography.bodySemibold, fontSize: 14, color: '#9A3412' },
  bannerPendSub: { ...typography.caption, fontSize: 12.5, color: '#B45309', marginTop: 1 },
  bannerOk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 11,
    padding: 13,
  },
  bannerOkTitle: { ...typography.bodySemibold, fontSize: 14, color: colors.successText },
  bannerOkSub: { ...typography.caption, fontSize: 12.5, color: '#15803D', marginTop: 1 },

  listTitle: { ...typography.h2, fontSize: 16, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.sm },
  dayList: { gap: 10 },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: 10,
  },
  pdfBtn: { borderColor: colors.borderLight },
});
