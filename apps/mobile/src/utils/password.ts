/**
 * Requisitos de senha (RF-003): minimo 8 caracteres, 1 maiuscula, 1 minuscula,
 * 1 numero e 1 caractere especial.
 */
export type PasswordRule = {
  key: string;
  label: string;
  test: (value: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
  { key: 'len', label: 'Mínimo de 8 caracteres', test: (v) => v.length >= 8 },
  { key: 'upper', label: 'Letra maiúscula', test: (v) => /[A-Z]/.test(v) },
  { key: 'lower', label: 'Letra minúscula', test: (v) => /[a-z]/.test(v) },
  { key: 'number', label: 'Número', test: (v) => /\d/.test(v) },
  { key: 'special', label: 'Caractere especial (!@#$...)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

/** Retorna a lista de regras com o status atual (para checklist visual ✓/✗). */
export function evaluatePassword(value: string) {
  return passwordRules.map((rule) => ({
    key: rule.key,
    label: rule.label,
    ok: rule.test(value),
  }));
}

export function isStrongPassword(value: string): boolean {
  return passwordRules.every((rule) => rule.test(value));
}
