export { colors } from './colors';
export { typography, fontFamily } from './typography';

/** Espacamentos (grid mobile: margin lateral 16, gutter 12). */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/** Raios de canto (input 8, botao 10, card 16). */
export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

export const layout = {
  screenPadding: 16,
  inputHeight: 52,
  buttonHeight: 54,
} as const;
