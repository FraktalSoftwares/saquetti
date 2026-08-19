import { supabase } from '../lib/supabase';
import { dataCurtaDeISO, diaLocalISO, horaCompletaDeISO, horaDeISO } from '../utils/datetime';
import type { Comprovante, LocalizacaoPonto, TipoMarcacao } from '../types';

/**
 * Registro de ponto (3.x) sobre a tabela real `marcacoes` (Supabase).
 * O `colaborador_id` é preenchido pelo default `auth.uid()` (RLS garante o dono).
 */

const UNIDADE_PADRAO = 'Unidade Centro — São Paulo/SP';

/** Limites UTC do dia local de hoje (−03). */
function limitesHoje(): { inicio: string; fim: string } {
  const hojeISO = diaLocalISO(new Date().toISOString());
  const inicioMs = Date.parse(`${hojeISO}T00:00:00Z`) + 3 * 3600 * 1000; // 03:00Z
  return {
    inicio: new Date(inicioMs).toISOString(),
    fim: new Date(inicioMs + 24 * 3600 * 1000).toISOString(),
  };
}

async function marcacoesHoje(): Promise<{ registrado_em: string; tipo: TipoMarcacao }[]> {
  const { inicio, fim } = limitesHoje();
  const { data, error } = await supabase
    .from('marcacoes')
    .select('registrado_em, tipo')
    .gte('registrado_em', inicio)
    .lt('registrado_em', fim)
    .order('registrado_em', { ascending: true });
  if (error || !data) return [];
  return data as { registrado_em: string; tipo: TipoMarcacao }[];
}

/** Próxima batida sugerida: alterna Entrada/Saída pela contagem de hoje. */
export async function getProximoTipo(): Promise<TipoMarcacao> {
  const hoje = await marcacoesHoje();
  return hoje.length % 2 === 0 ? 'Entrada' : 'Saída';
}

/** Última marcação de hoje (HH:MM) ou null. */
export async function getUltimaMarcacao(): Promise<string | null> {
  const hoje = await marcacoesHoje();
  if (!hoje.length) return null;
  return horaDeISO(hoje[hoje.length - 1].registrado_em);
}

export type RegistrarInput = {
  tipo: TipoMarcacao;
  localizacao: LocalizacaoPonto | null;
  fotoUri: string | null;
};

/** Envia a foto de verificação ao Storage (bucket `ponto-fotos/{uid}/...`). Retorna o caminho ou null. */
async function uploadFoto(fotoUri: string): Promise<string | null> {
  try {
    const uid = (await supabase.auth.getUser()).data.user?.id;
    if (!uid) return null;
    const bytes = await (await fetch(fotoUri)).arrayBuffer();
    const path = `${uid}/${new Date().getTime()}.jpg`;
    const { error } = await supabase.storage
      .from('ponto-fotos')
      .upload(path, bytes, { contentType: 'image/jpeg', upsert: false });
    return error ? null : path;
  } catch {
    return null; // falha de upload não bloqueia o registro
  }
}

export async function registrarPonto(input: RegistrarInput): Promise<Comprovante> {
  const loc = input.localizacao;
  const fotoUrl = input.fotoUri ? await uploadFoto(input.fotoUri) : null;
  const { data, error } = await supabase
    .from('marcacoes')
    .insert({
      tipo: input.tipo,
      latitude: loc?.latitude ?? null,
      longitude: loc?.longitude ?? null,
      precisao_m: loc?.precisao ?? null,
      endereco: loc?.logradouro ?? null,
      complemento: loc?.complemento ?? null,
      unidade: UNIDADE_PADRAO,
      foto_url: fotoUrl,
    })
    .select('id, registrado_em')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Falha ao registrar ponto');
  }

  const iso = data.registrado_em as string;
  return {
    id: data.id as string,
    tipo: input.tipo,
    registradoEm: iso,
    hora: horaCompletaDeISO(iso),
    dataExtenso: dataCurtaDeISO(iso),
    localizacao: input.localizacao,
    fotoUri: input.fotoUri,
  };
}
