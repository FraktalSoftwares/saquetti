import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton, Button, DatePicker, FormField, Select } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { getDia } from '../../services/espelhoService';
import { addSolicitacao } from '../../services/solicitacoesService';
import { maskHora } from '../../utils/datetime';
import type { AppStackScreenProps } from '../../navigation/types';

const MOTIVOS = [
  'Esquecimento de marcação',
  'Problema no equipamento',
  'Trabalho externo',
  'Período específico',
  'Outro motivo',
];

const LABELS = ['1ª marcação', '2ª marcação', '3ª marcação', '4ª marcação'];

/** Tela 5.1 Nova solicitação (ajuste de ponto). */
export function NovaSolicitacaoScreen({ navigation, route }: AppStackScreenProps<'NovaSolicitacao'>) {
  const insets = useSafeAreaInsets();
  const dia = route.params?.diaId ? getDia(route.params.diaId) : undefined;

  const [data, setData] = useState<Date>(() =>
    dia?.dataISO ? new Date(`${dia.dataISO}T12:00:00`) : new Date(),
  );
  const [marcacoes, setMarcacoes] = useState<string[]>(() =>
    dia ? dia.punches.map((p) => p ?? '') : ['', '', '', ''],
  );
  const [motivo, setMotivo] = useState<string | null>(null);
  const [obs, setObs] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const setMarc = (i: number, v: string) =>
    setMarcacoes((prev) => prev.map((m, idx) => (idx === i ? maskHora(v) : m)));

  const [enviando, setEnviando] = useState(false);

  const enviar = async () => {
    if (enviando) return;
    setErro(null);
    const horario = marcacoes.find((m) => m.length === 5);
    if (!horario) return setErro('Informe ao menos uma marcação (HH:MM).');
    if (!motivo) return setErro('Selecione o motivo da justificativa.');
    setEnviando(true);
    const nova = await addSolicitacao({ tipo: 'Ajuste de ponto', dataRef: data, horario, motivo, observacao: obs });
    if (!nova) {
      setEnviando(false);
      return setErro('Não foi possível enviar. Tente novamente.');
    }
    navigation.replace('Solicitacoes');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Solicitação de Ajuste</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <FormField label="Data do ajuste">
            <DatePicker value={data} onChange={setData} />
          </FormField>

          <View style={styles.marcList}>
            {LABELS.map((label, i) => (
              <FormField key={i} label={label}>
                <View style={styles.timeField}>
                  <TextInput
                    style={styles.timeInput}
                    value={marcacoes[i]}
                    onChangeText={(v) => setMarc(i, v)}
                    placeholder="--:--"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                  {marcacoes[i] ? (
                    <Pressable onPress={() => setMarc(i, '')} hitSlop={8} accessibilityLabel="Limpar">
                      <Ionicons name="close" size={18} color={colors.textMuted} />
                    </Pressable>
                  ) : (
                    <Ionicons name="time-outline" size={20} color={colors.textMuted} />
                  )}
                </View>
              </FormField>
            ))}
          </View>

          <FormField label="Motivo da justificativa">
            <Select value={motivo} options={MOTIVOS} onChange={setMotivo} placeholder="Selecione o motivo" />
          </FormField>

          <FormField label="Observação">
            <TextInput
              style={styles.textarea}
              value={obs}
              onChangeText={setObs}
              placeholder="Descreva detalhes complementares"
              placeholderTextColor={colors.textMuted}
              multiline
            />
          </FormField>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        {erro && (
          <Text style={styles.erro} accessibilityLiveRegion="assertive">
            {erro}
          </Text>
        )}
        <Button title="Enviar solicitação" onPress={enviar} loading={enviando} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  flex1: { flex: 1 },
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
  content: { padding: spacing.lg, gap: 18 },

  marcList: { gap: 12 },
  timeField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
  },
  timeInput: { flex: 1, ...typography.input, fontSize: 15, fontWeight: '600', color: colors.textPrimary, paddingVertical: 0 },

  textarea: {
    minHeight: 96,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: 14,
    ...typography.input,
    fontSize: 15,
    color: '#374151',
    textAlignVertical: 'top',
  },

  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  erro: { ...typography.caption, color: colors.danger, marginBottom: spacing.sm, textAlign: 'center' },
});
