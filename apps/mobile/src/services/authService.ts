import { supabase } from '../lib/supabase';
import { cpfToEmail } from '../utils/cpf';
import type { Colaborador, ServiceResult } from '../types';

/**
 * Camada de autenticacao (RF-001, RF-002, RF-003) sobre o Supabase Auth.
 * O trabalhador loga com CPF; internamente usamos o e-mail sintetico {digitos}@saquetti.app.
 */

function mapColaborador(row: any): Colaborador {
  return {
    id: row.id,
    cpf: row.cpf,
    nomeCompleto: row.nome_completo,
    statusAcesso: row.status_acesso,
    capturarFoto: row.capturar_foto ?? true,
    capturarGps: row.capturar_gps ?? true,
    telefone: row.telefone ?? null,
    email: row.email ?? null,
    matricula: row.matricula ?? null,
    cargo: row.cargo ?? null,
    departamento: row.departamento ?? null,
    fotoPerfil: row.foto_perfil ?? null,
  };
}

export type ColaboradorFetch =
  | { status: 'ok'; colaborador: Colaborador }
  | { status: 'none' } // autenticado, mas sem registro de colaborador
  | { status: 'error' }; // falha de rede/consulta

/**
 * Busca o registro de colaborador do usuario autenticado, distinguindo
 * "sem cadastro" de "falha de consulta" (importante para nao deslogar por engano).
 */
const CAMPOS_BASE =
  'id, cpf, nome_completo, status_acesso, capturar_foto, capturar_gps, telefone, email, matricula, cargo, departamento';

export async function fetchColaborador(): Promise<ColaboradorFetch> {
  // `foto_perfil` é opcional: se a migração ainda não rodou no ambiente, a consulta
  // falharia e derrubaria a sessão. Tentamos com a coluna e caímos para o conjunto
  // base — o login nunca depende de um campo acessório.
  let { data, error } = await supabase
    .from('colaboradores')
    .select(`${CAMPOS_BASE}, foto_perfil`)
    .maybeSingle();

  if (error) {
    ({ data, error } = await supabase.from('colaboradores').select(CAMPOS_BASE).maybeSingle());
  }

  if (error) return { status: 'error' };
  if (!data) return { status: 'none' };
  return { status: 'ok', colaborador: mapColaborador(data) };
}

/**
 * RF-001: login com CPF e senha. Apenas autentica — a validacao do perfil
 * (existe? Ativo?) e feita de forma centralizada no AuthContext, evitando
 * corridas entre este fluxo e o listener de sessao.
 */
export async function login(cpf: string, senha: string): Promise<ServiceResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: cpfToEmail(cpf),
    password: senha,
  });
  if (error) {
    // Nao vazamos qual campo falhou (RF-001: "CPF ou senha inválidos").
    return { ok: false, error: 'CPF ou senha inválidos', code: error.status?.toString() };
  }
  return { ok: true, data: undefined };
}

/**
 * RF-002: solicita recuperacao de senha via CPF.
 * [A DEFINIR] Canal do codigo (SMS/e-mail) e fluxo de verificacao por codigo de 6 digitos
 * nao estao definidos no discovery. Aqui usamos o reset por e-mail do Supabase como
 * mecanismo real; a etapa de codigo deve ser definida com o time.
 */
export async function solicitarRecuperacao(cpf: string): Promise<ServiceResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(cpfToEmail(cpf));
  if (error) {
    return { ok: false, error: 'Não foi possível enviar o código. Tente novamente.' };
  }
  return { ok: true, data: undefined };
}

/**
 * RF-003: redefine a senha do usuario.
 * Requer uma sessao de recuperacao ativa (via link enviado por e-mail).
 * [A DEFINIR] A verificacao por codigo antes desta etapa depende de definicao do fluxo.
 */
export async function redefinirSenha(novaSenha: string): Promise<ServiceResult> {
  const { error } = await supabase.auth.updateUser({ password: novaSenha });
  if (error) {
    return {
      ok: false,
      error: 'Não foi possível redefinir a senha. Reabra o link de recuperação e tente novamente.',
    };
  }
  return { ok: true, data: undefined };
}

/**
 * Altera a senha do usuário logado (tela 8.2), validando a senha atual por
 * reautenticação (o updateUser do Supabase não a verifica sozinho).
 */
