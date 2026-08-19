import { supabase } from '../lib/supabase';
import { diaLocalISO, horaDeISO, mesLongo } from '../utils/datetime';
import type { Notificacao } from '../types';

/** Notificações (9.x) sobre a tabela real `notificacoes` (Supabase). */

type NotifRow = {
  id: string;
  tipo: 'warning' | 'success' | 'info';
  titulo: string;
  descricao: string | null;
  corpo: string | null;
  lida: boolean;
  acao_cartao: boolean;
  criado_em: string;
};

const cache: Record<string, Notificacao> = {};

/** Tempo relativo curto: "2m", "8h", "3d". */
function tempoRelativo(iso: string): string {
  const diffMin = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (diffMin < 60) return `${diffMin || 1}m`;
  const h = Math.round(diffMin / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

function dataLongaComHora(iso: string): string {
  const [y, m, d] = diaLocalISO(iso).split('-');
  return `${d} de ${mesLongo(parseInt(m, 10) - 1)} de ${y} · ${horaDeISO(iso)}`;
}

function mapRow(r: NotifRow): Notificacao {
  return {
    id: r.id,
    tipo: r.tipo,
    titulo: r.titulo,
    descricao: r.descricao ?? '',
    corpo: r.corpo ?? r.descricao ?? '',
    tempo: tempoRelativo(r.criado_em),
    data: dataLongaComHora(r.criado_em),
    lida: r.lida,
    acaoCartao: r.acao_cartao,
  };
}

export async function getNotificacoes(): Promise<Notificacao[]> {
  const { data, error } = await supabase
    .from('notificacoes')
    .select('id, tipo, titulo, descricao, corpo, lida, acao_cartao, criado_em')
    .order('criado_em', { ascending: false });
  if (error || !data) return [];
  const items = (data as NotifRow[]).map(mapRow);
  for (const n of items) cache[n.id] = n;
  return items;
}

export function getNotificacao(id: string): Notificacao | undefined {
  return cache[id];
}
