import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { DiaCard, Segmented, StatusBadge } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { getBanco, getEspelho, getMesesCartao } from '../../services/espelhoService';
import type { BancoResumo, EspelhoResumo, MesCartao } from '../../types';
import type { AbaCartao, AppTabScreenProps } from '../../navigation/types';

type Aba = AbaCartao;

const TITULOS: Record<Aba, string> = {
  cartao: 'Cartão Ponto',
  banco: 'Banco de Horas',
  assinatura: 'Assinatura Eletrônica',
};

export function CartaoPontoScreen({
  navigation,
  route,
}: AppTabScreenProps<'CartaoPonto' | 'Horarios'>) {
  const insets = useSafeAreaInsets();
  const [aba, setAba] = useState<Aba>(route.params?.aba ?? 'cartao');

  // Permite abrir uma sub-aba específica ao navegar (ex.: vindo do detalhamento do cartão).
  const abaParam = route.params?.aba;
  useEffect(() => {
    if (abaParam) setAba(abaParam);
  }, [abaParam]);
  const [espelho, setEspelho] = useState<EspelhoResumo | null>(null);
  const [banco, setBanco] = useState<BancoResumo | null>(null);
  const [meses, setMeses] = useState<MesCartao[]>([]);
  const [loading, setLoading] = useState(true);

  // Competência exibida no espelho (mês navegável pelas setas) e ordenação da lista.
  const [comp, setComp] = useState(() => {
    const h = new Date();
    return { ano: h.getFullYear(), mes: h.getMonth() };
  });
  const [ordem, setOrdem] = useState<'recentes' | 'antigos'>('recentes');

  const agora = new Date();
  const ehMesAtual = comp.ano === agora.getFullYear() && comp.mes === agora.getMonth();
  const mudarMes = (delta: number) =>
    setComp((c) => {
      const d = new Date(c.ano, c.mes + delta, 1);
      return { ano: d.getFullYear(), mes: d.getMonth() };
    });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [e, b, m] = await Promise.all([
          getEspelho(comp.ano, comp.mes),
          getBanco(),
          getMesesCartao(),
        ]);
        if (!active) return;
        setEspelho(e);
        setBanco(b);
        setMeses(m);
        setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [comp]),
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.headerTitle}>{TITULOS[aba]}</Text>
      </View>

      <View style={styles.segmentedWrap}>
        <Segmented<Aba>
          value={aba}
          onChange={setAba}
          options={[
            { value: 'cartao', label: 'Cartão Ponto' },
            { value: 'banco', label: 'Banco' },
            { value: 'assinatura', label: 'Assinatura' },
          ]}
        />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {aba === 'cartao' && espelho && (
            <EspelhoTab
              espelho={espelho}
              ordem={ordem}
              onToggleOrdem={() => setOrdem((o) => (o === 'recentes' ? 'antigos' : 'recentes'))}
              onPrevMes={() => mudarMes(-1)}
              onNextMes={() => mudarMes(1)}
              podeAvancar={!ehMesAtual}
              onVerDetalhes={(diaId) => navigation.navigate('DetalhesDia', { diaId })}
              onSolicitar={(diaId) => navigation.navigate('NovaSolicitacao', { diaId })}
              onJustificar={(diaId) => navigation.navigate('JustificarAusencia', { diaId })}
            />
          )}
          {aba === 'banco' && banco && <BancoTab banco={banco} />}
          {aba === 'assinatura' && (
            <AssinaturaTab
              meses={meses}
              onSelect={(mesId) => navigation.navigate('CartaoDetalhe', { mesId })}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}

function EspelhoTab({
  espelho,
  ordem,
  onToggleOrdem,
  onPrevMes,
  onNextMes,
  podeAvancar,
  onVerDetalhes,
  onSolicitar,
  onJustificar,
}: {
  espelho: EspelhoResumo;
  ordem: 'recentes' | 'antigos';
  onToggleOrdem: () => void;
  onPrevMes: () => void;
  onNextMes: () => void;
  podeAvancar: boolean;
  onVerDetalhes: (diaId: string) => void;
  onSolicitar: (diaId: string) => void;
  onJustificar: (diaId: string) => void;
}) {
  const dias = ordem === 'recentes' ? espelho.dias : [...espelho.dias].reverse();
  return (
    <>
      <View style={styles.monthNav}>
        <Pressable style={styles.navBtn} onPress={onPrevMes} accessibilityLabel="Mês anterior" hitSlop={6}>
          <Ionicons name="chevron-back" size={18} color="#374151" />
        </Pressable>
        <View style={styles.monthCenter}>
          <Text style={styles.monthLabel}>{espelho.mesLabel}</Text>
          <Text style={styles.monthPeriod}>{espelho.periodo}</Text>
        </View>
        <Pressable
          style={[styles.navBtn, !podeAvancar && styles.navBtnDisabled]}
          onPress={podeAvancar ? onNextMes : undefined}
          disabled={!podeAvancar}
          accessibilityLabel="Próximo mês"
          hitSlop={6}
        >
          <Ionicons name="chevron-forward" size={18} color={podeAvancar ? '#374151' : colors.textMuted} />
        </Pressable>
      </View>

      <ResumoCard
        trabalhadas={espelho.trabalhadas}
        esperadas={espelho.esperadas}
        saldo={espelho.saldoBanco}
        saldoPositivo={espelho.saldoPositivo}
      />

      <View style={styles.listHead}>
        <Text style={styles.listTitle}>Dias do mês</Text>
        <Pressable style={styles.sortBtn} onPress={onToggleOrdem} hitSlop={6}>
          <Ionicons name={ordem === 'recentes' ? 'chevron-down' : 'chevron-up'} size={15} color={colors.textSecondary} />
          <Text style={styles.sortText}>{ordem === 'recentes' ? 'Recentes' : 'Antigos'}</Text>
        </Pressable>
      </View>

      {dias.length === 0 && (
        <View style={styles.vazio}>
          <Ionicons name="calendar-outline" size={26} color={colors.textMuted} />
          <Text style={styles.vazioText}>Sem registros neste mês.</Text>
        </View>
      )}

      <View style={styles.dayList}>
        {dias.map((d) => (
          <DiaCard
            key={d.id}
            dia={d}
            showActions
            onVerDetalhes={() => onVerDetalhes(d.id)}
            onSolicitar={() => onSolicitar(d.id)}
            onJustificar={() => onJustificar(d.id)}
          />
        ))}
      </View>
    </>
  );
}

function BancoTab({ banco }: { banco: BancoResumo }) {
  return (
    <>
      <View style={styles.bancoCard}>
        <Text style={styles.bancoLabel}>Saldo atual do banco de horas</Text>
        <Text style={[styles.bancoSaldo, { color: banco.saldoPositivo ? colors.successBright : colors.danger }]}>
          {banco.saldo}
        </Text>
        <Text style={styles.bancoMeta}>{banco.atualizado}</Text>
        <View style={styles.bancoStats}>
          <View style={styles.bancoStat}>
            <Text style={styles.bancoStatLabel}>Créditos no mês</Text>
            <Text style={[styles.bancoStatValue, { color: colors.successBright }]}>{banco.creditosMes}</Text>
          </View>
          <View style={styles.bancoStat}>
            <Text style={styles.bancoStatLabel}>Débitos no mês</Text>
            <Text style={[styles.bancoStatValue, { color: colors.danger }]}>{banco.debitosMes}</Text>
          </View>
        </View>
      </View>

      <View style={styles.listHead}>
        <Text style={styles.listTitle}>Movimentações</Text>
        <View style={styles.sortBtn}>
          <Ionicons name="list-outline" size={15} color={colors.textSecondary} />
          <Text style={styles.sortText}>Últimos 30 dias</Text>
        </View>
      </View>

      <View style={styles.dayList}>
        {banco.movimentos.map((m) => {
          const credito = m.tipo === 'credito';
          return (
            <View key={m.id} style={styles.movRow}>
              <View style={[styles.movIcon, { backgroundColor: credito ? colors.successBg : colors.dangerBg }]}>
                <Ionicons
                  name={credito ? 'trending-up' : 'trending-down'}
                  size={20}
                  color={credito ? colors.success : '#DC2626'}
                />
              </View>
              <View style={styles.movBody}>
                <Text style={styles.movTitle}>{m.titulo}</Text>
                <Text style={styles.movMeta}>{m.meta}</Text>
              </View>
              <Text style={[styles.movValue, { color: credito ? colors.success : colors.danger }]}>
                {m.valor}
              </Text>
            </View>
          );
        })}
      </View>
    </>
  );
}

function AssinaturaTab({ meses, onSelect }: { meses: MesCartao[]; onSelect: (id: string) => void }) {
  return (
    <View style={styles.dayList}>
      {meses.map((mo) => (
        <Pressable key={mo.id} style={styles.mesCard} onPress={() => onSelect(mo.id)}>
          <View style={styles.mesTop}>
            <View style={styles.flex1}>
              <Text style={styles.mesNome}>{mo.mes}</Text>
              <Text style={styles.mesPeriodo}>{mo.periodo}</Text>
            </View>
            <StatusBadge
              text={mo.status === 'pendente' ? 'Pendente' : 'Assinado'}
              tone={mo.status === 'pendente' ? 'pendente' : 'ok'}
            />
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
          <View style={styles.mesStats}>
            <View>
              <Text style={styles.mesStatLabel}>Trabalhadas</Text>
              <Text style={styles.mesStatValue}>{mo.trabalhadas}</Text>
            </View>
            <View>
              <Text style={styles.mesStatLabel}>Saldo banco</Text>
              <Text style={[styles.mesStatValue, { color: mo.saldoPositivo ? colors.success : colors.danger }]}>
                {mo.saldo}
              </Text>
            </View>
          </View>
          {mo.alerta && (
            <View style={styles.mesAlerta}>
              <Ionicons name="warning-outline" size={15} color="#D97706" />
              <Text style={styles.mesAlertaText}>{mo.alerta}</Text>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
}

/** Card escuro de resumo (Trabalhadas / Esperadas / Saldo banco). */
export function ResumoCard({
  trabalhadas,
  esperadas,
  saldo,
  saldoPositivo,
}: {
  trabalhadas: string;
  esperadas: string;
  saldo: string;
  saldoPositivo: boolean;
}) {
  return (
    <View style={styles.resumo}>
      <Stat label="Trabalhadas" value={trabalhadas} />
      <Stat label="Esperadas" value={esperadas} />
      <Stat label="Saldo banco" value={saldo} valueColor={saldoPositivo ? colors.successBright : colors.danger} />
    </View>
  );
}

function Stat({ label, value, valueColor = colors.white }: { label: string; value: string; valueColor?: string }) {
  return (
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  flex1: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: { ...typography.h2, fontSize: 17, color: colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.4 },

  segmentedWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.surface },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },

  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  navBtn: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnDisabled: { opacity: 0.4, backgroundColor: colors.surfaceAlt },
  monthCenter: { alignItems: 'center' },
  monthLabel: { ...typography.bodySemibold, fontSize: 16, color: colors.textPrimary },
  monthPeriod: { ...typography.caption, color: colors.textMuted },

  resumo: {
    backgroundColor: colors.headerDark,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: { ...typography.caption, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 },
  statValue: { ...typography.h2, fontSize: 20, color: colors.white, marginTop: 4 },

  listHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl, marginBottom: spacing.sm },
  listTitle: { ...typography.h2, fontSize: 16, color: colors.textPrimary },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sortText: { ...typography.caption, fontSize: 13, fontWeight: '600', color: colors.textSecondary },

  dayList: { gap: 10 },
  vazio: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl },
  vazioText: { ...typography.body, color: colors.textMuted },

  // Banco
  bancoCard: { backgroundColor: colors.headerDark, borderRadius: radius.xl, padding: spacing.lg },
  bancoLabel: { ...typography.caption, fontSize: 12, color: colors.textMuted },
  bancoSaldo: { fontFamily: typography.title.fontFamily, fontSize: 36, letterSpacing: -1, marginTop: 4 },
  bancoMeta: { ...typography.caption, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  bancoStats: { flexDirection: 'row', gap: 10, marginTop: spacing.lg },
  bancoStat: { flex: 1, backgroundColor: '#0A1322', borderRadius: radius.md, padding: spacing.md },
  bancoStatLabel: { ...typography.caption, fontSize: 11, color: colors.textMuted },
  bancoStatValue: { ...typography.h2, fontSize: 18, marginTop: 3 },

  movRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: 13,
  },
  movIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  movBody: { flex: 1, minWidth: 0 },
  movTitle: { ...typography.bodySemibold, fontSize: 14.5, color: colors.textPrimary },
  movMeta: { ...typography.caption, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  movValue: { ...typography.h2, fontSize: 16 },

  // Assinatura
  mesCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: 15,
  },
  mesTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mesNome: { ...typography.bodySemibold, fontSize: 16, color: colors.textPrimary },
  mesPeriodo: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  mesStats: { flexDirection: 'row', gap: 30, marginTop: 14 },
  mesStatLabel: { ...typography.caption, fontSize: 11, color: colors.textMuted },
  mesStatValue: { ...typography.bodySemibold, fontSize: 15, color: colors.textPrimary, marginTop: 2 },
  mesAlerta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 13,
    backgroundColor: '#FFFBEB',
    borderRadius: radius.sm,
    padding: 8,
  },
  mesAlertaText: { ...typography.caption, fontSize: 12, color: colors.warningText, flex: 1 },
});
