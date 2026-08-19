import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton, Button, PasswordField } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { isStrongPassword } from '../../utils/password';
import { alterarSenha } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import type { AppStackScreenProps } from '../../navigation/types';

/** Tela 8.2 Alterar senha. */
export function AlterarSenhaScreen({ navigation }: AppStackScreenProps<'AlterarSenha'>) {
  const insets = useSafeAreaInsets();
  const { colaborador } = useAuth();
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const salvar = async () => {
    setErro(null);
    if (!atual) return setErro('Informe a senha atual.');
    if (!isStrongPassword(nova))
      return setErro('A nova senha deve ter 8+ caracteres, com maiúscula, minúscula, número e símbolo.');
    if (nova !== confirmar) return setErro('As senhas não coincidem.');

    setLoading(true);
    const r = await alterarSenha(colaborador?.cpf ?? '', atual, nova);
    setLoading(false);
    if (r.ok) {
      Alert.alert('Senha alterada', 'Sua senha foi atualizada com sucesso.');
      navigation.goBack();
    } else {
      setErro(r.error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Alterar senha</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <PasswordField label="Senha atual" value={atual} onChangeText={setAtual} placeholder="Sua senha atual" />
          <PasswordField label="Nova senha" value={nova} onChangeText={setNova} placeholder="Nova senha" />
          <PasswordField
            label="Confirmar nova senha"
            value={confirmar}
            onChangeText={setConfirmar}
            placeholder="Repita a nova senha"
          />
          {erro && (
            <Text style={styles.erro} accessibilityLiveRegion="assertive">
              {erro}
            </Text>
          )}
          <Button title="Salvar nova senha" onPress={salvar} loading={loading} style={styles.salvar} />
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
  content: { padding: spacing.lg, gap: spacing.lg },
  erro: { ...typography.caption, color: colors.danger, marginTop: -spacing.sm },
  salvar: { marginTop: spacing.sm },
});
