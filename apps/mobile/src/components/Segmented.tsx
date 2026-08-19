import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../theme';

export type SegmentedOption<T extends string> = { value: T; label: string };

/** Controle de abas segmentado (aba ativa = pílula azul preenchida), fiel ao design. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.item, active && styles.itemActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]} numberOfLines={1}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 4,
  },
  item: { flex: 1, height: 34, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  itemActive: { backgroundColor: colors.primary },
  label: { ...typography.caption, fontSize: 13, fontWeight: '600' },
  labelActive: { color: colors.white },
  labelInactive: { color: colors.textSecondary },
});
