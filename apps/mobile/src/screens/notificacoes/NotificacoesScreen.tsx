import React, { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRealtime } from '../../hooks/useRealtime';
import { BackButton } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { getNotificacoes } from '../../services/notificacoesService';
import type { Notificacao } from '../../types';
import type { AppStackScreenProps } from '../../navigation/types';

/** Tela 9.1 Notificações. */
export function NotificacoesScreen({ navigation }: AppStackScreenProps<'Notificacoes'>) {
  const insets = useSafeAreaInsets();
  const [itens, setItens] = useState<Notificacao[]>([]);
  const ativoRef = useRef(true);

  const carregar = useCallback(async () => {
    const n = await getNotificacoes();
    if (ativoRef.current) setItens(n);
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
        <Text style={styles.headerTitle}>Notificações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {itens.map((n) => (
          <Pressable
            key={n.id}
            style={styles.row}
            onPress={() => navigation.navigate('NotificacaoDetalhe', { id: n.id })}
          >
            <View style={styles.dotCol}>{!n.lida && <View style={styles.dot} />}</View>
            <View style={styles.body}>
              <Text style={styles.titulo}>{n.titulo}</Text>
              <Text style={styles.desc}>{n.descricao}</Text>
            </View>
            <Text style={styles.tempo}>{n.tempo}</Text>
          </Pressable>
        ))}
      </ScrollView>
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
  content: { paddingHorizontal: spacing.lg },

  row: { flexDirection: 'row', gap: 13, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.divider },
  dotCol: { width: 9, alignItems: 'center', paddingTop: 6 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary },
  body: { flex: 1, minWidth: 0 },
  titulo: { ...typography.bodySemibold, fontSize: 14.5, color: colors.textPrimary },
  desc: { ...typography.body, fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginTop: 3 },
  tempo: { ...typography.caption, fontSize: 12, color: colors.textMuted, fontWeight: '500' },
});
