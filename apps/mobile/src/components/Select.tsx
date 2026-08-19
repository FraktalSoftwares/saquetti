import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, layout } from '../theme';

/** Dropdown simples (abre um modal com as opções). */
export function Select({
  value,
  options,
  onChange,
  placeholder = 'Selecione',
}: {
  value: string | null;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <Pressable style={styles.field} onPress={() => setAberto(true)} accessibilityRole="button">
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
          {value ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
      </Pressable>

      <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => setAberto(false)}>
        <Pressable style={styles.backdrop} onPress={() => setAberto(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation?.()}>
            {options.map((opt) => {
              const sel = opt === value;
              return (
                <Pressable
                  key={opt}
                  style={styles.option}
                  onPress={() => {
                    onChange(opt);
                    setAberto(false);
                  }}
                >
                  <Text style={[styles.optionText, sel && styles.optionSelected]}>{opt}</Text>
                  {sel && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: layout.inputHeight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
  },
  value: { flex: 1, ...typography.input, fontSize: 15, color: '#374151' },
  placeholder: { color: colors.textMuted },

  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  optionText: { ...typography.subtitle, fontSize: 16, color: colors.textPrimary },
  optionSelected: { color: colors.primary, fontFamily: typography.bodySemibold.fontFamily },
});
