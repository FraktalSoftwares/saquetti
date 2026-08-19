import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRealtime } from '../../hooks/useRealtime';
import { Avatar } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { getResumoHome } from '../../services/homeService';
import { getAlertas } from '../../services/alertsService';
import type { Alerta, RegistroDia, ResumoHome } from '../../types';
import type { HomeStackScreenProps } from '../../navigation/types';

const QUICK_ACTIONS: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'pontos', label: 'Pontos', icon: 'finger-print-outline' },
  { key: 'cartao', label: 'Cartão Ponto', icon: 'calendar-outline' },
  { key: 'pendencias', label: 'Pendências', icon: 'notifications-outline' },
  { key: 'banco', label: 'Banco', icon: 'hourglass-outline' },
];

export function HomeScreen({ navigation }: HomeStackScreenProps<'HomeMain'>) {
  const insets = useSafeAreaInsets();
  const { colaborador } = useAuth();
  const [resumo, setResumo] = useState<ResumoHome | null>(null);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const ativoRef = useRef(true);

  const carregar = useCallback(async () => {
    const nome = colaborador?.nomeCompleto ?? 'Colaborador';
    const [r, a] = await Promise.all([getResumoHome(nome), getAlertas()]);
    if (!ativoRef.current) return;
    setResumo(r);
    setAlertas(a);
    setLoading(false);
  }, [colaborador?.nomeCompleto]);

  useFocusEffect(
    useCallback(() => {
      ativoRef.current = true;
      carregar();
      return () => {
        ativoRef.current = false;
      };
    }, [carregar]),
  );

  // Atualiza ao vivo quando chegam novas marcações ou notificações (Realtime).
  useRealtime('marcacoes', carregar);
  useRealtime('notificacoes', carregar);

  const primeiroNome = (colaborador?.nomeCompleto ?? 'Colaborador').split(' ')[0];
  const alertaDestaque = alertas.find((a) => !a.lido) ?? alertas[0];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header escuro */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Avatar size={44} radius={22} />
        <View style={styles.headerCenter}>
          <Text style={styles.greeting}>Olá, {primeiroNome}</Text>
          <Text style={styles.greetingDate}>{resumo?.dataExtenso ?? ''}</Text>
        </View>
        <Pressable
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Notificações"
          onPress={() => navigation.navigate('Notificacoes')}
        >
          <Ionicons name="notifications-outline" size={26} color={colors.white} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: spacing.xxl }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Atalhos rapidos */}
          <View style={styles.quickRow}>
            {QUICK_ACTIONS.map((qa) => (
              <Pressable
                key={qa.key}
                style={styles.quickItem}
                accessibilityRole="button"
                onPress={() => {
                  if (qa.key === 'pontos') navigation.navigate('RegistrarPonto');
                  else if (qa.key === 'pendencias') navigation.navigate('Alertas');
                  else if (qa.key === 'cartao')
                    navigation.navigate('Tabs', { screen: 'CartaoPonto', params: { aba: 'cartao' } });
                  else if (qa.key === 'banco')
                    navigation.navigate('Tabs', { screen: 'CartaoPonto', params: { aba: 'banco' } });
                }}
              >
                <View style={styles.quickTile}>
                  <Ionicons name={qa.icon} size={26} color={colors.primary} />
                </View>
                <Text style={styles.quickLabel}>{qa.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Alertas de pendencias */}
          <View style={styles.sectionHeader}>
            <Text style={styles.overline}>ALERTAS DE PENDÊNCIAS</Text>
            <Pressable onPress={() => navigation.navigate('Alertas')} hitSlop={8}>
              <Text style={styles.link}>Ver todos</Text>
            </Pressable>
          </View>

          {alertaDestaque && (
            <Pressable
              style={styles.alertBanner}
              onPress={() => navigation.navigate('Alertas')}
              accessibilityRole="button"
            >
              <Ionicons name="warning-outline" size={22} color={colors.warning} />
              <Text style={styles.alertText} numberOfLines={2}>
                {alertaDestaque.titulo}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.warning} />
            </Pressable>
          )}

          {/* Jornada de hoje */}
          {resumo && <JornadaCard resumo={resumo} />}

          {/* Registrar ponto (RF-005) */}
          <Pressable
            style={({ pressed }) => [styles.registrar, pressed && styles.registrarPressed]}
            accessibilityRole="button"
            onPress={() => navigation.navigate('RegistrarPonto')}
          >
            <Ionicons name="time-outline" size={22} color={colors.white} />
            <Text style={styles.registrarText}>Registrar Ponto</Text>
          </Pressable>

          {/* Registro de ponto */}
          <View style={styles.sectionHeader}>
            <Text style={styles.registroTitle}>Registro de ponto</Text>
            <Pressable style={styles.filtrar} hitSlop={8} accessibilityRole="button">
              <Ionicons name="options-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.filtrarText}>Filtrar</Text>
            </Pressable>
          </View>

          {resumo?.registros.map((dia) => (
            <DiaCard key={dia.id} dia={dia} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function JornadaCard({ resumo }: { resumo: ResumoHome }) {
  const { jornada } = resumo;
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.cardTitle}>Jornada de hoje</Text>
        <Text style={styles.cardJanela}>{jornada.janela}</Text>
      </View>
      <View style={[styles.cardRow, { marginTop: spacing.lg }]}>
        <View>
          <Text style={styles.metaLabel}>ÚLTIMO PONTO</Text>
          <Text style={styles.metaValue}>{jornada.ultimoPonto ?? '--:--'}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.metaLabel}>PRÓXIMO</Text>
          <Text style={[styles.metaValue, styles.metaMuted]}>{jornada.proximoPonto ?? '--:--'}</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(jornada.progresso * 100)}%` }]} />
        <View style={[styles.progressThumb, { left: `${Math.round(jornada.progresso * 100)}%` }]} />
      </View>
    </View>
  );
}

function DiaCard({ dia }: { dia: RegistroDia }) {
  const [aberto, setAberto] = useState(false);
  return (
    <View style={styles.diaCard}>
      <Pressable
        style={styles.diaHeader}
        onPress={() => setAberto((v) => !v)}
        accessibilityRole="button"
        accessibilityState={{ expanded: aberto }}
      >
        <View style={styles.flex1}>
          <Text style={styles.diaTitulo}>{dia.rotulo}</Text>
          <Text style={styles.diaResumo}>
            {dia.totalMarcacoes} marcações · trabalhado{' '}
            <Text style={styles.diaTrabalhado}>{dia.trabalhado}</Text>
          </Text>
          <Text style={styles.diaHoras}>
            {dia.marcacoes.map((m) => m.hora).join('   ·   ')}
          </Text>
        </View>
        <Ionicons
          name={aberto ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>

      {aberto && (
        <View style={styles.diaDetalhe}>
          {dia.marcacoes.map((m, i) => (
            <View
              key={m.ordem}
              style={[styles.marcacaoRow, i > 0 && styles.marcacaoDivider]}
            >
              <View style={styles.marcacaoDot} />
              <View style={styles.flex1}>
                <Text style={styles.marcacaoTitulo}>{m.ordem}ª marcação</Text>
                <Text style={styles.marcacaoUnidade}>{m.unidade}</Text>
              </View>
              <Text style={styles.marcacaoHora}>{m.hora}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex1: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: colors.headerDark,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  headerCenter: { flex: 1 },
  greeting: { ...typography.h2, color: colors.white },
  greetingDate: { ...typography.body, color: colors.textOnDarkMuted, marginTop: 2 },

  content: { padding: spacing.lg },

  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xxl },
  quickItem: { alignItems: 'center', width: '23%' },
  quickTile: {
    width: 68,
    height: 68,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickLabel: { ...typography.caption, color: colors.textPrimary, marginTop: spacing.sm },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  overline: { ...typography.overline, color: colors.textSecondary },
  link: { ...typography.bodySemibold, color: colors.link, textDecorationLine: 'underline' },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.warningBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.warningBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  alertText: { ...typography.bodySemibold, color: colors.warningText, flex: 1 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { ...typography.h2, color: colors.textPrimary },
  cardJanela: { ...typography.subtitle, color: colors.textSecondary },
  metaLabel: { ...typography.overline, color: colors.textMuted },
  metaValue: { fontFamily: typography.title.fontFamily, fontSize: 28, color: colors.textPrimary, marginTop: 2 },
  metaMuted: { color: colors.textMuted },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.progressTrack,
    marginTop: spacing.lg,
    justifyContent: 'center',
  },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: colors.progressFill },
  progressThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    marginLeft: -9,
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: colors.progressFill,
  },

  registrar: {
    height: 60,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  registrarPressed: { backgroundColor: colors.primaryPressed },
  registrarText: { ...typography.button, fontSize: 18, color: colors.white },

  registroTitle: { ...typography.h2, color: colors.textPrimary },
  filtrar: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  filtrarText: { ...typography.bodyMedium, color: colors.textSecondary },

  diaCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  diaHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  diaTitulo: { ...typography.bodySemibold, fontSize: 16, color: colors.textPrimary },
  diaResumo: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  diaTrabalhado: { color: colors.success, fontFamily: typography.bodySemibold.fontFamily },
  diaHoras: { ...typography.bodySemibold, fontSize: 15, color: colors.textPrimary, marginTop: spacing.sm },

  diaDetalhe: { marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: spacing.sm },
  marcacaoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  marcacaoDivider: { borderTopWidth: 1, borderTopColor: colors.borderLight },
  marcacaoDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  marcacaoTitulo: { ...typography.bodySemibold, fontSize: 15, color: colors.textPrimary },
  marcacaoUnidade: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  marcacaoHora: { fontFamily: typography.bodySemibold.fontFamily, fontSize: 18, color: colors.textPrimary },
});
