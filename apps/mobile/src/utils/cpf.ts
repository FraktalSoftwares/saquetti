/** Utilidades de CPF: mascara, validacao (digitos verificadores) e mapeamento para login. */

/** Remove tudo que nao for digito. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Aplica a mascara 000.000.000-00 conforme o usuario digita. */
export function maskCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  let out = d;
  if (d.length > 3) out = `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length > 6) out = `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  if (d.length > 9) out = `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  return out;
}

/** Valida CPF pelos digitos verificadores (algoritmo padrao Receita Federal). */
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // rejeita sequencias iguais

  const calcDigit = (slice: string, factorStart: number): number => {
    let sum = 0;
    let factor = factorStart;
    for (const ch of slice) {
      sum += parseInt(ch, 10) * factor;
      factor -= 1;
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calcDigit(cpf.slice(0, 9), 10);
  const d2 = calcDigit(cpf.slice(0, 10), 11);
  return d1 === parseInt(cpf[9], 10) && d2 === parseInt(cpf[10], 10);
}

/**
 * Mapeia o CPF para o e-mail sintetico usado no Supabase Auth.
 * O trabalhador loga com CPF; internamente autenticamos por e-mail.
 * Ex.: 123.456.789-00 -> 12345678900@saquetti.app
 */
export function cpfToEmail(cpf: string): string {
  return `${onlyDigits(cpf)}@saquetti.app`;
}
