import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { User, Heart, LogOut, Phone, Map } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOutMock } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  const travelInterestsMap: Record<string, string> = {
    '1': 'グルメ・カフェ',
    '2': 'リラックス・温泉',
    '3': 'アクティビティ',
    '4': '絶景・観光',
    '5': 'テーマパーク',
    '6': '歴史・文化',
  };

  useEffect(() => {
    if (user && user.id !== 'dummy-user') {
      fetchProfile();
    } else if (user?.id === 'dummy-user') {
      // モックユーザー表示用
      setProfile({
        full_name: 'トラベラー太郎',
        phone: '090-1234-5678',
        interests: ['1', '4', '6']
      });
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.log('Error fetching profile', err);
    }
  };

  const handleLogout = async () => {
    Alert.alert('ログアウト', '本当にログアウトしますか？', [
      { text: 'キャンセル', style: 'cancel' },
      { 
        text: 'ログアウト', 
        style: 'destructive',
        onPress: async () => {
          // モックユーザーかどうか判定
          if (user?.id === 'dummy-user') {
            signOutMock();
          } else {
            await supabase.auth.signOut();
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>マイページ</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <User size={36} color="#adb5bd" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{profile?.full_name || (user?.email ? user.email.split('@')[0] : 'トラベラー')}さん</Text>
            <Text style={styles.userEmail}>{user?.email || 'test@example.com'}</Text>
            {profile?.phone && (
              <Text style={styles.userPhone}>{profile.phone}</Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('ProfileEdit')}
          >
            <Text style={styles.editButtonText}>編集</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>興味のある分野</Text>
          <View style={styles.tagsContainer}>
            {profile?.interests?.map((id: string) => (
              <View key={id} style={styles.tag}>
                <Text style={styles.tagText}>{travelInterestsMap[id] || id}</Text>
              </View>
            ))}
            {(!profile?.interests || profile.interests.length === 0) && (
              <Text style={styles.noDataText}>登録されていません</Text>
            )}
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>アクティビティ</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#ffe3e3' }]}>
              <Heart size={20} color="#FF6B6B" />
            </View>
            <Text style={styles.menuText}>お気に入りプラン</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF6B6B" />
          <Text style={styles.logoutButtonText}>ログアウト</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#343a40',
  },
  iconButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#868e96',
  },
  userPhone: {
    fontSize: 13,
    color: '#adb5bd',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e6fcfb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  tagText: {
    fontSize: 13,
    color: '#1098ad',
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 14,
    color: '#adb5bd',
  },
  editButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  menuSection: {
    marginBottom: 40,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 15,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#495057',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5f5',
    paddingVertical: 16,
    borderRadius: 16,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6B6B',
    marginLeft: 8,
  },
});
