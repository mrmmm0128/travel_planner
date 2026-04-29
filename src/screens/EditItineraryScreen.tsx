import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, Camera, Check, Clock } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function EditItineraryScreen({ route, navigation }: any) {
  // AI生成された初期データを取得
  const initialData = route?.params?.itineraryData || null;
  const [itinerary, setItinerary] = useState(initialData);
  const [activeDayId, setActiveDayId] = useState(initialData?.days?.[0]?.id || 'day1');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  if (!itinerary) {
    return <SafeAreaView style={styles.container}><Text>データがありません</Text></SafeAreaView>;
  }

  const activeDay = itinerary.days.find((d: any) => d.id === activeDayId) || itinerary.days[0];

  // イベントの内容を更新するハンドラ
  const updateEvent = (eventId: string, key: string, value: string) => {
    const newDays = itinerary.days.map((day: any) => {
      if (day.id === activeDayId) {
        return {
          ...day,
          events: day.events.map((ev: any) => ev.id === eventId ? { ...ev, [key]: value } : ev)
        };
      }
      return day;
    });
    setItinerary({ ...itinerary, days: newDays });
  };

  // カメラロールからの画像選択（モック）
  const handleSelectImage = (eventId: string) => {
    Alert.alert(
      "画像を選択",
      "カメラロールから画像を選択します（モック）",
      [
        { text: "キャンセル", style: "cancel" },
        { 
          text: "別の画像に変更", 
          onPress: () => {
            // ダミーの別画像URLを設定
            updateEvent(eventId, 'image', 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=300&auto=format&fit=crop');
          } 
        }
      ]
    );
  };

  // DBへの保存処理
  const handleSave = async () => {
    if (!user || user.id === 'dummy-user') {
      Alert.alert('エラー', '保存するにはSupabaseでのログインが必要です');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // 1. itineraries テーブルへ保存
      const { data: itineraryData, error: itineraryError } = await supabase
        .from('itineraries')
        .insert({
          owner_id: user.id,
          title: itinerary.title || '無題のしおり',
          description: itinerary.description || '',
          location: itinerary.location || '',
          purpose: itinerary.purpose || '',
          budget: itinerary.budget || '',
          is_public: false
        })
        .select()
        .single();

      if (itineraryError) throw itineraryError;

      const newItineraryId = itineraryData.id;

      // 2. itinerary_days への保存
      for (const [index, day] of itinerary.days.entries()) {
        const { data: dayData, error: dayError } = await supabase
          .from('itinerary_days')
          .insert({
            itinerary_id: newItineraryId,
            day_index: index + 1,
            // date: "2024-05-01" などの変換処理が必要ならここで行う
          })
          .select()
          .single();

        if (dayError) throw dayError;

        const newDayId = dayData.id;

        // 3. events への保存
        if (day.events && day.events.length > 0) {
          const eventsToInsert = day.events.map((ev: any, evIndex: number) => ({
            day_id: newDayId,
            time: ev.time || null,
            title: ev.title || '予定',
            description: ev.description || '',
            event_type: ev.type || 'activity',
            image_url: ev.image || null,
            order_index: evIndex,
          }));

          const { error: eventsError } = await supabase
            .from('events')
            .insert(eventsToInsert);

          if (eventsError) throw eventsError;
        }
      }

      Alert.alert("保存完了", "しおりをDBに保存しました！", [
        { text: "OK", onPress: () => navigation.navigate('MainApp', { screen: 'ItineraryTab' }) }
      ]);

    } catch (err: any) {
      console.error('Error saving itinerary:', err);
      Alert.alert("保存エラー", err.message || "しおりの保存に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color="#343a40" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>しおりの編集</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
          <Check size={18} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>{isSaving ? '保存中...' : '完了'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <TextInput
          style={styles.mainTitleInput}
          value={itinerary.title}
          onChangeText={(text) => setItinerary({ ...itinerary, title: text })}
          placeholder="タイトルを入力"
        />
        <TextInput
          style={styles.descInput}
          value={itinerary.description}
          onChangeText={(text) => setItinerary({ ...itinerary, description: text })}
          placeholder="概要やメモを入力"
          multiline
        />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.dateCard}>
            <TextInput
              style={styles.dateTextInput}
              value={activeDay.dateText}
              onChangeText={(text) => {
                const newDays = itinerary.days.map((d: any) => d.id === activeDayId ? { ...d, dateText: text } : d);
                setItinerary({ ...itinerary, days: newDays });
              }}
            />
          </View>

          <View style={styles.timeline}>
            {activeDay.events.map((item: any) => (
              <View key={item.id} style={styles.timelineItem}>
                
                <View style={styles.timeColumn}>
                  <View style={styles.timeInputContainer}>
                    <Clock size={12} color="#868e96" style={{ marginRight: 4 }} />
                    <TextInput
                      style={styles.timeTextInput}
                      value={item.time}
                      onChangeText={(text) => updateEvent(item.id, 'time', text)}
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                  <View style={styles.line} />
                  <View style={[
                    styles.dot, 
                    item.type === 'meal' ? styles.dotMeal : item.type === 'activity' ? styles.dotActivity : null
                  ]} />
                </View>
                
                <View style={styles.contentColumn}>
                  <View style={styles.card}>
                    <TextInput
                      style={styles.cardTitleInput}
                      value={item.title}
                      onChangeText={(text) => updateEvent(item.id, 'title', text)}
                      placeholder="予定のタイトル"
                    />
                    <TextInput
                      style={styles.cardDescInput}
                      value={item.description}
                      onChangeText={(text) => updateEvent(item.id, 'description', text)}
                      placeholder="詳細やメモ"
                      multiline
                    />
                    
                    {/* 画像エリア */}
                    {item.image ? (
                      <TouchableOpacity style={styles.imageContainer} onPress={() => handleSelectImage(item.id)}>
                        <Image source={{ uri: item.image }} style={styles.cardImage} />
                        <View style={styles.imageOverlay}>
                          <Camera size={20} color="#FFFFFF" />
                          <Text style={styles.imageOverlayText}>変更</Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.emptyImageContainer} onPress={() => handleSelectImage(item.id)}>
                        <Camera size={24} color="#adb5bd" />
                        <Text style={styles.emptyImageText}>画像を追加</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343a40',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 4,
  },
  titleSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  mainTitleInput: {
    fontSize: 22,
    fontWeight: '800',
    color: '#343a40',
    marginBottom: 8,
    padding: 0,
  },
  descInput: {
    fontSize: 14,
    color: '#495057',
    padding: 0,
    minHeight: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  dateCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dateTextInput: {
    fontSize: 15,
    fontWeight: '700',
    color: '#343a40',
    padding: 0,
  },
  timeline: {
    paddingLeft: 5,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeColumn: {
    width: 70,
    alignItems: 'center',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  timeTextInput: {
    fontSize: 13,
    fontWeight: '700',
    color: '#495057',
    padding: 0,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#dee2e6',
  },
  dot: {
    position: 'absolute',
    top: 30,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#adb5bd',
    borderWidth: 2,
    borderColor: '#F8F9FA',
  },
  dotMeal: {
    backgroundColor: '#FFE66D',
  },
  dotActivity: {
    backgroundColor: '#FF6B6B',
  },
  contentColumn: {
    flex: 1,
    paddingLeft: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  cardTitleInput: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 6,
    padding: 0,
  },
  cardDescInput: {
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 12,
    padding: 0,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageOverlayText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 6,
  },
  emptyImageContainer: {
    width: '100%',
    height: 100,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  emptyImageText: {
    color: '#adb5bd',
    fontWeight: '600',
    marginLeft: 8,
  }
});
