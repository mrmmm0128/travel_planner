import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInMock: () => void; // モック動作用の仮サインイン
  signOutMock: () => void; // モック動作用の仮サインアウト
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signInMock: () => {},
  signOutMock: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 初期のセッション取得と購読
  useEffect(() => {
    // 実際のSupabase連携が設定されるまでの間、エラーを出さないようにtry-catch
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }).catch((error) => {
        console.log('Supabase config error: ', error);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } catch (e) {
      console.log('Setup Supabase keys in src/lib/supabase.ts');
      setLoading(false);
    }
  }, []);

  // UI確認用のモック関数（Supabaseのキーを入れる前に画面遷移を確認するためのもの）
  const signInMock = () => {
    setSession({} as Session);
    setUser({ id: 'dummy-user', email: 'test@example.com' } as User);
  };

  const signOutMock = () => {
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signInMock, signOutMock }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
