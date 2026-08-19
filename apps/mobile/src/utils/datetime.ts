/** Formatação de data/hora em pt-BR (sem depender de Intl no Hermes). */

const DIAS_LONGOS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];
const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

const pad = (n: number) => String(n).padStart(2, '0');
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Fuso do colaborador: America/Sao_Paulo (UTC−03, sem horário de verão desde 2019).
 * Offset fixo evita depender de Intl/timeZone (limitado no Hermes). [A DEFINIR: multi-fuso]
 */
const TZ_OFFSET_MIN = -180;

/** Converte um ISO (UTC) para um Date deslocado ao fuso local; leia com getUTC*. */
function paraLocal(iso: string): Date {
  return new Date(new Date(iso).getTime() + TZ_OFFSET_MIN * 60000);
}

/** "HH:MM" no fuso do colaborador a partir de um timestamp ISO. */
export function horaDeISO(iso: string): string {
  const d = paraLocal(iso);
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

/** Chave de dia local "YYYY-MM-DD" a partir de um ISO. */
export function diaLocalISO(iso: string): string {
  const d = paraLocal(iso);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** "HH:MM:SS" no fuso local a partir de um ISO. */
export function horaCompletaDeISO(iso: string): string {
  const d = paraLocal(iso);
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

/** "Seg, 08 de junho" no fuso local a partir de um ISO. */
export function dataCurtaDeISO(iso: string): string {
  const d = paraLocal(iso);
  return `${DIAS_CURTOS[d.getUTCDay()]}, ${pad(d.getUTCDate())} de ${MESES[d.getUTCMonth()]}`;
}

/** Ex.: "Segunda-feira, 08 de Junho" */
export function dataLonga(d: Date): string {
  return `${DIAS_LONGOS[d.getDay()]}, ${pad(d.getDate())} de ${cap(MESES[d.getMonth()])}`;
}

/** Nome do mês capitalizado (0 = Janeiro). */
export function mesLongo(i: number): string {
  return cap(MESES[i] ?? '');
}

/** Iniciais dos dias da semana (Dom..Sáb). */
export const DIAS_SEMANA_MIN = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/** Ex.: "Seg, 08 de junho" */
export function dataCurta(d: Date): string {
  return `${DIAS_CURTOS[d.getDay()]}, ${pad(d.getDate())} de ${MESES[d.getMonth()]}`;
}

/** Ex.: "22:05:09" */
export function horaCompleta(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Ex.: "22:05" */
export function horaCurta(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Máscara de horário HH:MM enquanto o usuário digita, com faixa válida (00–23 / 00–59). */
export function maskHora(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    if (digits.length === 2 && parseInt(digits, 10) > 23) return '23';
    return digits;
  }
  let hh = digits.slice(0, 2);
  if (parseInt(hh, 10) > 23) hh = '23';
  let mm = digits.slice(2);
  if (mm.length === 2 && parseInt(mm, 10) > 59) mm = '59';
  return `${hh}:${mm}`;
}

/** Máscara de data DD/MM/AAAA (clamp leve de dia/mês). */
export function maskData(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 8);
  let dd = d.slice(0, 2);
  let mm = d.slice(2, 4);
  const yy = d.slice(4, 8);
  if (dd.length === 2 && parseInt(dd, 10) > 31) dd = '31';
  if (mm.length === 2 && parseInt(mm, 10) > 12) mm = '12';
  let out = dd;
  if (d.length >= 3) out = `${dd}/${mm}`;
  if (d.length >= 5) out = `${dd}/${mm}/${yy}`;
  return out;
}

/** Data de hoje no formato DD/MM/AAAA. */
export function dataBR(d: Date): string {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Valida DD/MM/AAAA completa (10 chars, dia/mês plausíveis). */
export function isDataCompleta(value: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [dd, mm] = value.split('/').map((n) => parseInt(n, 10));
  return dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12;
}
