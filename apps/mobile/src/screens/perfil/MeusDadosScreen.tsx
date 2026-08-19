import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, BackButton, Button } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { atualizarContato } from '../../services/authService';
import type { AppStackScreenProps } from '../../navigation/types';

/** Tela 8.1 Meus dados. */
export function MeusDadosScreen({ navigation }: AppStackScreenProps<'MeusDados'>) {
  const insets = useSafeAreaInsets();
  const { colaborador, refreshColaborador } = useAuth();

  // Dados administrativos (somente leitura; mantidos pelo gestor no portal RH).
  const readonlyFields = [
    { label: 'Nome completo', value: colaborador?.nomeCompleto ?? '—' },
    { label: 'CPF', value: colaborador?.cpf ?? '—' },
    { label: 'Matrícula', value: colaborador?.matricula ?? '—' },
    { label: 'Cargo', value: colaborador?.cargo ?? '—' },
    { label: 'Departamento', value: colaborador?.departamento ?? '—' },
  ];

  const [email, setEmail] = useState(colaborador?.email ?? '');
  const [telefone, setTelefone] = useState(colaborador?.telefone ?? '');
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    if (!colaborador) return;
    setSalvando(true);
    const r = await atualizarContato(colaborador.id, email, telefone);
    if (r.ok) await refreshColaborador();
    setSalvando(false);
    if (r.ok) {
      Alert.alert('Dados salvos', 'Suas informações de contato foram atualizadas.');
    } else {
      Alert.alert('Erro', r.error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Meus dados</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.avatarWrap}>
            <Avatar size={80} radius={18} />
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={13} color={colors.white} />
            </View>
          </View>

          <Text style={styles.section}>DADOS PESSOAIS</Text>
          <View style={styles.card}>
            {readonlyFields.map((f, i) => (
              <View key={f.label} style={[styles.roRow, i > 0 && styles.roDivider]}>
                <Text style={styles.roLabel}>{f.label}</Text>
                <Text style={styles.roValue}>{f.value}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.nota}>Editáveis apenas pelo gestor no portal RH.</Text>

          <Text style={[styles.section, { marginTop: spacing.xl }]}>CONTATO E INFORMAÇÕES</Text>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Telefone</Text>
          <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

          <Button title="Salvar alterações" onPress={salvar} loading={salvando} style={styles.salvar} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: { padding: spacing.lg },

  avatarWrap: { alignSelf: 'center', marginBottom: spacing.lg },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  section: { ...typography.overline, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, marginBottom: 10 },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  roRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 13 },
  roDivider: { borderTopWidth: 1, borderTopColor: '#EEF0F3' },
  roLabel: { ...typography.body, fontSize: 13, color: colors.textMuted },
  roValue: { ...typography.bodySemibold, fontSize: 14, color: '#374151' },
  nota: { ...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 8 },

  label: { ...typography.label, fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    paddingHorizontal: 14,
    ...typography.input,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 13,
  },
  salvar: { marginTop: spacing.sm },
});
