import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock } from 'lucide-react-native';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInMock } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    
    // 実際のSupabase連携
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
       console.log('Login error:', error.message);
       // モックアプリ用の救済措置: Supabaseの設定がない場合は強制ログインする
       if (error.message.includes('URL') || error.message.includes('fetch')) {
         Alert.alert('テストログイン', 'Supabaseキーが未設定のため、テストユーザーとしてログインします。');
         signInMock();
       } else {
         Alert.alert('エラー', error.message);
       }
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>おかえりなさい</Text>
        <Text style={styles.subtitle}>JourneyMatchで、次の旅の相談を再開しましょう。</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>メールアドレス</Text>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#adb5bd" />
            <TextInput
              style={styles.input}
              placeholder="example@mail.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>パスワード</Text>
          <View style={styles.inputContainer}>
            <Lock size={20} color="#adb5bd" />
            <TextInput
              style={styles.input}
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, (!email || !password || loading) && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={!email || !password || loading}
        >
          <Text style={styles.loginButtonText}>{loading ? 'ログイン中...' : 'ログイン'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>アカウントをお持ちでないですか？ </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.linkText}>新規登録</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#343a40',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 40,
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#343a40',
  },
  loginButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#ffc9c9',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#6c757d',
    fontSize: 14,
  },
  linkText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '700',
  },
});
