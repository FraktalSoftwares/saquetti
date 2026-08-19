import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton, Button, SignaturePad } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { assinarMes } from '../../services/espelhoService';
import type { AppStackScreenProps } from '../../navigation/types';

/** Tela 7.2 Captura de assinatura. */
export function CapturaAssinaturaScreen({
  navigation,
  route,
}: AppStackScreenProps<'CapturaAssinatura'>) {
  const insets = useSafeAreaInsets();
  const { mesId } = route.params;
  const [strokes, setStrokes] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);
  const assinou = strokes.length > 0;

  const confirmar = async () => {
    if (!assinou || salvando) return;
    setSalvando(true);
    await assinarMes(mesId);
    navigation.navigate('AssinaturaConfirmada', { mesId });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Sua assinatura</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>
          Assine no quadro abaixo usando o dedo para confirmar o cartão ponto.
        </Text>

        <View style={styles.padWrap}>
          <SignaturePad strokes={strokes} onChange={setStrokes} />
        </View>

        <Pressable style={styles.limpar} onPress={() => setStrokes([])} hitSlop={6}>
          <Ionicons name="trash-outline" size={15} color="#374151" />
          <Text style={styles.limparText}>Limpar</Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Button title="Confirmar" onPress={confirmar} disabled={!assinou} loading={salvando} />
      </View>
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
  intro: { ...typography.subtitle, fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  padWrap: { marginTop: spacing.lg },
  limpar: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 9,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  limparText: { ...typography.caption, fontSize: 13, fontWeight: '600', color: '#374151' },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
});
