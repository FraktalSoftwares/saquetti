import { supabase } from '../lib/supabase';
import {
  JORNADA_PADRAO_MIN,
  ehFimDeSemana,
  fmtDuracao,
  fmtSaldo,
  minutosTrabalhados,
  type Batida,
} from '../lib/jornada';
import { obterLocalizacao } from './locationService';
import { diaLocalISO, horaDeISO } from '../utils/datetime';
import type {
  BadgeTone,
  BancoResumo,
  DiaEspelho,
  EspelhoResumo,
  MarcacaoDetalhe,
  MesCartao,
  MovimentoBanco,
} from '../types';

/**
 * Serviço de Espelho/Banco/Cartão (4.x) — agora sobre dados REAIS do Supabase
 * (tabela `marcacoes`), com o cálculo de jornada em `lib/jornada.ts`.
 * "Hoje" fica de fora do espelho (é mostrado na Home, em andamento).
 */

export type MarcacaoRow = {
  id: string;
  registrado_em: string;
  tipo: 'Entrada' | 'Saída';
  unidade: string | null;
  endereco: string | null;
  complemento: string | null;
};

const WD = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const MESES_LONGOS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const DIAS_LONGOS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const pad = (n: number) => String(n).padStart(2, '0');

// Cache p/ leitura síncrona por id (getDia) após a lista carregar.
let cacheDias: Record<string, DiaEspelho> = {};

type CartaoRow = {
  status: string;
  assinado_em: string;
  ip: string | null;
  latitude: number | null;
  longitude: number | null;
};

/** Status/carimbo de assinatura do cartão de uma competência ("YYYY-MM"), da tabela `cartoes`. */
async function fetchCartao(competencia: string): Promise<CartaoRow | null> {
  const { data } = await supabase
    .from('cartoes')
    .select('status, assinado_em, ip, latitude, longitude')
    .eq('competencia', competencia)
    .maybeSingle();
  return (data as CartaoRow | null) ?? null;
}

/** Marcações cujo dia LOCAL cai no mês informado (mesIndex 0-based). */
async function fetchMarcacoesMes(ano: number, mesIndex: number): Promise<MarcacaoRow[]> {
  // Dia local começa às 03:00 UTC (−03). Cobrimos o mês local com folga.
  const inicio = new Date(Date.UTC(ano, mesIndex, 1, 3, 0, 0)).toISOString();
  const fim = new Date(Date.UTC(ano, mesIndex + 1, 1, 3, 0, 0)).toISOString();
  const { data, error } = await supabase
    .from('marcacoes')
    .select('id, registrado_em, tipo, unidade, endereco, complemento')
    .gte('registrado_em', inicio)
    .lt('registrado_em', fim)
    .order('registrado_em', { ascending: true });
  if (error || !data) return [];
  return data as MarcacaoRow[];
}

function agrupaPorDia(marc: MarcacaoRow[]): Record<string, MarcacaoRow[]> {
  const grupos: Record<string, MarcacaoRow[]> = {};
  for (const m of marc) {
    const k = diaLocalISO(m.registrado_em);
    (grupos[k] ??= []).push(m);
  }
  return grupos;
}

function marcParaDetalhe(marc: MarcacaoRow[]): MarcacaoDetalhe[] {
  return marc.map((m, i) => ({
    label: `${i + 1}ª marcação (${m.tipo})`,
    local: m.unidade ?? '—',
    hora: horaDeISO(m.registrado_em),
  }));
}

type MesComputado = { dias: DiaEspelho[]; trabalhadasMin: number; esperadasMin: number };

