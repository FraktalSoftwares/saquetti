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
import { colors, radius, spacing, typography, layout } from '../../theme';
import { getDia } from '../../services/espelhoService';
import * as DocumentPicker from 'expo-document-picker';
import {
  ANEXO_TAMANHO_MAX,
  addSolicitacao,
  type AnexoLocal,
} from '../../services/solicitacoesService';
import { maskHora } from '../../utils/datetime';
import type { AppStackScreenProps } from '../../navigation/types';

const PERIODOS = ['Dia inteiro', 'Período 1', 'Período 2', 'Período 3', 'Período Específico'];
const MOTIVOS = ['Atestado', 'Declaração Médica'];

/** "1,4 MB" / "812 KB" — tamanho do comprovante para o trabalhador conferir. */
function formatarTamanho(bytes: number | null): string {
  if (bytes == null) return 'Arquivo anexado';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

/** Tela 4.4 Justificar Ausência. */
export function JustificarAusenciaScreen({ navigation, route }: AppStackScreenProps<'JustificarAusencia'>) {
  const insets = useSafeAreaInsets();
  const dia = route.params?.diaId ? getDia(route.params.diaId) : undefined;
  const [data, setData] = useState<Date>(() =>
    dia?.dataISO ? new Date(`${dia.dataISO}T12:00:00`) : new Date(),
  );
  const [periodo, setPeriodo] = useState('Dia inteiro');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [motivo, setMotivo] = useState<string | null>(null);
  const [obs, setObs] = useState('');
  const [anexo, setAnexo] = useState<AnexoLocal | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const especifico = periodo === 'Período Específico';

  const [enviando, setEnviando] = useState(false);

  /** Abre o seletor do aparelho e valida tipo/tamanho antes de aceitar o comprovante. */
  const escolherAnexo = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (res.canceled) return;
    const f = res.assets[0];
    if (!f) return;

    const tipoOk = f.mimeType ? /^(application\/pdf|image\/)/.test(f.mimeType) : true;
    if (!tipoOk) return setErro('O comprovante deve ser um PDF ou uma imagem.');
    if (f.size != null && f.size > ANEXO_TAMANHO_MAX)
      return setErro('O comprovante deve ter no máximo 10 MB.');

    setErro(null);
    setAnexo({ uri: f.uri, nome: f.name, mimeType: f.mimeType ?? null, tamanho: f.size ?? null });
  };

  const enviar = async () => {
    if (enviando) return;
    setErro(null);
    if (especifico && (inicio.length !== 5 || fim.length !== 5))
      return setErro('Informe o horário de início e fim (HH:MM).');
    if (!motivo) return setErro('Selecione o motivo.');
    setEnviando(true);
    const nova = await addSolicitacao({
      tipo: 'Justificativa de ausência',
      dataRef: data,
      horario: especifico ? `${inicio} – ${fim}` : periodo,
      motivo,
      periodo,
      observacao: obs,
      anexo,
    });
    if (!nova) {
      setEnviando(false);
      return setErro(
        anexo
          ? 'Não foi possível enviar o comprovante. Verifique a conexão e tente novamente.'
          : 'Não foi possível enviar. Tente novamente.',
      );
    }
    navigation.replace('Solicitacoes');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Justificar Ausência</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <FormField label="Data">
            <DatePicker value={data} onChange={setData} />
          </FormField>

          <FormField label="Período da Ausência">
            <Select value={periodo} options={PERIODOS} onChange={setPeriodo} />
          </FormField>

          {especifico && (
            <>
              <FormField label="Horário do início">
                <View style={styles.timeField}>
                  <TextInput
                    style={styles.timeInput}
                    value={inicio}
                    onChangeText={(v) => setInicio(maskHora(v))}
                    placeholder="--:--"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                  <Ionicons name="time-outline" size={20} color={colors.textMuted} />
                </View>
              </FormField>
              <FormField label="Horário do fim">
                <View style={styles.timeField}>
                  <TextInput
                    style={styles.timeInput}
                    value={fim}
                    onChangeText={(v) => setFim(maskHora(v))}
                    placeholder="--:--"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                  <Ionicons name="time-outline" size={20} color={colors.textMuted} />
                </View>
              </FormField>
            </>
          )}

          <FormField label="Motivo">
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

          <FormField label="Comprovante">
            <Pressable style={styles.anexo} onPress={escolherAnexo} accessibilityRole="button">
              <Ionicons
                name={anexo ? 'document-attach-outline' : 'cloud-upload-outline'}
                size={24}
                color={colors.primary}
              />
              {anexo ? (
                <>
                  <Text style={styles.anexoNome} numberOfLines={1}>
                    {anexo.nome}
                  </Text>
                  <Text style={styles.anexoHint}>
                    {formatarTamanho(anexo.tamanho)} · toque para substituir
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.anexoNome}>Anexar comprovante</Text>
                  <Text style={styles.anexoHint}>PDF ou imagem · até 10 MB</Text>
                </>
              )}
            </Pressable>
            {anexo && (
              <Pressable
                style={styles.removerAnexo}
                onPress={() => setAnexo(null)}
                accessibilityRole="button"
                hitSlop={8}
              >
                <Ionicons name="close-circle" size={15} color={colors.danger} />
                <Text style={styles.removerAnexoText}>Remover comprovante</Text>
              </Pressable>
            )}
          </FormField>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        {erro && (
          <Text style={styles.erro} accessibilityLiveRegion="assertive">
            {erro}
          </Text>
        )}
        <Button title="Enviar Justificativa" onPress={enviar} loading={enviando} />
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

  timeField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.inputHeight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
  },
  timeInput: { flex: 1, ...typography.input, fontSize: 15, color: '#374151', paddingVertical: 0 },

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

  anexo: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    paddingVertical: 22,
    paddingHorizontal: 16,
  },
  removerAnexo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  removerAnexoText: { ...typography.caption, fontSize: 12.5, color: colors.danger },
  anexoNome: { ...typography.bodySemibold, fontSize: 14, color: colors.primary },
  anexoHint: { ...typography.caption, fontSize: 12.5, color: colors.textMuted },

  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  erro: { ...typography.caption, color: colors.danger, marginBottom: spacing.sm, textAlign: 'center' },
});
