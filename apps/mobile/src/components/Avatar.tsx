import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { avatarLauraXml } from '../assets/svg';
import { colors } from '../theme';

/**
 * Avatar do colaborador. Hoje usa o asset de demonstração (Laura) importado do design.
 * [A DEFINIR] Trocar por `colaborador.fotoPerfil` quando o upload de foto existir.
 */
export function Avatar({
  size = 46,
  radius = 12,
  bordered = true,
}: {
  size?: number;
  radius?: number;
  bordered?: boolean;
}) {
  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: radius },
        bordered && styles.bordered,
      ]}
    >
      <SvgXml xml={avatarLauraXml} width={size} height={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', backgroundColor: colors.borderLight },
  bordered: { borderWidth: 1, borderColor: colors.borderLight },
});
