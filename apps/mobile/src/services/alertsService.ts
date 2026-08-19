import { getNotificacoes } from './notificacoesService';
import type { Alerta } from '../types';

/**
 * Alertas de Pendências (tela 2.2 / resumo na Home) — derivados das notificações reais.
 * [A DEFINIR] regras de detecção de pendências (atraso, marcação faltante, limites).
 */
export async function getAlertas(): Promise<Alerta[]> {
  const notifs = await getNotificacoes();
  return notifs.map((n) => ({
    id: n.id,
    tipo: n.tipo,
    titulo: n.titulo,
    descricao: n.descricao,
    tempo: n.tempo,
    lido: n.lida,
  }));
}
