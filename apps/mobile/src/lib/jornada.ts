/**
 * Regras de cálculo de jornada (banco de horas / horas esperadas / extras).
 *
 * ⚠️ DEFAULTS DOCUMENTADOS (ajustáveis quando a Escala do colaborador existir — data-model.md):
 *  - Jornada esperada: 8h (480 min) em dias úteis (Seg–Sex); 0 em fim de semana (folga).
 *  - Feriados NÃO são considerados (não há tabela de feriados nesta fase). [A DEFINIR]
 *  - Trabalhado no dia = soma dos pares Entrada→Saída. Nº ímpar de batidas = dia "incompleto".
 *  - Saldo do dia = trabalhado − esperado. Banco do mês = soma dos saldos diários.
 *  - Não há interjornada/DSR/arredondamentos nesta fase. [A DEFINIR]
 */

export const JORNADA_PADRAO_MIN = 480; // 8h

const pad = (n: number) => String(n).padStart(2, '0');

/** "8h47", "0h00". Recebe minutos (>= 0). */
export function fmtDuracao(min: number): string {
  const m = Math.max(0, Math.round(min));
  return `${Math.floor(m / 60)}h${pad(m % 60)}`;
}

/** Saldo com sinal: "+0h47", "-0h30", "0h00". */
export function fmtSaldo(min: number): string {
  const r = Math.round(min);
  if (r === 0) return '0h00';
  return `${r > 0 ? '+' : '-'}${fmtDuracao(Math.abs(r))}`;
}

export function ehFimDeSemana(dow: number): boolean {
  return dow === 0 || dow === 6; // 0=Dom, 6=Sáb
}

/** Uma batida (para o cálculo). */
export type Batida = { tipo: 'Entrada' | 'Saída'; ts: number }; // ts = epoch ms

/**
 * Soma dos pares Entrada→Saída em minutos. `incompleto` = sobrou batida sem par
 * (nº ímpar) — típico de esquecimento de marcação.
 */
export function minutosTrabalhados(batidas: Batida[]): { min: number; incompleto: boolean } {
  const ord = [...batidas].sort((a, b) => a.ts - b.ts);
  let total = 0;
  let entrada: number | null = null;
  let usadas = 0;
  for (const b of ord) {
    if (b.tipo === 'Entrada') {
      entrada = b.ts;
    } else if (b.tipo === 'Saída' && entrada != null) {
      total += (b.ts - entrada) / 60000;
      entrada = null;
      usadas += 2;
    }
  }
  const incompleto = usadas !== ord.length; // sobrou entrada sem saída (ou saída solta)
  return { min: total, incompleto };
}
