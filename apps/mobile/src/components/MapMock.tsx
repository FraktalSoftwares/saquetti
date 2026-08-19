import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

/**
 * Mock de mapa (grid escuro + pino), fiel ao design.
 * [A DEFINIR] Substituir por mapa real (react-native-maps / tile estático) quando definido.
 */
export function MapMock({
  height = 180,
  radius = 12,
  controls = false,
  pinSize = 30,
  gridGap = 44,
  style,
}: {
  height?: number;
  radius?: number;
  controls?: boolean;
  pinSize?: number;
  gridGap?: number;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.wrap, { height, borderRadius: radius }, style]}>
      <Grid gap={gridGap} />
      {/* "rua" diagonal */}
      <View style={styles.street} />
      <Ionicons name="location" size={pinSize} color={colors.danger} style={styles.pin} />

      {controls && (
        <>
          <Pressable style={[styles.ctrl, styles.ctrlTop]} accessibilityLabel="Fechar mapa">
            <Ionicons name="close" size={16} color="#374151" />
          </Pressable>
          <Pressable
            style={[styles.ctrl, styles.ctrlBottom]}
            accessibilityLabel="Centralizar localização"
          >
            <Ionicons name="locate" size={18} color={colors.primary} />
          </Pressable>
        </>
      )}
    </View>
  );
}

function Grid({ gap }: { gap: number }) {
  const lines = Array.from({ length: 12 });
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {lines.map((_, i) => (
        <View key={`v${i}`} style={[styles.vline, { left: (i + 1) * gap }]} />
      ))}
      {lines.map((_, i) => (
        <View key={`h${i}`} style={[styles.hline, { top: (i + 1) * gap }]} />
      ))}
    </View>
  );
}

const LINE = 'rgba(255,255,255,0.05)';

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.mapBg, overflow: 'hidden', position: 'relative' },
  vline: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: LINE },
  hline: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: LINE },
  street: {
    position: 'absolute',
    top: '54%',
    left: '-10%',
    right: '-10%',
    height: 18,
    backgroundColor: 'rgba(120,140,170,0.16)',
    transform: [{ rotate: '-14deg' }],
  },
  pin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -26,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 2 },
  },
  ctrl: {
    position: 'absolute',
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  ctrlTop: { top: 10, backgroundColor: 'rgba(255,255,255,0.92)' },
  ctrlBottom: {
    bottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
