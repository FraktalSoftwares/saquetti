import React from 'react';
import { SvgXml } from 'react-native-svg';
import { rhexaLogoXml } from '../assets/svg';

const RATIO = 285 / 82; // viewBox do logo oficial

/**
 * Wordmark oficial RHEXA (asset importado do design). Letras claras + "X" azul —
 * pensado para fundo escuro (splash / header do login).
 * `size` = altura em px.
 */
export function Logo({ size = 44 }: { size?: number }) {
  return <SvgXml xml={rhexaLogoXml} width={size * RATIO} height={size} />;
}
