import { supabase } from '../lib/supabase';
import { dataLonga, diaLocalISO, horaDeISO } from '../utils/datetime';
import type { BadgeTone, EventoSolicitacao, Solicitacao, StatusSolicitacao } from '../types';

/**
 * Solicitações (5.x / 4.4) sobre a tabela real `solicitacoes` (Supabase).
 * A timeline (eventos) é derivada de `status` + `criado_em`.
 */

type SolicRow = {
  id: string;
  tipo: string;
  status: StatusSolicitacao;
  data_ref: string; // YYYY-MM-DD
  horario: string | null;
  motivo: string | null;
  criado_em: string;
};

const pad = (n: number) => String(n).padStart(2, '0');
const cache: Record<string, Solicitacao> = {};

export function badgeToneStatus(status: StatusSolicitacao): BadgeTone {
  if (status === 'Aprovada') return 'ok';
  if (status === 'Recusada') return 'falta';
  return 'pendente';
}

function ddmmyyyy(dataRef: string): string {
  const [y, m, d] = dataRef.split('-');
  return `${d}/${m}/${y}`;
}

function eventos(status: StatusSolicitacao, criadoIso: string): EventoSolicitacao[] {
  const dia = diaLocalISO(criadoIso);
  const quando = `${ddmmyyyy(dia)} · ${horaDeISO(criadoIso)}`;
  const enviado: EventoSolicitacao = { label: 'Solicitação enviada', quando, estado: 'done' };
  if (status === 'Aprovada') return [enviado, { label: 'Aprovada pelo gestor', quando: '—', estado: 'done' }];
  if (status === 'Recusada') return [enviado, { label: 'Recusada pelo gestor', quando: '—', estado: 'done' }];
  return [enviado, { label: 'Em análise pelo gestor', quando: '—', estado: 'current' }];
}

function mapRow(r: SolicRow): Solicitacao {
  const dataDate = new Date(`${r.data_ref}T12:00:00`);
  return {
    id: r.id,
    tipo: r.tipo,
    status: r.status,
    data: dataLonga(dataDate),
    dataResumo: ddmmyyyy(r.data_ref),
    horario: r.horario ?? undefined,
    motivo: r.motivo ?? undefined,
    eventos: eventos(r.status, r.criado_em),
  };
}

export async function getSolicitacoes(): Promise<Solicitacao[]> {
  const { data, error } = await supabase
    .from('solicitacoes')
    .select('id, tipo, status, data_ref, horario, motivo, criado_em')
    .order('criado_em', { ascending: false });
  if (error || !data) return [];
  const items = (data as SolicRow[]).map(mapRow);
  for (const s of items) cache[s.id] = s;
  return items;
}

export function getSolicitacao(id: string): Solicitacao | undefined {
  return cache[id];
}

export type NovaSolicitacaoInput = {
  tipo: string;
  dataRef: Date;
  horario?: string;
  motivo?: string;
  periodo?: string;
  observacao?: string;
  /** Comprovante escolhido pelo trabalhador (4.4). */
  anexo?: AnexoLocal | null;
};

/** Arquivo selecionado no aparelho, antes do upload. */
export type AnexoLocal = {
  uri: string;
  nome: string;
  mimeType: string | null;
  tamanho: number | null;
};

export const ANEXO_TAMANHO_MAX = 10 * 1024 * 1024; // 10 MB
const BUCKET_COMPROVANTES = 'comprovantes';

/**
 * Sobe o comprovante para o bucket privado e devolve o caminho salvo em
 * `solicitacoes.anexo_url`. Retorna `undefined` se o upload falhar, para que a
 * solicitacao nao seja criada dando a impressao de que o documento foi junto.
 */
async function uploadAnexo(anexo: AnexoLocal): Promise<string | undefined> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return undefined;

  try {
    const resp = await fetch(anexo.uri);
    const bytes = await resp.arrayBuffer();
    const ext = anexo.nome.includes('.') ? anexo.nome.split('.').pop() : 'bin';
    const caminho = `${uid}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET_COMPROVANTES)
      .upload(caminho, bytes, { contentType: anexo.mimeType ?? 'application/octet-stream' });
    if (error) return undefined;
    return caminho;
  } catch {
    return undefined;
  }
}

export async function addSolicitacao(input: NovaSolicitacaoInput): Promise<Solicitacao | null> {
  const d = input.dataRef;
  const dataRef = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  // Sobe o comprovante ANTES de inserir: se o upload falhar, abortamos em vez de
  // registrar uma justificativa sem o documento que o trabalhador anexou.
  let anexoUrl: string | null = null;
  if (input.anexo) {
    const caminho = await uploadAnexo(input.anexo);
    if (!caminho) return null;
    anexoUrl = caminho;
  }

  const { data, error } = await supabase
    .from('solicitacoes')
    .insert({
      tipo: input.tipo,
      data_ref: dataRef,
      horario: input.horario ?? null,
      motivo: input.motivo ?? null,
      periodo: input.periodo ?? null,
      observacao: input.observacao ?? null,
      anexo_url: anexoUrl,
    })
    .select('id, tipo, status, data_ref, horario, motivo, criado_em')
    .single();
  if (error || !data) return null;
  const s = mapRow(data as SolicRow);
  cache[s.id] = s;
  return s;
}
