import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { fetchColaborador } from '../services/authService';
import type { Colaborador } from '../types';

type AuthContextValue = {
  /** true enquanto verificamos a sessao inicial (mostra a Splash). */
  initializing: boolean;
  /** true enquanto validamos o perfil de uma sessao ja existente. */
  profileLoading: boolean;
  session: Session | null;
  colaborador: Colaborador | null;
  /** Mensagem para exibir no Login apos um logout involuntario (sem cadastro / inativo). */
  authError: string | null;
  clearAuthError: () => void;
  /** Recarrega o perfil (ex.: após editar o contato em 8.1). */
  refreshColaborador: () => Promise<void>;
  /**
   * true quando a sessao atual veio do link de recuperacao de senha. A sessao e
   * valida, entao sem esta flag o app entraria direto na Home e o usuario nunca
   * chegaria a tela 1.4 para definir a nova senha.
   */
  recoveryMode: boolean;
  clearRecoveryMode: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const activeRef = useRef(true);

  /**
   * Valida a sessao de forma centralizada. Se ha sessao mas o perfil nao existe
   * ou esta inativo, registramos a mensagem e deslogamos (uma unica vez, aqui).
   */
  const validate = async (current: Session | null) => {
    if (!current) {
      setColaborador(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    const result = await fetchColaborador();
    if (!activeRef.current) return;

    if (result.status === 'ok' && result.colaborador.statusAcesso === 'Ativo') {
      setColaborador(result.colaborador);
      setAuthError(null);
      setProfileLoading(false);
      return;
    }

    // Estados que impedem o acesso: sem cadastro, inativo ou falha de consulta.
    setColaborador(null);
    if (result.status === 'none') {
      setAuthError('Não encontramos seu cadastro. Fale com o RH.');
    } else if (result.status === 'ok') {
      setAuthError('Seu acesso foi desativado. Fale com o RH.');
    } else {
      setAuthError('Não foi possível carregar seu perfil. Tente novamente.');
    }
    setProfileLoading(false);
    await supabase.auth.signOut(); // dispara onAuthStateChange -> validate(null)
  };

  const refreshColaborador = async () => {
    const result = await fetchColaborador();
    if (activeRef.current && result.status === 'ok') setColaborador(result.colaborador);
  };

  useEffect(() => {
    activeRef.current = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!activeRef.current) return;
      setSession(data.session);
      await validate(data.session);
      setInitializing(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, next) => {
      // A sessão inicial já é tratada por getSession() acima; evita validar/deslogar em dobro.
      if (event === 'INITIAL_SESSION') return;
      // Sessão aberta pelo link de recuperação: precisa passar pela tela 1.4.
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
      if (event === 'SIGNED_OUT') setRecoveryMode(false);
      setSession(next);
      await validate(next);
    });

    return () => {
      activeRef.current = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      initializing,
      profileLoading,
      session,
      colaborador,
      authError,
      clearAuthError: () => setAuthError(null),
      refreshColaborador,
      recoveryMode,
      clearRecoveryMode: () => setRecoveryMode(false),
    }),
    [initializing, profileLoading, session, colaborador, authError, recoveryMode],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
