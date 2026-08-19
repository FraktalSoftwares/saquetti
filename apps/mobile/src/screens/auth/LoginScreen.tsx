import React, { useEffect, useRef, useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Logo, PasswordField, TextField } from '../../components';
import { colors, spacing, typography, layout } from '../../theme';
import { isValidCpf, maskCpf } from '../../utils/cpf';
import { login } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import type { AuthScreenProps } from '../../navigation/types';

const MAX_TENTATIVAS = 5;
const BLOQUEIO_MS = 15 * 60 * 1000; // RF-001: bloqueio de 15 minutos

export function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const insets = useSafeAreaInsets();
  const senhaRef = useRef<TextInput>(null);
  const { authError, clearAuthError } = useAuth();

  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [senhaError, setSenhaError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Controle de tentativas / bloqueio temporario (client-side).
  // [A DEFINIR] O bloqueio definitivo deve ser reforcado no backend.
  const [tentativas, setTentativas] = useState(0);
  const [bloqueadoAte, setBloqueadoAte] = useState<number | null>(null);
  const [agora, setAgora] = useState(Date.now());

  useEffect(() => {
    if (!bloqueadoAte) return;
    const t = setInterval(() => {
      const now = Date.now();
      setAgora(now);
      if (now >= bloqueadoAte) clearInterval(t); // para de tiquetaquear quando o bloqueio expira
    }, 1000);
    return () => clearInterval(t);
  }, [bloqueadoAte]);

  const bloqueado = !!bloqueadoAte && bloqueadoAte > agora;
  const minutosRestantes = bloqueado ? Math.ceil((bloqueadoAte! - agora) / 60000) : 0;

  const validar = (): boolean => {
    let ok = true;
    if (!cpf.trim()) {
      setCpfError('Informe seu CPF');
      ok = false;
    } else if (!isValidCpf(cpf)) {
      setCpfError('CPF inválido. Formato esperado: 000.000.000-00');
      ok = false;
    } else {
      setCpfError(null);
    }
    if (!senha) {
      setSenhaError('Informe sua senha');
      ok = false;
    } else {
      setSenhaError(null);
    }
    return ok;
  };

  const handleEntrar = async () => {
    setFormError(null);
    clearAuthError();
    if (bloqueado || loading) return;
    if (!validar()) return;

    setLoading(true);
    const result = await login(cpf, senha);
    setLoading(false);

    if (result.ok) return; // AuthContext detecta a sessao e troca de stack.

    const novasTentativas = tentativas + 1;
    setTentativas(novasTentativas);
    if (novasTentativas >= MAX_TENTATIVAS) {
      const ate = Date.now() + BLOQUEIO_MS;
      setBloqueadoAte(ate);
      setAgora(Date.now());
      setFormError('Muitas tentativas. Conta bloqueada por 15 minutos.');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={colors.brandGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <Logo size={40} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Faça login para continuar</Text>
          <Text style={styles.subtitle}>Registre e gerencie seus pontos diários</Text>

          <View style={styles.form}>
            <TextField
              label="CPF"
              required
              value={cpf}
              onChangeText={(t) => setCpf(maskCpf(t))}
              placeholder="000.000.000-00"
              keyboardType="number-pad"
              maxLength={14}
              returnKeyType="next"
              onSubmitEditing={() => senhaRef.current?.focus()}
              error={cpfError}
              editable={!bloqueado}
            />

            <PasswordField
              ref={senhaRef}
              label="Senha"
              required
              value={senha}
              onChangeText={setSenha}
              placeholder="Sua senha"
              returnKeyType="done"
              onSubmitEditing={handleEntrar}
              error={senhaError}
              editable={!bloqueado}
            />

            {(formError || authError || bloqueado) && (
              <Text style={styles.formError} accessibilityLiveRegion="assertive">
                {bloqueado
                  ? `Conta bloqueada. Tente novamente em ${minutosRestantes} min.`
                  : formError || authError}
              </Text>
            )}

            <Button
              title="Entrar"
              onPress={handleEntrar}
              loading={loading}
              disabled={bloqueado}
              style={styles.submit}
            />

            <Pressable
              onPress={() => navigation.navigate('Recuperar')}
              hitSlop={8}
              style={styles.linkWrap}
            >
              <Text style={styles.link}>Esqueceu sua senha?</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  header: {
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  content: { padding: layout.screenPadding, paddingTop: spacing.xxl },
  title: { ...typography.title, color: colors.textPrimary },
  subtitle: { ...typography.subtitle, color: colors.textSecondary, marginTop: spacing.sm },
  form: { marginTop: spacing.xxl, gap: spacing.xl },
  formError: { ...typography.caption, color: colors.danger, marginTop: -spacing.sm },
  submit: { marginTop: spacing.xs },
  linkWrap: { alignSelf: 'flex-start', marginTop: spacing.xs },
  link: {
    ...typography.bodyMedium,
    color: colors.link,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