/** Computa um mês inteiro (dias históricos, sem incluir "hoje"). */
async function computarMes(ano: number, mesIndex: number): Promise<MesComputado> {
  const marc = await fetchMarcacoesMes(ano, mesIndex);
  const grupos = agrupaPorDia(marc);

  const hojeISO = diaLocalISO(new Date().toISOString());
  const [hAno, hMes, hDia] = hojeISO.split('-').map(Number);
  const ultimoDiaMes = new Date(ano, mesIndex + 1, 0).getDate();
  const ehMesAtual = ano === hAno && mesIndex === hMes - 1;
  const ehMesFuturo = ano > hAno || (ano === hAno && mesIndex > hMes - 1);
  // Mês atual: até ontem (hoje fica na Home). Mês futuro: nada. Mês passado: mês todo.
  const ultimoDia = ehMesFuturo ? 0 : ehMesAtual ? hDia - 1 : ultimoDiaMes;

  const dias: DiaEspelho[] = [];
  let trabalhadasMin = 0;
  let esperadasMin = 0;

  for (let day = 1; day <= ultimoDia; day++) {
    const date = new Date(ano, mesIndex, day);
    const dow = date.getDay();
    const key = `${ano}-${pad(mesIndex + 1)}-${pad(day)}`;
    const base = { id: key, dataISO: key, dia: pad(day), wd: WD[dow] };
    const dataExtenso = `${DIAS_LONGOS[dow]}, ${pad(day)} de ${MESES_LONGOS[mesIndex]}`;

    if (ehFimDeSemana(dow)) {
      dias.push({ ...base, tipo: 'folga', badge: { text: 'Folga', tone: 'folga' }, punches: [], marcacoes: [], dataExtenso });
      continue;
    }

    const doDia = grupos[key] ?? [];
    esperadasMin += JORNADA_PADRAO_MIN;

    if (doDia.length === 0) {
      // Sem registro (falta): conta como -esperado no saldo.
      dias.push({
        ...base,
        tipo: 'semRegistro',
        line2: 'Nenhuma marcação registrada',
        badge: { text: 'Falta', tone: 'falta' },
        punches: [null, null, null, null],
        marcacoes: [],
        dataExtenso,
        esperadas: fmtDuracao(JORNADA_PADRAO_MIN),
        saldoDia: fmtSaldo(-JORNADA_PADRAO_MIN),
        saldoDiaPositivo: false,
      });
      continue;
    }

    const batidas: Batida[] = doDia.map((m) => ({ tipo: m.tipo, ts: Date.parse(m.registrado_em) }));
    const { min, incompleto } = minutosTrabalhados(batidas);
    trabalhadasMin += min;
    const saldo = min - JORNADA_PADRAO_MIN;

    let tone: BadgeTone;
    let texto: string;
    if (incompleto) {
      tone = 'pendente';
      texto = 'Incompleto';
    } else if (saldo > 0) {
      tone = 'extra';
      texto = 'Horas extras';
    } else if (saldo === 0) {
      tone = 'ok';
      texto = 'Completo';
    } else {
      tone = 'pendente';
      texto = 'Incompleto';
    }

    const line2Tone = saldo > 0 ? 'ok' : saldo < 0 ? 'falta' : 'neutro';
    dias.push({
      ...base,
      tipo: 'normal',
      hours: fmtDuracao(min),
      line2: saldo === 0 ? 'Jornada padrão' : `${fmtSaldo(saldo)} de saldo`,
      line2Tone,
      badge: { text: texto, tone },
      punches: doDia.map((m) => horaDeISO(m.registrado_em)),
      marcacoes: marcParaDetalhe(doDia),
      dataExtenso,
      resumoTag: `${texto} · Jornada padrão`,
      esperadas: fmtDuracao(JORNADA_PADRAO_MIN),
      saldoDia: fmtSaldo(saldo),
      saldoDiaPositivo: saldo >= 0,
    });
  }

  dias.reverse(); // mais recentes primeiro
  return { dias, trabalhadasMin, esperadasMin };
}

export async function getEspelho(ano?: number, mesIndex?: number): Promise<EspelhoResumo> {
  const hoje = new Date();
  if (ano === undefined) ano = hoje.getFullYear();
  if (mesIndex === undefined) mesIndex = hoje.getMonth();
  const { dias, trabalhadasMin, esperadasMin } = await computarMes(ano, mesIndex);

  cacheDias = {};
  for (const d of dias) cacheDias[d.id] = d;

  const saldo = trabalhadasMin - esperadasMin;
  const ultimoDiaMes = new Date(ano, mesIndex + 1, 0).getDate();
  return {
    mesLabel: `${MESES_LONGOS[mesIndex]} ${ano}`,
    periodo: `01 – ${pad(ultimoDiaMes)} ${MESES_LONGOS[mesIndex].slice(0, 3).toLowerCase()}`,
    trabalhadas: fmtDuracao(trabalhadasMin),
    esperadas: fmtDuracao(esperadasMin),
    saldoBanco: fmtSaldo(saldo),
    saldoPositivo: saldo >= 0,
    dias,
  };
}

