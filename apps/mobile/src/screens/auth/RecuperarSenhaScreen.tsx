import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton, Button, TextField } from '../../components';
import { colors, spacing, typography, layout } from '../../theme';
import { isValidCpf, maskCpf } from '../../utils/cpf';
import { solicitarRecuperacao } from '../../services/authService';
import type { AuthScreenProps } from '../../navigation/types';

/**
 * Tela 1.3 Recuperar senha (RF-002).
 * [A DEFINIR] Canal do codigo (SMS/e-mail) e etapa de verificacao por codigo.
 */
export function RecuperarSenhaScreen({ navigation }: AuthScreenProps<'Recuperar'>) {
  const insets = useSafeAreaInsets();
  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    if (loading) return;
    if (!cpf.trim()) {
      setCpfError('Informe seu CPF');
      return;
    }
    if (!isValidCpf(cpf)) {
      setCpfError('CPF inválido. Formato esperado: 000.000.000-00');
      return;
    }
    setCpfError(null);
    setLoading(true);
    await solicitarRecuperacao(cpf);
    setLoading(false);
    // Mensagem neutra por seguranca (nao revela se o CPF existe) e segue o fluxo.
    navigation.navigate('NovaSenha');
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
          <Text style={styles.title}>Recuperar senha</Text>
          <Text style={styles.subtitle}>
            Digite seu CPF para receber um código de verificação por SMS ou e-mail.
          </Text>

          <View style={styles.form}>
            <TextField
              label="CPF"
              required
              value={cpf}
              onChangeText={(t) => setCpf(maskCpf(t))}
              placeholder="000.000.000-00"
              keyboardType="number-pad"
              maxLength={14}
              returnKeyType="done"
              onSubmitEditing={handleEnviar}
              error={cpfError}
            />
            <Button title="Enviar código" onPress={handleEnviar} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, paddingHorizontal: layout.screenPadding },
  flex: { flex: 1 },
  content: { paddingTop: spacing.xxl },
  title: { ...typography.title, color: colors.textPrimary },
  subtitle: { ...typography.subtitle, color: colors.textSecondary, marginTop: spacing.md },
  form: { marginTop: spacing.xxl, gap: spacing.xl },
});
