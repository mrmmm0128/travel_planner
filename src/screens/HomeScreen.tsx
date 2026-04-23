import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { MapPin, Star, MessageCircle, SlidersHorizontal } from 'lucide-react-native';

const PLANNERS = [
  {
    id: '1',
    name: 'Yuka',
    type: '女子大生インフルエンサー',
    rating: 4.9,
    reviews: 124,
    tags: ['京都', '映えカフェ', '和装'],
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    description: '京都の隠れ家カフェと、着物での映えスポット巡りならお任せください！',
  },
  {
    id: '2',
    name: 'Hiroshi',
    type: '温泉・サウナ愛好家',
    rating: 4.8,
    reviews: 89,
    tags: ['箱根・伊豆', 'サウナ', '絶景'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    description: '最高の「ととのう」体験ができる温泉宿をご提案します。',
  },
  {
    id: '3',
    name: 'Ami & Family',
    type: 'ママさんトラベラー',
    rating: 5.0,
    reviews: 210,
    tags: ['沖縄', '子連れ', 'ホテルステイ'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    description: '小さいお子様連れでも安心・快適に楽しめる沖縄プランを作ります🌺',
  },
];

const FILTERS = ['エリア', '得意ジャンル', '予算感', 'メンバー構成'];

export default function HomeScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState('エリア');

  const renderPlanner = ({ item }: { item: typeof PLANNERS[0] }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ChatDetail', { planner: item })}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.headerTextInfo}>
          <Text style={styles.plannerName}>{item.name}</Text>
          <Text style={styles.plannerType}>{item.type}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFE66D" fill="#FFE66D" />
            <Text style={styles.ratingText}>{item.rating} ({item.reviews})</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      
      <View style={styles.tagsContainer}>
        {item.tags.map((tag, idx) => (
          <View key={idx} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.chatButton}
        onPress={() => navigation.navigate('Chat', { screen: 'ChatDetail', params: { planner: item } })}
      >
        <MessageCircle size={18} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.chatButtonText}>相談する</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>おすすめのプランナー</Text>
        <TouchableOpacity style={styles.filterIcon}>
          <SlidersHorizontal size={24} color="#343a40" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((f, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={PLANNERS}
        keyExtractor={item => item.id}
        renderItem={renderPlanner}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#343a40',
  },
  filterIcon: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  filterScrollContainer: {
    marginBottom: 15,
  },
  filterScroll: {
    paddingHorizontal: 15,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterChipActive: {
    backgroundColor: '#343a40',
    borderColor: '#343a40',
  },
  filterChipText: {
    color: '#6c757d',
    fontWeight: '600',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  headerTextInfo: {
    flex: 1,
  },
  plannerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 4,
  },
  plannerType: {
    fontSize: 12,
    color: '#868e96',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
    marginLeft: 6,
  },
  description: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 22,
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '600',
  },
  chatButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
});