export async function alterarSenha(
  cpf: string,
  senhaAtual: string,
  novaSenha: string,
): Promise<ServiceResult> {
  // Reautentica para confirmar a senha atual (mesmo usuário → apenas renova a sessão).
  const { error: reauthErr } = await supabase.auth.signInWithPassword({
    email: cpfToEmail(cpf),
    password: senhaAtual,
  });
  if (reauthErr) return { ok: false, error: 'Senha atual incorreta.' };

  const { error } = await supabase.auth.updateUser({ password: novaSenha });
  if (error) return { ok: false, error: 'Não foi possível alterar a senha. Tente novamente.' };
  return { ok: true, data: undefined };
}

/**
 * Tela 8.1: atualiza os dados de CONTATO do próprio colaborador (e-mail/telefone).
 * O grant de UPDATE por coluna + RLS por dono garantem que só esses campos e só a
 * própria linha podem ser alterados.
 */
export async function atualizarContato(
  colaboradorId: string,
  email: string,
  telefone: string,
): Promise<ServiceResult> {
  const { error } = await supabase
    .from('colaboradores')
    .update({ email: email.trim() || null, telefone: telefone.trim() || null })
    .eq('id', colaboradorId);
  if (error) return { ok: false, error: 'Não foi possível salvar seus dados. Tente novamente.' };
  return { ok: true, data: undefined };
}

const BUCKET_AVATARES = 'avatares';
export const FOTO_PERFIL_TAMANHO_MAX = 5 * 1024 * 1024; // 5 MB

/**
 * Tela 8.1: sobe a foto de perfil escolhida pelo trabalhador e grava o caminho em
 * `colaboradores.foto_perfil`. Usa um nome fixo por usuário (`{uid}/avatar.<ext>`)
 * com upsert, para a troca substituir o arquivo em vez de acumular lixo no bucket.
 */
export async function atualizarFotoPerfil(
  colaboradorId: string,
  uri: string,
  mimeType: string | null,
): Promise<ServiceResult> {
  try {
    const resp = await fetch(uri);
    const bytes = await resp.arrayBuffer();
    if (bytes.byteLength > FOTO_PERFIL_TAMANHO_MAX)
      return { ok: false, error: 'A imagem deve ter no máximo 5 MB.' };

    const tipo = mimeType ?? 'image/jpeg';
    const ext = tipo.includes('png') ? 'png' : 'jpg';
    const caminho = `${colaboradorId}/avatar.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET_AVATARES)
      .upload(caminho, bytes, { contentType: tipo, upsert: true });
    if (upErr) return { ok: false, error: 'Não foi possível enviar a imagem. Tente novamente.' };

    const { error } = await supabase
      .from('colaboradores')
      .update({ foto_perfil: caminho })
      .eq('id', colaboradorId);
    if (error) return { ok: false, error: 'Imagem enviada, mas não foi possível salvar. Tente novamente.' };

    invalidarFotoPerfil(caminho);
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: 'Não foi possível enviar a imagem. Tente novamente.' };
  }
}

// O bucket é privado, então a exibição depende de URL assinada. Guardamos em cache
// para não pedir uma assinatura nova a cada montagem do Avatar (ele aparece em 5 telas).
const cacheUrls: Record<string, { url: string; expiraEm: number }> = {};
const VALIDADE_S = 60 * 60;

export function invalidarFotoPerfil(caminho: string): void {
  delete cacheUrls[caminho];
}

/** URL temporária para exibir a foto de perfil, ou null se não houver/falhar. */
export async function urlFotoPerfil(caminho: string | null): Promise<string | null> {
  if (!caminho) return null;
  const cache = cacheUrls[caminho];
  if (cache && cache.expiraEm > Date.now()) return cache.url;

  const { data, error } = await supabase.storage
    .from(BUCKET_AVATARES)
    .createSignedUrl(caminho, VALIDADE_S);
  if (error || !data?.signedUrl) return null;

  // Renova um pouco antes de expirar, para não exibir imagem quebrada.
  cacheUrls[caminho] = { url: data.signedUrl, expiraEm: Date.now() + (VALIDADE_S - 300) * 1000 };
  return data.signedUrl;
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}
