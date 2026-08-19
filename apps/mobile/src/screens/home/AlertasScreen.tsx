import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRealtime } from '../../hooks/useRealtime';
import { BackButton } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { getAlertas } from '../../services/alertsService';
import type { Alerta } from '../../types';
import type { HomeStackScreenProps } from '../../navigation/types';

/** Tela 2.2 Alertas de Pendencias (RF-006). */
export function AlertasScreen({ navigation }: HomeStackScreenProps<'Alertas'>) {
  const insets = useSafeAreaInsets();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const ativoRef = useRef(true);

  const carregar = useCallback(async () => {
    const a = await getAlertas();
    if (!ativoRef.current) return;
    setAlertas(a);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      ativoRef.current = true;
      carregar();
      return () => {
        ativoRef.current = false;
      };
    }, [carregar]),
  );

  useRealtime('notificacoes', carregar);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>ALERTAS DE PENDÊNCIAS</Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {alertas.map((a) => (
            <AlertaCard key={a.id} alerta={a} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function AlertaCard({ alerta }: { alerta: Alerta }) {
  const isSuccess = alerta.tipo === 'success';
  return (
    <View style={[styles.card, !alerta.lido && !isSuccess && styles.cardUnread]}>
      <View style={[styles.iconCircle, isSuccess ? styles.iconSuccess : styles.iconWarning]}>
        <Ionicons
          name={isSuccess ? 'checkmark' : 'alert'}
          size={18}
          color={colors.white}
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{alerta.titulo}</Text>
        <Text style={styles.cardDesc}>{alerta.descricao}</Text>
      </View>
      <View style={styles.cardMeta}>
        <Text style={styles.cardTempo}>{alerta.tempo}</Text>
        <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Mais opções">
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: { ...typography.h2, color: colors.textPrimary },
  content: { padding: spacing.lg, gap: spacing.md },

  card: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  cardUnread: { backgroundColor: colors.warningBg, borderBottomWidth: 0 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  iconWarning: { backgroundColor: colors.warning },
  iconSuccess: { backgroundColor: colors.success },
  cardBody: { flex: 1 },
  cardTitle: { ...typography.bodySemibold, fontSize: 16, color: colors.textPrimary },
  cardDesc: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  cardMeta: { alignItems: 'flex-end', gap: spacing.sm },
  cardTempo: { ...typography.caption, color: colors.textMuted },
});
