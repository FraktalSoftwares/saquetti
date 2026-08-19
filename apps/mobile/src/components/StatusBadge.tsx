import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';
import type { BadgeTone } from '../types';

const TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  ok: { bg: colors.successBg, fg: colors.successText },
  extra: { bg: colors.successBg, fg: colors.successText },
  falta: { bg: colors.dangerBg, fg: colors.dangerText },
  folga: { bg: colors.background, fg: colors.textSecondary },
  pendente: { bg: colors.warningBg, fg: colors.warningText },
  neutro: { bg: colors.background, fg: colors.textStrong },
};

export function StatusBadge({ text, tone }: { text: string; tone: BadgeTone }) {
  const c = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 6, paddingVertical: 4, paddingHorizontal: 9, alignSelf: 'flex-start' },
  text: { ...typography.caption, fontSize: 11, fontWeight: '600' },
});
