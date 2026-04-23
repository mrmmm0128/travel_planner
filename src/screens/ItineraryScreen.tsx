import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Map, Clock, Navigation } from 'lucide-react-native';

const ITINERARY = [
  {
    id: '1',
    time: '10:00',
    title: '京都駅 集合',
    description: '烏丸中央口に集合します。',
    type: 'transit',
  },
  {
    id: '2',
    time: '10:30',
    title: 'レンタル着物で着付け',
    description: 'お好きな柄を選んで、ヘアセットも完了！',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=300&auto=format&fit=crop',
    type: 'activity',
  },
  {
    id: '3',
    time: '12:00',
    title: '古民家カフェ「○○」でランチ',
    description: '京都の旬の食材を使ったおばんざいランチ。予約済みです。',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=300&auto=format&fit=crop',
    type: 'meal',
  },
  {
    id: '4',
    time: '14:00',
    title: '祇園白川を散策',
    description: '石畳の風情ある街並みで映え写真を撮影しましょう📸',
    image: 'https://images.unsplash.com/photo-1542051812871-34f216edbf12?q=80&w=300&auto=format&fit=crop',
    type: 'activity',
  },
];

export default function ItineraryScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>旅のしおり</Text>
          <Text style={styles.headerSubtitle}>京都着物カフェ巡りの旅</Text>
        </View>
        <TouchableOpacity style={styles.mapButton}>
          <Map size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.dateCard}>
          <Text style={styles.dateText}>Day 1 - 10月20日(土)</Text>
        </View>

        <View style={styles.timeline}>
          {ITINERARY.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeText}>{item.time}</Text>
                <View style={styles.line} />
                <View style={[
                  styles.dot, 
                  item.type === 'meal' ? styles.dotMeal : item.type === 'activity' ? styles.dotActivity : null
                ]} />
              </View>
              
              <View style={styles.contentColumn}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                  {item.image && (
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                  )}
                  
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Navigation size={14} color="#6c757d" />
                      <Text style={styles.actionText}>経路</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#343a40',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  mapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  dateCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4ECDC4',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343a40',
    letterSpacing: 0.5,
  },
  timeline: {
    paddingLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timeColumn: {
    width: 60,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 8,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#e9ecef',
  },
  dot: {
    position: 'absolute',
    top: 24,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#adb5bd',
    borderWidth: 3,
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
    paddingLeft: 15,
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
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 10,
  },
  cardImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
    marginLeft: 4,
  },
});
