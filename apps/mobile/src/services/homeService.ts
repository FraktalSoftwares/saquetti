import { supabase } from '../lib/supabase';
import { minutosTrabalhados, JORNADA_PADRAO_MIN, type Batida } from '../lib/jornada';
import { dataLonga, diaLocalISO, horaDeISO } from '../utils/datetime';
import { getEspelho } from './espelhoService';
import type { BadgeTone, ResumoHome, StatusRegistro } from '../types';

/**
 * Resumo da Home (RF-004/005/006) sobre dados reais:
 *  - Jornada de hoje: calculada das marcações de hoje.
 *  - Registro de ponto: dias trabalhados recentes (do espelho do mês).
 */

/** Traduz o badge do espelho para a situação usada no filtro da Home. */
function statusDoDia(tone: BadgeTone): StatusRegistro {
  if (tone === 'falta') return 'falta';
  if (tone === 'pendente') return 'incompleto';
  return 'completo'; // 'ok' e 'extra': jornada fechada, com ou sem horas extras
}

const JANELA = '08:00 – 17:00'; // [A DEFINIR: virá da Escala]

async function marcacoesHoje() {
  const hojeISO = diaLocalISO(new Date().toISOString());
  const inicioMs = Date.parse(`${hojeISO}T00:00:00Z`) + 3 * 3600 * 1000;
  const { data } = await supabase
    .from('marcacoes')
    .select('registrado_em, tipo, unidade')
    .gte('registrado_em', new Date(inicioMs).toISOString())
    .lt('registrado_em', new Date(inicioMs + 24 * 3600 * 1000).toISOString())
    .order('registrado_em', { ascending: true });
  return data ?? [];
}

export async function getResumoHome(nomeColaborador: string): Promise<ResumoHome> {
  const [hoje, espelho, notifCount] = await Promise.all([
    marcacoesHoje(),
    getEspelho(),
    supabase
      .from('notificacoes')
      .select('id', { count: 'exact', head: true })
      .eq('lida', false),
  ]);

  const ultimoPonto = hoje.length ? horaDeISO(hoje[hoje.length - 1].registrado_em) : null;
  const batidas: Batida[] = hoje.map((m) => ({ tipo: m.tipo as Batida['tipo'], ts: Date.parse(m.registrado_em) }));
  const trabalhado = minutosTrabalhados(batidas).min;
  const progresso = Math.min(1, trabalhado / JORNADA_PADRAO_MIN);

  // Folgas ficam de fora (não há jornada a mostrar); faltas entram, senão o
  // filtro por situação nunca teria o que exibir.
  //
  // Exceção: quem não tem NENHUMA marcação no mês não pode ser acusado de faltar
  // — pode ter sido cadastrado agora. Sem data de admissão no cadastro não há como
  // distinguir, então nesse caso a lista fica vazia e a Home mostra o estado inicial.
  const temHistorico = espelho.dias.some((d) => d.marcacoes.length > 0);
  const registros = (temHistorico ? espelho.dias.filter((d) => d.tipo !== 'folga') : [])
    .slice(0, 10)
    .map((d) => ({
      id: d.id,
      rotulo: (d.dataExtenso ?? d.id).replace('-feira', ''),
      totalMarcacoes: d.marcacoes.length,
      trabalhado: d.hours ?? '—',
      status: statusDoDia(d.badge.tone),
      marcacoes: d.marcacoes.map((m, i) => ({ ordem: i + 1, hora: m.hora ?? '--:--', unidade: m.local })),
    }));

  return {
    colaboradorNome: nomeColaborador,
    dataExtenso: dataLonga(new Date()),
    qtdPendencias: notifCount.count ?? 0,
    jornada: {
      janela: JANELA,
      ultimoPonto,
      proximoPonto: ultimoPonto ? '17:00' : null,
      progresso,
    },
    registros,
  };
}
