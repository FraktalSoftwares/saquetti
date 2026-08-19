import React, { useMemo, useRef, useState } from 'react';
import {
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
import { BackButton, Button, PasswordField } from '../../components';
import { colors, spacing, typography, layout } from '../../theme';
import { evaluatePassword, isStrongPassword } from '../../utils/password';
import { redefinirSenha } from '../../services/authService';
import type { AuthScreenProps } from '../../navigation/types';

/** Tela 1.4 Nova senha (RF-003). */
export function NovaSenhaScreen({ navigation }: AuthScreenProps<'NovaSenha'>) {
  const insets = useSafeAreaInsets();
  const confirmarRef = useRef<TextInput>(null);

  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [senhaError, setSenhaError] = useState<string | null>(null);
  const [confirmarError, setConfirmarError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const regras = useMemo(() => evaluatePassword(senha), [senha]);
  const mostrarChecklist = senha.length > 0;

  const handleCriar = async () => {
    if (loading) return;
    setFormError(null);
    let ok = true;

    if (!isStrongPassword(senha)) {
      setSenhaError('A senha não atende aos requisitos abaixo');
      ok = false;
    } else {
      setSenhaError(null);
    }
    if (confirmar !== senha) {
      setConfirmarError('As senhas não coincidem');
      ok = false;
    } else {
      setConfirmarError(null);
    }
    if (!ok) return;

    setLoading(true);
    const result = await redefinirSenha(senha);
    setLoading(false);

    if (result.ok) {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      return;
    }
    setFormError(result.error);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <StatusBar style="dark" />
      <BackButton onPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Nova senha</Text>
          <Text style={styles.subtitle}>Por favor, digite sua nova senha nos campos abaixo</Text>

          <View style={styles.form}>
            <PasswordField
              label="Nova senha"
              required
              value={senha}
              onChangeText={setSenha}
              placeholder="Digite a nova senha"
              returnKeyType="next"
              onSubmitEditing={() => confirmarRef.current?.focus()}
              error={senhaError}
            />

            {mostrarChecklist && (
              <View style={styles.checklist} accessibilityLiveRegion="polite">
                {regras.map((r) => (
                  <View key={r.key} style={styles.checkRow}>
                    <Ionicons
                      name={r.ok ? 'checkmark-circle' : 'ellipse-outline'}
                      size={16}
                      color={r.ok ? colors.success : colors.textMuted}
                    />
                    <Text style={[styles.checkLabel, r.ok && styles.checkLabelOk]}>{r.label}</Text>
                  </View>
                ))}
              </View>
            )}

            <PasswordField
              ref={confirmarRef}
              label="Confirmar Nova senha"
              required
              value={confirmar}
              onChangeText={setConfirmar}
              placeholder="Repita a nova senha"
              returnKeyType="done"
              onSubmitEditing={handleCriar}
              error={confirmarError}
            />

            {formError && (
              <Text style={styles.formError} accessibilityLiveRegion="assertive">
                {formError}
              </Text>
            )}

            <Button title="Criar nova senha" onPress={handleCriar} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, paddingHorizontal: layout.screenPadding },
  flex: { flex: 1 },
  content: { paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  title: { ...typography.title, color: colors.textPrimary },
  subtitle: { ...typography.subtitle, color: colors.textSecondary, marginTop: spacing.md },
  form: { marginTop: spacing.xxl, gap: spacing.xl },
  checklist: { marginTop: -spacing.sm, gap: spacing.xs },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkLabel: { ...typography.caption, color: colors.textSecondary },
  checkLabelOk: { color: colors.success },
  formError: { ...typography.caption, color: colors.danger },
});
