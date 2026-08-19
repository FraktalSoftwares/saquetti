import React from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

/**
 * Miniatura da foto de verificação. Mostra a foto real (uri) quando disponível;
 * caso contrário, um placeholder (gradiente + silhueta), fiel ao design.
 */
export function PhotoThumb({
  size = 52,
  radius = 8,
  uri = null,
  style,
}: {
  size?: number;
  radius?: number;
  uri?: string | null;
  style?: ViewStyle;
}) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[{ width: size, height: size, borderRadius: radius }, style as object]}
        resizeMode="cover"
      />
    );
  }
  return (
    <LinearGradient
      colors={['#2B3A4F', '#1A2536']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={[styles.wrap, { width: size, height: size, borderRadius: radius }, style]}
    >
      <Ionicons name="person" size={size * 0.66} color="#5A6B82" style={styles.figure} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' },
  figure: { marginBottom: -4 },
});
