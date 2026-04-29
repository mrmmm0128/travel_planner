import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Map, Heart, MessageCircle, Navigation, ChevronLeft } from 'lucide-react-native';

const MOCK_PUBLIC_ITINERARY = {
  id: 'p1',
  title: '冬の北海道で美味しい海鮮と雪景色を満喫',
  location: '北海道',
  purpose: '女子旅',
  budget: '3〜5万円',
  authorName: 'Yuka',
  likes: 128,
  comments: 14,
  days: [
    {
      id: 'day1',
      label: 'Day 1',
      dateText: 'Day 1 - 札幌到着＆グルメ',
      events: [
        {
          id: '1-1',
          time: '11:00',
          title: '新千歳空港 到着',
          description: '快速エアポートで札幌駅へ移動します。',
          type: 'transit',
        },
        {
          id: '1-2',
          time: '12:30',
          title: '海鮮丼ランチ',
          description: '二条市場で新鮮なウニとイクラの海鮮丼を堪能！',
          image: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?q=80&w=300&auto=format&fit=crop',
          type: 'meal',
        },
      ]
    }
  ]
};

export default function PublicItineraryScreen({ route, navigation }: any) {
  // 実際は route.params.itineraryId でデータをフェッチする想定
  const itinerary = MOCK_PUBLIC_ITINERARY;
  const [activeDayId, setActiveDayId] = useState(itinerary.days[0].id);
  const [isLiked, setIsLiked] = useState(false);

  const activeDay = itinerary.days.find(d => d.id === activeDayId) || itinerary.days[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color="#343a40" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>しおり詳細</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>by {itinerary.authorName}</Text>
        </View>
        <TouchableOpacity style={styles.mapButton}>
          <Map size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>{itinerary.title}</Text>
        <View style={styles.tagsContainer}>
          <View style={styles.tag}><Text style={styles.tagText}>{itinerary.location}</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>{itinerary.purpose}</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>{itinerary.budget}</Text></View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {itinerary.days.map(day => (
            <TouchableOpacity 
              key={day.id} 
              style={[styles.tab, activeDayId === day.id && styles.tabActive]}
              onPress={() => setActiveDayId(day.id)}
            >
              <Text style={[styles.tabText, activeDayId === day.id && styles.tabTextActive]}>
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.dateCard}>
          <Text style={styles.dateText}>{activeDay.dateText}</Text>
        </View>

        <View style={styles.timeline}>
          {activeDay.events.map(item => (
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

      {/* ボトムアクションバー（いいね・コメント） */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.actionItem} 
          onPress={() => setIsLiked(!isLiked)}
        >
          <Heart size={24} color={isLiked ? '#FF6B6B' : '#868e96'} fill={isLiked ? '#FF6B6B' : 'transparent'} />
          <Text style={[styles.actionLabel, isLiked && { color: '#FF6B6B' }]}>
            {itinerary.likes + (isLiked ? 1 : 0)}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionItem}
          onPress={() => navigation.navigate('Comments', { itineraryId: itinerary.id })}
        >
          <MessageCircle size={24} color="#868e96" />
          <Text style={styles.actionLabel}>{itinerary.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>マイしおりに保存</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#343a40',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#868e96',
    fontWeight: '600',
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#343a40',
    lineHeight: 30,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#495057',
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    marginBottom: 10,
  },
  tabScroll: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tabActive: {
    backgroundColor: '#343a40',
    borderColor: '#343a40',
  },
  tabText: {
    color: '#6c757d',
    fontWeight: '700',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 5,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#343a40',
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
    fontSize: 13,
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
    fontSize: 15,
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
    height: 120,
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
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#495057',
    marginLeft: 6,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  }
});
