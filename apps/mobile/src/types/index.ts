/** Tipos de dominio do app do Trabalhador. */

export type Colaborador = {
  id: string;
  cpf: string;
  nomeCompleto: string;
  statusAcesso: 'Ativo' | 'Inativo';
  /** RF-008: aciona câmera antes de confirmar o registro. */
  capturarFoto: boolean;
  /** RF-007: exige GPS no registro de ponto. */
  capturarGps: boolean;
  // Perfil (tela 8.1). Contato é editável pelo trabalhador; o resto vem do gestor.
  telefone: string | null;
  email: string | null;
  matricula: string | null;
  cargo: string | null;
  departamento: string | null;
};

// ----- Registro de Ponto (3.x) -----

export type TipoMarcacao = 'Entrada' | 'Saída';

export type LocalizacaoPonto = {
  latitude: number;
  longitude: number;
  /** Precisão do GPS em metros. */
  precisao: number | null;
  /** Linha 1 do endereço (ex.: "Rua das Flores, 120"). */
  logradouro: string;
  /** Linha 2 (ex.: "Bela Vista, São Paulo – SP"). */
  complemento: string;
};

export type Comprovante = {
  id: string;
  tipo: TipoMarcacao;
  /** ISO timestamp do registro. */
  registradoEm: string;
  /** HH:mm:ss para exibição. */
  hora: string;
  /** Ex.: "Seg, 08 de junho". */
  dataExtenso: string;
  localizacao: LocalizacaoPonto | null;
  fotoUri: string | null;
};

/** Resultado padronizado das operacoes de servico. */
export type ServiceResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

// ----- Home / Jornada -----

export type Marcacao = {
  ordem: number;
  hora: string; // HH:mm
  unidade: string;
};

export type RegistroDia = {
  id: string;
  /** Ex.: "Sexta, 06 de junho" */
  rotulo: string;
  totalMarcacoes: number;
  /** Ex.: "8h47" */
  trabalhado: string;
  marcacoes: Marcacao[];
};

export type StatusJornada = {
  /** Ex.: "08:00 – 17:00" */
  janela: string;
  ultimoPonto: string | null; // HH:mm
  proximoPonto: string | null; // HH:mm
  /** 0..1 para a barra de progresso */
  progresso: number;
};

export type ResumoHome = {
  colaboradorNome: string;
  dataExtenso: string; // Ex.: "Segunda-feira, 08 de Junho"
  jornada: StatusJornada;
  registros: RegistroDia[];
  qtdPendencias: number;
};

// ----- Espelho / Banco / Cartão (4.x) -----

export type BadgeTone = 'ok' | 'extra' | 'falta' | 'folga' | 'pendente' | 'neutro';

export type MarcacaoDetalhe = {
  label: string; // ex.: "1ª marcação (Entrada)"
  local: string;
  hora: string | null; // null = faltante (X)
};

export type DiaEspelho = {
  id: string; // chave do dia "YYYY-MM-DD"
  dataISO: string; // "YYYY-MM-DD"
  dia: string; // "06"
  wd: string; // "SEX"
  tipo: 'normal' | 'folga' | 'semRegistro';
  hours?: string; // "8h47"
  line2?: string; // "+0h47" ou motivo
  line2Tone?: 'ok' | 'falta' | 'neutro';
  badge: { text: string; tone: BadgeTone };
  punches: (string | null)[]; // horários; null = X
  marcacoes: MarcacaoDetalhe[];
  // Detalhamento do dia (4.1)
  dataExtenso?: string; // "Sexta, 06 de junho"
  resumoTag?: string; // "Horas extras · Jornada padrão"
  esperadas?: string; // "8h00"
  saldoDia?: string; // "+0h47"
  saldoDiaPositivo?: boolean;
};

export type EspelhoResumo = {
  mesLabel: string; // "Junho 2026"
  periodo: string; // "01 – 30 jun"
  trabalhadas: string; // "146h30"
  esperadas: string; // "140h00"
  saldoBanco: string; // "+6h30"
  saldoPositivo: boolean;
  dias: DiaEspelho[];
};

export type MovimentoBanco = {
  id: string;
  tipo: 'credito' | 'debito';
  titulo: string;
  meta: string;
  valor: string; // "+0h47"
};

export type BancoResumo = {
  saldo: string; // "+6h20"
  saldoPositivo: boolean;
  atualizado: string; // "Atualizado hoje · 07:30"
  creditosMes: string; // "+9h05"
  debitosMes: string; // "-2h45"
  movimentos: MovimentoBanco[];
};

export type MesCartao = {
  id: string;
  mes: string; // "Junho 2026"
  periodo: string; // "01 – 30 jun"
  status: 'pendente' | 'assinado';
  trabalhadas: string;
  saldo: string;
  saldoPositivo: boolean;
  alerta?: string;
};

// ----- Solicitações (5.x) / Justificativas (4.4) -----

export type StatusSolicitacao = 'Pendente' | 'Em análise' | 'Aprovada' | 'Recusada';

export type EventoSolicitacao = {
  label: string;
  quando: string;
  estado: 'done' | 'current' | 'pending';
};

export type Solicitacao = {
  id: string;
  tipo: string; // "Ajuste de entrada", "Justificativa de ausência"
  status: StatusSolicitacao;
  data: string; // "03 de junho de 2026"
  dataResumo: string; // "03/06/2026" (lista)
  horario?: string; // "08:00"
  motivo?: string;
  eventos: EventoSolicitacao[];
};

// ----- Notificações (9.x) -----

export type Notificacao = {
  id: string;
  tipo: 'warning' | 'success' | 'info';
  titulo: string;
  descricao: string;
  tempo: string; // "2m", "1h", "3d"
  data: string; // "08 de junho de 2026 · 09:39"
  corpo: string;
  lida: boolean;
  acaoCartao?: boolean; // exibe "Ir para o cartão ponto"
};

// ----- Alertas / Pendencias -----

export type TipoAlerta = 'warning' | 'success' | 'info';

export type Alerta = {
  id: string;
  tipo: TipoAlerta;
  titulo: string;
  descricao: string;
  /** Ex.: "2m", "8h", "3d" */
  tempo: string;
  lido: boolean;
};
