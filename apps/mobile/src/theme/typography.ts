/**
 * Escala tipografica. Fonte Inter (carregada em App.tsx via @expo-google-fonts/inter).
 * Os pesos mapeiam para as familias registradas: Inter_400Regular, _500Medium, _600SemiBold, _700Bold.
 */
export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  title: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 34 },
  h2: { fontFamily: fontFamily.bold, fontSize: 20, lineHeight: 26 },
  subtitle: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 20 },
  input: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 22 },
  button: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20 },
  bodySemibold: { fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  overline: { fontFamily: fontFamily.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
} as const;
