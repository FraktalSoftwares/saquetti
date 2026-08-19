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
export async function fetchColaborador(): Promise<ColaboradorFetch> {
  const { data, error } = await supabase
    .from('colaboradores')
    .select(
      'id, cpf, nome_completo, status_acesso, capturar_foto, capturar_gps, telefone, email, matricula, cargo, departamento',
    )
    .maybeSingle();
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

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}
