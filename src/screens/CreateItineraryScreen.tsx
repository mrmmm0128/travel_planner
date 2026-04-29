import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { ChevronLeft, Sparkles, Plus, Trash2, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

type ActionItem = { id: string; time: string; text: string };

export default function CreateItineraryScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [destinations, setDestinations] = useState<string[]>(['']);
  
  // 期間
  const [startDate, setStartDate] = useState<string>('2024-05-01');
  const [endDate, setEndDate] = useState<string>('2024-05-03');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingDate, setSelectingDate] = useState<'start' | 'end'>('start');

  // アクションリスト
  const [actions, setActions] = useState<ActionItem[]>([
    { id: '1', time: '10:00', text: '現地到着' },
    { id: '2', time: '12:00', text: '話題のカフェでランチ' }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const addDestination = () => setDestinations([...destinations, '']);
  const updateDestination = (text: string, index: number) => {
    const newDests = [...destinations];
    newDests[index] = text;
    setDestinations(newDests);
  };
  const removeDestination = (index: number) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((_, i) => i !== index));
    }
  };

  const addAction = () => {
    setActions([...actions, { id: Date.now().toString(), time: '', text: '' }]);
  };
  const updateAction = (id: string, field: 'time' | 'text', value: string) => {
    setActions(actions.map(a => a.id === id ? { ...a, [field]: value } : a));
  };
  const removeAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const validDestinations = destinations.filter(d => d.trim() !== '').join('・');
      const generatedTitle = title.trim() ? title : (validDestinations ? `${validDestinations}の旅` : '新しい旅行');

      // 画像生成APIを並列で呼び出す
      const generatedEvents = await Promise.all(
        actions.map(async (act, index) => {
          // プロンプトの組み立て (例: "京都の清水寺のカフェでランチ、高品質な写真")
          const prompt = `${validDestinations}の${act.text}、高品質な写真、風景`;
          
          let imageUrl = '';
          try {
            const { data, error } = await supabase.functions.invoke("generate-image", {
              body: { prompt }
            });
            
            if (error) {
              console.error(`Error generating image for action ${index}:`, error);
              // エラー時はフォールバック画像
              imageUrl = index % 2 === 0 
                ? 'https://images.unsplash.com/photo-1542051812871-34f216edbf12?q=80&w=300&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=300&auto=format&fit=crop';
            } else {
              imageUrl = data?.url || '';
            }
          } catch (err) {
            console.error(`Failed to invoke function for action ${index}:`, err);
            imageUrl = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=300&auto=format&fit=crop'; // フォールバック
          }

          return {
            id: `event-${Date.now()}-${index}`,
            time: act.time || '10:00',
            title: act.text || '予定',
            description: '',
            image: imageUrl,
            type: index % 2 === 0 ? 'activity' : 'meal',
          };
        })
      );

      const generatedMockData = {
        title: generatedTitle,
        description: `${startDate} から ${endDate} までの旅行プランです。`,
        location: validDestinations,
        purpose: 'カスタム',
        budget: '未設定',
        days: [
          {
            id: 'day1',
            label: 'Day 1',
            dateText: `Day 1 - ${startDate}`,
            events: generatedEvents
          }
        ]
      };

      setIsGenerating(false);
      navigation.navigate('EditItinerary', { itineraryData: generatedMockData });
      
    } catch (error) {
      console.error('Generation Error:', error);
      setIsGenerating(false);
      alert('エラーが発生しました。もう一度お試しください。');
    }
  };

  // 簡易カレンダーUIのレンダリング
  const renderCalendarModal = () => (
    <Modal visible={showCalendar} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {selectingDate === 'start' ? '開始日を選択' : '終了日を選択'}
          </Text>
          
          <View style={styles.calendarGrid}>
            {/* モックのカレンダーUI */}
            {['日', '月', '火', '水', '木', '金', '土'].map(d => (
              <Text key={d} style={styles.calHeader}>{d}</Text>
            ))}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const dateStr = `2024-05-${day.toString().padStart(2, '0')}`;
              const isSelected = selectingDate === 'start' ? startDate === dateStr : endDate === dateStr;
              
              return (
                <TouchableOpacity 
                  key={i} 
                  style={[styles.calDay, isSelected && styles.calDaySelected]}
                  onPress={() => {
                    if (selectingDate === 'start') setStartDate(dateStr);
                    else setEndDate(dateStr);
                    setShowCalendar(false);
                  }}
                >
                  <Text style={[styles.calDayText, isSelected && styles.calDayTextSelected]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowCalendar(false)}>
            <Text style={styles.closeModalText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (isGenerating) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Sparkles size={48} color="#FF6B6B" />
        <Text style={styles.loadingTitle}>AIが画像を生成中...</Text>
        <Text style={styles.loadingSubtitle}>入力されたアクションに合わせて</Text>
        <Text style={styles.loadingSubtitle}>しおりを組み立てています</Text>
        <ActivityIndicator size="large" color="#FF6B6B" style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color="#343a40" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>しおりを作る</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* 0. タイトル */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. しおりのタイトル</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="例：週末京都旅行"
                value={title}
                onChangeText={setTitle}
              />
            </View>
          </View>

          {/* 1. 目的地 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. 目的地</Text>
            {destinations.map((dest, index) => (
              <View key={index} style={styles.inputRow}>
                <MapPin size={20} color="#adb5bd" />
                <TextInput
                  style={styles.textInput}
                  placeholder="例：京都、清水寺"
                  value={dest}
                  onChangeText={(text) => updateDestination(text, index)}
                />
                {destinations.length > 1 && (
                  <TouchableOpacity onPress={() => removeDestination(index)} style={styles.deleteButton}>
                    <Trash2 size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addDestination}>
              <Plus size={16} color="#4ECDC4" />
              <Text style={styles.addButtonText}>目的地を追加</Text>
            </TouchableOpacity>
          </View>

          {/* 2. 期間 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. 期間</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity 
                style={styles.dateButton} 
                onPress={() => { setSelectingDate('start'); setShowCalendar(true); }}
              >
                <CalendarIcon size={18} color="#495057" />
                <Text style={styles.dateButtonText}>{startDate}</Text>
              </TouchableOpacity>
              <Text style={styles.dateTo}>〜</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => { setSelectingDate('end'); setShowCalendar(true); }}
              >
                <CalendarIcon size={18} color="#495057" />
                <Text style={styles.dateButtonText}>{endDate}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. 時間とアクション */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. 時間とアクション</Text>
            <Text style={styles.sectionSub}>入力したアクションに合わせてAIが画像を生成します。</Text>
            
            {actions.map((act) => (
              <View key={act.id} style={styles.actionRow}>
                <View style={styles.timeInputBox}>
                  <Clock size={14} color="#adb5bd" />
                  <TextInput
                    style={styles.timeInput}
                    placeholder="10:00"
                    value={act.time}
                    onChangeText={(text) => updateAction(act.id, 'time', text)}
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
                <View style={styles.actionInputBox}>
                  <TextInput
                    style={styles.actionInput}
                    placeholder="アクション（例：カフェでランチ）"
                    value={act.text}
                    onChangeText={(text) => updateAction(act.id, 'text', text)}
                  />
                </View>
                <TouchableOpacity onPress={() => removeAction(act.id)} style={styles.deleteActionBtn}>
                  <Trash2 size={18} color="#adb5bd" />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity style={styles.addButton} onPress={addAction}>
              <Plus size={16} color="#4ECDC4" />
              <Text style={styles.addButtonText}>アクションを追加</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={styles.generateButton} 
            onPress={handleGenerate}
            disabled={isGenerating}
          >
            <Sparkles size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.generateButtonText}>画像をAI生成して完成させる</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {renderCalendarModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#343a40',
    marginTop: 20,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#868e96',
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343a40',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 12,
  },
  sectionSub: {
    fontSize: 13,
    color: '#868e96',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#343a40',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#e6fcf5',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#4ECDC4',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
  },
  dateButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#495057',
    marginLeft: 8,
  },
  dateTo: {
    marginHorizontal: 15,
    color: '#868e96',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 8,
    width: 85,
    marginRight: 10,
  },
  timeInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontSize: 14,
    color: '#343a40',
  },
  actionInputBox: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  actionInput: {
    paddingVertical: 10,
    fontSize: 14,
    color: '#343a40',
  },
  deleteActionBtn: {
    padding: 10,
    marginLeft: 5,
  },
  bottomBar: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  generateButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  calHeader: {
    width: '14%',
    textAlign: 'center',
    fontWeight: '700',
    color: '#868e96',
    marginBottom: 10,
  },
  calDay: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 20,
  },
  calDaySelected: {
    backgroundColor: '#FF6B6B',
  },
  calDayText: {
    fontSize: 15,
    color: '#495057',
  },
  calDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  closeModalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#f1f3f5',
    borderRadius: 20,
  },
  closeModalText: {
    fontWeight: '700',
    color: '#495057',
  }
});
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}

