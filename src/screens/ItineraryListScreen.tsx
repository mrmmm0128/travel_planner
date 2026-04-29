import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { Calendar, Users } from 'lucide-react-native';

const MOCK_ITINERARIES = [
  {
    id: '1',
    title: '京都着物カフェ巡りの旅',
    date: '2023.10.20 - 10.21',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop',
    members: 2,
    days: 2,
  },
  {
    id: '2',
    title: '北海道大自然満喫旅行',
    date: '2023.12.10 - 12.12',
    image: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?q=80&w=600&auto=format&fit=crop',
    members: 4,
    days: 3,
  },
  {
    id: '3',
    title: '沖縄リフレッシュ休暇',
    date: '2024.03.05 - 03.08',
    image: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=600&auto=format&fit=crop',
    members: 3,
    days: 4,
  }
];

export default function ItineraryListScreen({ navigation }: any) {
  const renderItem = ({ item }: { item: typeof MOCK_ITINERARIES[0] }) => (
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
          <View style={styles.infoRow}>
            <Calendar size={14} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.infoText}>{item.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Users size={14} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.infoText}>{item.members}人</Text>
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

      <FlatList
        data={MOCK_ITINERARIES}
        keyExtractor={item => item.id}
        renderItem={renderItem}
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
    ...StyleSheet.absoluteFillObject,
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
});
