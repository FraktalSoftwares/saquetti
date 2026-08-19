/**
 * Paleta do app do Trabalhador (RHEXA / Saquetti).
 * Tokens alinhados ao design autoritativo "Ambiente Trabalhador Mobile Rhexa.dc.html"
 * (projeto claude.ai/design "Protótipo Saquetti"). Primária = AZUL #3D71B8.
 */
export const colors = {
  // Marca
  primary: '#3D71B8',
  primaryPressed: '#335F9E',
  primaryDisabled: '#A9C0DE',

  // Superfícies escuras (dc.html)
  brandGradient: ['#0C1C3C', '#010A28'] as const, // splash / header do login
  headerDark: '#010A28', // header escuro (Home, Registrar Ponto)
  cameraBg: '#0B1320', // tela de câmera (foto de verificação)
  mapBg: '#0E1726', // mock de mapa
  receiptBg: '#010A28', // card do comprovante
  receiptDivider: '#1E3A5F',
  receiptIcon: '#3B6FF5',

  // Barra de progresso da jornada
  progressFill: '#201B53',
  progressTrack: '#E5E7EB',

  // Texto
  textPrimary: '#111827',
  textStrong: '#374151', // gray-700 (valores de destaque, labels de formulário)
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#C7D0DE',

  // Superfícies claras
  background: '#F3F4F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F9FAFB',
  white: '#FFFFFF',

  // Bordas
  border: '#D1D5DB',
  borderLight: '#E5E7EB',
  divider: '#F3F4F6',

  // Status
  success: '#16A34A',
  successBright: '#22C55E', // checks (foto capturada, comprovante)
  successBg: '#DCFCE7',
  successText: '#166534',
  warning: '#F97316',
  warningBg: '#FFF7ED',
  warningText: '#92400E',
  warningBorder: '#F97316',
  danger: '#EF4444',
  dangerText: '#DC2626', // texto/ícone de erro sobre fundo claro
  dangerBg: '#FEE2E2',

  // Info (pill "Última marcação", tiles de ícone)
  infoText: '#1D4ED8',
  infoBg: '#EFF6FF',
  infoBorder: '#BFDBFE',
  iconTileBg: '#EFF6FF',

  // Utilitários
  link: '#3D71B8',
  overlay: 'rgba(0,0,0,0.5)',
} as const;

export type Colors = typeof colors;
