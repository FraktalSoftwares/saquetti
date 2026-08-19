import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackButton, Button } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { getNotificacao } from '../../services/notificacoesService';
import type { Notificacao } from '../../types';
import type { AppStackScreenProps } from '../../navigation/types';

const ICONE = {
  warning: { name: 'warning-outline' as const, cor: colors.warning, bg: colors.warningBg },
  success: { name: 'checkmark-circle-outline' as const, cor: colors.success, bg: colors.successBg },
  info: { name: 'information-circle-outline' as const, cor: colors.primary, bg: colors.iconTileBg },
};

/** Tela 9.2 Detalhe da notificação. */
export function NotificacaoDetalheScreen({ navigation, route }: AppStackScreenProps<'NotificacaoDetalhe'>) {
  const insets = useSafeAreaInsets();
  const [notif, setNotif] = useState<Notificacao | null>(null);

  useFocusEffect(
    useCallback(() => {
      setNotif(getNotificacao(route.params.id) ?? null);
    }, [route.params.id]),
  );

  const ic = notif ? ICONE[notif.tipo] : ICONE.info;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Notificação</Text>
      </View>

      {notif && (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.iconTile, { backgroundColor: ic.bg }]}>
            <Ionicons name={ic.name} size={24} color={ic.cor} />
          </View>
          <Text style={styles.titulo}>{notif.titulo}</Text>
          <Text style={styles.data}>{notif.data}</Text>
          <Text style={styles.corpo}>{notif.corpo}</Text>

          {notif.acaoCartao && (
            <Button
              title="Ir para o cartão ponto"
              icon="arrow-forward"
              onPress={() => navigation.navigate('Tabs', { screen: 'CartaoPonto', params: { aba: 'assinatura' } })}
              style={styles.acao}
            />
          )}
        </ScrollView>
      )}
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

  iconTile: { width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  titulo: { ...typography.title, fontSize: 21, color: colors.textPrimary, marginTop: 16 },
  data: { ...typography.caption, fontSize: 13, color: colors.textMuted, marginTop: 6 },
  corpo: { ...typography.subtitle, fontSize: 15, color: '#374151', lineHeight: 24, marginTop: 18 },
  acao: { marginTop: spacing.xxl },
});
