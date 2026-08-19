import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

/** Rótulo + campo para formulários (padrão do design: label 14/700 acima do campo). */
export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  label: { ...typography.label, fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
});
