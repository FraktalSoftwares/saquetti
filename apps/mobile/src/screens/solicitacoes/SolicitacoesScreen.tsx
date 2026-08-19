import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackButton, StatusBadge } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { badgeToneStatus, getSolicitacoes } from '../../services/solicitacoesService';
import type { Solicitacao } from '../../types';
import type { AppStackScreenProps } from '../../navigation/types';

/** Tela 5 Solicitações (lista). */
export function SolicitacoesScreen({ navigation }: AppStackScreenProps<'Solicitacoes'>) {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<Solicitacao[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getSolicitacoes().then((s) => active && setItems(s));
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Solicitações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <Text style={styles.empty}>Você ainda não tem solicitações.</Text>
        ) : (
          items.map((s) => (
            <Pressable
              key={s.id}
              style={styles.card}
              onPress={() => navigation.navigate('SolicitacaoDetalhe', { id: s.id })}
            >
              <View style={styles.cardTop}>
                <Text style={styles.tipo}>{s.tipo}</Text>
                <StatusBadge text={s.status} tone={badgeToneStatus(s.status)} />
              </View>
              <Text style={styles.data}>Data do ajuste: {s.dataResumo}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>

      <Pressable
        style={[styles.fab, { bottom: insets.bottom + spacing.xl }]}
        onPress={() => navigation.navigate('NovaSolicitacao')}
        accessibilityRole="button"
        accessibilityLabel="Nova solicitação"
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>
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
  content: { padding: spacing.lg, gap: 10 },
  empty: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xxxl },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: 15,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tipo: { flex: 1, ...typography.bodySemibold, fontSize: 15, color: colors.textPrimary },
  data: { ...typography.body, fontSize: 13, color: colors.textSecondary, marginTop: 6 },

  fab: {
    position: 'absolute',
    right: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
});
