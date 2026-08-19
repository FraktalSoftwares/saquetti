import { supabase } from '../lib/supabase';
import { minutosTrabalhados, JORNADA_PADRAO_MIN, type Batida } from '../lib/jornada';
import { dataLonga, diaLocalISO, horaDeISO } from '../utils/datetime';
import { getEspelho } from './espelhoService';
import type { ResumoHome } from '../types';

/**
 * Resumo da Home (RF-004/005/006) sobre dados reais:
 *  - Jornada de hoje: calculada das marcações de hoje.
 *  - Registro de ponto: dias trabalhados recentes (do espelho do mês).
 */

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

  const registros = espelho.dias
    .filter((d) => d.tipo === 'normal')
    .slice(0, 5)
    .map((d) => ({
      id: d.id,
      rotulo: (d.dataExtenso ?? d.id).replace('-feira', ''),
      totalMarcacoes: d.marcacoes.length,
      trabalhado: d.hours ?? '—',
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
