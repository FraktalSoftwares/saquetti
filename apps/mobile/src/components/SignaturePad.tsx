import React, { useRef } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, typography } from '../theme';

/**
 * Quadro de captura de assinatura (RF de assinatura eletrônica).
 * Desenha traços com o dedo/mouse via PanResponder + react-native-svg.
 * Controlado: o pai mantém `strokes` (lista de "d" de <path>) e recebe onChange.
 */
export function SignaturePad({
  strokes,
  onChange,
}: {
  strokes: string[];
  onChange: (strokes: string[]) => void;
}) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const strokesRef = useRef(strokes);
  strokesRef.current = strokes;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        onChangeRef.current([...strokesRef.current, `M ${x.toFixed(1)} ${y.toFixed(1)}`]);
      },
      onPanResponderMove: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        const cur = strokesRef.current;
        if (!cur.length) return;
        const copy = [...cur];
        copy[copy.length - 1] += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        onChangeRef.current(copy);
      },
    }),
  ).current;

  return (
    <View style={styles.pad} {...pan.panHandlers}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        {strokes.map((d, i) => (
          <Path
            key={i}
            d={d}
            stroke={colors.textPrimary}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </Svg>
      <View style={styles.baseline} pointerEvents="none" />
      <Text style={styles.hint} pointerEvents="none">
        Assine acima da linha
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    height: 230,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  baseline: { position: 'absolute', left: 24, right: 24, bottom: 54, height: 1.5, backgroundColor: '#CBD5E1' },
  hint: { position: 'absolute', left: 24, bottom: 30, ...typography.body, color: '#94A3B8' },
});
