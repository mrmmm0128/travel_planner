import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, Phone } from 'lucide-react-native';

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const travelInterests = [
    { id: '1', title: 'グルメ・カフェ', icon: '☕️' },
    { id: '2', title: 'リラックス・温泉', icon: '♨️' },
    { id: '3', title: 'アクティビティ', icon: '🏄' },
    { id: '4', title: '絶景・観光', icon: '📸' },
    { id: '5', title: 'テーマパーク', icon: '🎢' },
    { id: '6', title: '歴史・文化', icon: '⛩️' },
  ];

  const handleToggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !fullName || !phone || selectedInterests.length === 0) {
      Alert.alert('エラー', 'すべての項目を入力・選択してください');
      return;
    }
    setLoading(true);
    
    // 1. Supabase Authでユーザー作成
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.log('SignUp error:', authError.message);
      Alert.alert('エラー', authError.message);
      setLoading(false);
      return;
    }

    // 2. ユーザー作成が成功したら、profilesテーブルにデータを保存
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            full_name: fullName,
            phone: phone,
            interests: selectedInterests,
          }
        ]);

      if (profileError) {
        console.log('Profile insert error:', profileError.message);
        Alert.alert('プロフィールの保存に失敗しました', profileError.message);
      }
      // authStateChangeがトリガーされ、自動的にMainAppへ遷移します
    }
    
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>はじめての旅へ</Text>
        <Text style={styles.subtitle}>アカウントを作成して、あなたにぴったりのプランナーを見つけましょう。</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>お名前 (姓名)</Text>
          <View style={styles.inputContainer}>
            <User size={20} color="#adb5bd" />
            <TextInput
              style={styles.input}
              placeholder="山田 太郎"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>電話番号</Text>
          <View style={styles.inputContainer}>
            <Phone size={20} color="#adb5bd" />
            <TextInput
              style={styles.input}
              placeholder="090-1234-5678"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

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
              placeholder="******** (6文字以上)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>興味のある旅行分野 (複数選択可)</Text>
          <View style={styles.interestsGrid}>
            {travelInterests.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.interestCard,
                  selectedInterests.includes(item.id) && styles.interestCardSelected
                ]}
                onPress={() => handleToggleInterest(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.interestIcon}>{item.icon}</Text>
                <Text style={[
                  styles.interestText,
                  selectedInterests.includes(item.id) && styles.interestTextSelected
                ]}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.signUpButton, 
            (!email || !password || !fullName || !phone || selectedInterests.length === 0 || loading) && styles.signUpButtonDisabled
          ]}
          onPress={handleSignUp}
          disabled={!email || !password || !fullName || !phone || selectedInterests.length === 0 || loading}
        >
          <Text style={styles.signUpButtonText}>{loading ? '登録中...' : 'アカウント作成'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>すでにアカウントをお持ちですか？ </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>ログイン</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
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
  signUpButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  signUpButtonDisabled: {
    backgroundColor: '#c4f0ed',
    shadowOpacity: 0,
    elevation: 0,
  },
  signUpButtonText: {
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
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '700',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interestCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  interestCardSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#e6fcfb',
  },
  interestIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  interestText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  interestTextSelected: {
    color: '#4ECDC4',
  },
});
