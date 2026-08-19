import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export function BackButton({
  onPress,
  color = colors.textPrimary,
}: {
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      style={styles.btn}
    >
      <Ionicons name="chevron-back" size={28} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { width: 40, height: 40, justifyContent: 'center' },
});