export function getDia(id: string): DiaEspelho | undefined {
  return cacheDias[id];
}

export async function getBanco(): Promise<BancoResumo> {
  const hoje = new Date();
  const { dias, trabalhadasMin, esperadasMin } = await computarMes(hoje.getFullYear(), hoje.getMonth());
  const saldo = trabalhadasMin - esperadasMin;

  let creditos = 0;
  let debitos = 0;
  const movimentos: MovimentoBanco[] = [];
  for (const d of dias) {
    if (d.tipo === 'folga' || !d.saldoDia) continue;
    const min = saldoParaMin(d.saldoDia);
    if (min > 0) creditos += min;
    else if (min < 0) debitos += min;
    if (min !== 0) {
      movimentos.push({
        id: d.id,
        tipo: min > 0 ? 'credito' : 'debito',
        titulo: min > 0 ? 'Horas extras' : d.tipo === 'semRegistro' ? 'Falta' : 'Compensação',
        meta: (d.dataExtenso ?? d.id).replace('-feira', ''),
        valor: fmtSaldo(min),
      });
    }
  }

  return {
    saldo: fmtSaldo(saldo),
    saldoPositivo: saldo >= 0,
    atualizado: 'Atualizado hoje',
    creditosMes: fmtSaldo(creditos),
    debitosMes: fmtSaldo(debitos),
    movimentos,
  };
}

/** "+0h47"/"-8h00"/"0h00" -> minutos (com sinal). */
function saldoParaMin(s: string): number {
  const m = s.match(/^([+-]?)(\d+)h(\d+)$/);
  if (!m) return 0;
  const sinal = m[1] === '-' ? -1 : 1;
  return sinal * (parseInt(m[2], 10) * 60 + parseInt(m[3], 10));
}

export async function getMesesCartao(): Promise<MesCartao[]> {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mesIndex = hoje.getMonth();
  const idAtual = `${ano}-${pad(mesIndex + 1)}`;

  const [atual, cartao] = await Promise.all([computarMes(ano, mesIndex), fetchCartao(idAtual)]);
  const saldoAtual = atual.trabalhadasMin - atual.esperadasMin;
  const ultimoDiaMes = new Date(ano, mesIndex + 1, 0).getDate();
  const assinado = cartao?.status === 'assinado';

  return [
    {
      id: idAtual,
      mes: `${MESES_LONGOS[mesIndex]} ${ano}`,
      periodo: `01 – ${pad(ultimoDiaMes)} ${MESES_LONGOS[mesIndex].slice(0, 3).toLowerCase()}`,
      status: assinado ? 'assinado' : 'pendente',
      trabalhadas: fmtDuracao(atual.trabalhadasMin),
      saldo: fmtSaldo(saldoAtual),
      saldoPositivo: saldoAtual >= 0,
      alerta: assinado ? undefined : `Assinatura pendente até ${pad(ultimoDiaMes)}/${pad(mesIndex + 1)}/${ano}`,
    },
  ];
}

export async function getMesCartao(id: string): Promise<MesCartao | undefined> {
  const meses = await getMesesCartao();
  return meses.find((m) => m.id === id);
}

export type Carimbo = {
  assinadoEm: string;
  ip: string | null;
  latitude: number | null;
  longitude: number | null;
};

/** Carimbo da assinatura (data/IP/geo) da competência, ou null. */
export async function getCartaoCarimbo(competencia: string): Promise<Carimbo | null> {
  const c = await fetchCartao(competencia);
  if (!c || c.status !== 'assinado') return null;
  return { assinadoEm: c.assinado_em, ip: c.ip, latitude: c.latitude, longitude: c.longitude };
}

/**
 * Assina o cartão via Edge Function `assinar-cartao`, que grava o IP real (do
 * servidor) + geo no carimbo (tabela `cartoes`). A geo é best-effort (GPS do device).
 */
export async function assinarMes(competencia: string): Promise<void> {
  let latitude: number | null = null;
  let longitude: number | null = null;
  try {
    const g = await obterLocalizacao();
    if (g.status === 'ok') {
      latitude = g.loc.latitude;
      longitude = g.loc.longitude;
    }
  } catch {
    // sem geo — segue com null
  }
  await supabase.functions.invoke('assinar-cartao', { body: { competencia, latitude, longitude } });
}
