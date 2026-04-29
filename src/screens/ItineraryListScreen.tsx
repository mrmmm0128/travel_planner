import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Calendar, Users, Plus, Edit2, Globe } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function ItineraryListScreen({ navigation }: any) {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchItineraries = useCallback(async () => {
    if (!user || user.id === 'dummy-user') {
      setItineraries([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('itineraries')
        .select(`
          id,
          title,
          created_at,
          is_public,
          itinerary_days (
            events (
              image_url
            )
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map((item: any) => {
        // 画像は最初の日の最初のイベントから取得、なければフォールバック
        const firstEventImage = item.itinerary_days?.[0]?.events?.[0]?.image_url;
        
        return {
          id: item.id,
          title: item.title,
          date: item.created_at ? new Date(item.created_at).toLocaleDateString() : '未設定',
          image: firstEventImage || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=600&auto=format&fit=crop',
          members: 1, // 概算値
          days: 1,    // 概算値
          isPublic: item.is_public,
        };
      });

      setItineraries(formattedData);
    } catch (err) {
      console.error('Error fetching itineraries:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchItineraries();
    }, [fetchItineraries])
  );

  const togglePublicStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('itineraries')
        .update({ is_public: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      setItineraries(prev => prev.map(item => item.id === id ? { ...item, isPublic: !currentStatus } : item));
    } catch (err) {
      console.error('Error updating public status:', err);
      Alert.alert('エラー', '公開状態の変更に失敗しました');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Itinerary', { itineraryId: item.id, title: item.title })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardOverlay} />
      
      <View style={styles.cardContent}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{item.days} Days</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.infoGroup}>
            <View style={styles.infoRow}>
              <Calendar size={14} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.infoText}>{item.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Users size={14} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.infoText}>{item.members}人</Text>
            </View>
          </View>
          
          <View style={styles.actionGroup}>
            <TouchableOpacity 
              style={[styles.actionBtn, item.isPublic && styles.actionBtnActive]}
              onPress={() => togglePublicStatus(item.id, item.isPublic)}
            >
              <Globe size={12} color={item.isPublic ? '#FFFFFF' : '#adb5bd'} />
              <Text style={[styles.actionBtnText, item.isPublic && styles.actionBtnTextActive]}>
                {item.isPublic ? '公開中' : '公開する'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionBtnEdit}
              onPress={() => navigation.navigate('EditItinerary', { itineraryData: null })}
            >
              <Edit2 size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>旅のしおり</Text>
        <Text style={styles.headerSubtitle}>予定されている旅行</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <FlatList
          data={itineraries}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: '#adb5bd' }}>しおりがありません。新しく作成しましょう！</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateItinerary')}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#343a40',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#868e96',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  infoGroup: {
    flex: 1,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  actionBtnActive: {
    backgroundColor: '#4ECDC4',
  },
  actionBtnText: {
    color: '#adb5bd',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  actionBtnTextActive: {
    color: '#FFFFFF',
  },
  actionBtnEdit: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  }
});
