import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

let seq = 0;

/**
 * Assina mudanças (INSERT/UPDATE/DELETE) de uma tabela via Supabase Realtime e
 * chama `onChange` a cada evento. O RLS garante que só chegam linhas do próprio
 * colaborador. Usa um ref para `onChange` para evitar re-subscrição a cada render.
 */
export function useRealtime(table: string, onChange: () => void): void {
  const cbRef = useRef(onChange);
  cbRef.current = onChange;

  useEffect(() => {
    seq += 1;
    const canal = supabase
      .channel(`rt-${table}-${seq}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => cbRef.current())
      .subscribe();
    return () => {
      supabase.removeChannel(canal);
    };
  }, [table]);
}
