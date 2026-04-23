import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { User, Camera } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileEditScreen() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const { signInMock } = useAuth(); // モックでログイン状態にする

  const travelStyles = [
    { id: '1', title: '映え＆カフェ巡り', icon: '☕️' },
    { id: '2', title: '子連れでリラックス', icon: '👶' },
    { id: '3', title: '効率よく観光したい', icon: '📸' },
    { id: '4', title: 'サウナ・温泉で整う', icon: '♨️' },
  ];

  const handleSave = () => {
    if (!name || !selectedStyle) return;
    
    // TODO: 実際のSupabase連携時はここでプロファイルテーブル(public.users)へINSERT/UPDATEする
    // 保存後、AuthContextのステートを変えてMainへ遷移させる
    signInMock();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>プロフィールを作成</Text>
        <Text style={styles.subtitle}>プランナーがあなたに最適な提案をするための情報を入力してください。</Text>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <User size={40} color="#adb5bd" />
          </View>
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>お名前 (ニックネーム)</Text>
          <TextInput
            style={styles.input}
            placeholder="例: トラベラー太郎"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>自己紹介・特記事項</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="例: アレルギーがあります / 窓側の席が好きです"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>今回希望する旅のスタイル</Text>
          <View style={styles.styleGrid}>
            {travelStyles.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.styleCard, selectedStyle === item.id && styles.styleCardSelected]}
                onPress={() => setSelectedStyle(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.styleIcon}>{item.icon}</Text>
                <Text style={[styles.styleText, selectedStyle === item.id && styles.styleTextSelected]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, (!name || !selectedStyle) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!name || !selectedStyle}
        >
          <Text style={styles.saveButtonText}>保存してはじめる</Text>
        </TouchableOpacity>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#343a40',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 30,
    lineHeight: 20,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: '#343a40',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  styleCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  styleCardSelected: {
    borderColor: '#FF6B6B',
    backgroundColor: '#fff5f5',
  },
  styleIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  styleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  styleTextSelected: {
    color: '#FF6B6B',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: '#ffc9c9',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
