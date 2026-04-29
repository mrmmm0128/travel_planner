import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Search, Heart, MessageCircle, MapPin, SlidersHorizontal } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

const CATEGORIES = {
  locations: ['北海道', '関東', '関西', '沖縄', 'その他'],
  purposes: ['一人旅', '女子旅', '家族旅行', 'デート', '友達と'],
  budgets: ['1万円未満', '1〜3万円', '3〜5万円', '5万円以上']
};



export default function ExploreScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState<{type: string, val: string} | null>(null);
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicItineraries = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('itineraries')
        .select(`
          id,
          title,
          location,
          purpose,
          budget,
          itinerary_days (
            events (
              image_url
            )
          ),
          profiles:owner_id (
            name
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (activeFilter) {
        if (activeFilter.type === 'location') {
          query = query.eq('location', activeFilter.val);
        } else if (activeFilter.type === 'purpose') {
          query = query.eq('purpose', activeFilter.val);
        } else if (activeFilter.type === 'budget') {
          query = query.eq('budget', activeFilter.val);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedData = data.map((item: any) => {
        const firstEventImage = item.itinerary_days?.[0]?.events?.[0]?.image_url;
        const authorName = Array.isArray(item.profiles) ? item.profiles[0]?.name : item.profiles?.name;

        return {
          id: item.id,
          title: item.title,
          cover_image: firstEventImage || 'https://images.unsplash.com/photo-1542931287-023b922fa89b?q=80&w=600&auto=format&fit=crop',
          location: item.location || 'その他',
          purpose: item.purpose || '未設定',
          budget: item.budget || '未設定',
          likes: 0,
          comments: 0,
          days: 1, // 概算値
          authorName: authorName || '名無しトラベラー'
        };
      });

      setItineraries(formattedData);
    } catch (err) {
      console.error('Error fetching public itineraries:', err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useFocusEffect(
    useCallback(() => {
      fetchPublicItineraries();
    }, [fetchPublicItineraries])
  );

  const toggleFilter = (type: string, val: string) => {
    if (activeFilter?.type === type && activeFilter?.val === val) {
      setActiveFilter(null);
    } else {
      setActiveFilter({ type, val });
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('PublicItinerary', { itineraryId: item.id })}
    >
      <Image source={{ uri: item.cover_image }} style={styles.cardImage} />
      <View style={styles.cardOverlay} />
      
      <View style={styles.cardContent}>
        <View style={styles.tagsContainer}>
          <View style={styles.tag}><Text style={styles.tagText}>{item.location}</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>{item.purpose}</Text></View>
        </View>
        
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.authorRow}>
            <Text style={styles.authorText}>by {item.authorName}</Text>
            <Text style={styles.daysText}> • {item.days} Days</Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Heart size={16} color="#FFFFFF" />
              <Text style={styles.statText}>{item.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <MessageCircle size={16} color="#FFFFFF" />
              <Text style={styles.statText}>{item.comments}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>探す</Text>
        <TouchableOpacity style={styles.searchIcon}>
          <Search size={24} color="#343a40" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <View style={styles.filterGroup}>
            <View style={styles.filterLabelContainer}>
              <MapPin size={12} color="#868e96" />
              <Text style={styles.filterLabel}>場所</Text>
            </View>
            {CATEGORIES.locations.map(loc => (
              <TouchableOpacity 
                key={loc} 
                style={[styles.filterChip, activeFilter?.val === loc && styles.filterChipActive]}
                onPress={() => toggleFilter('location', loc)}
              >
                <Text style={[styles.filterChipText, activeFilter?.val === loc && styles.filterChipTextActive]}>{loc}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.filterSeparator} />
          
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>目的</Text>
            {CATEGORIES.purposes.map(purp => (
              <TouchableOpacity 
                key={purp} 
                style={[styles.filterChip, activeFilter?.val === purp && styles.filterChipActive]}
                onPress={() => toggleFilter('purpose', purp)}
              >
                <Text style={[styles.filterChipText, activeFilter?.val === purp && styles.filterChipTextActive]}>{purp}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.filterSeparator} />
          
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>予算</Text>
            {CATEGORIES.budgets.map(budg => (
              <TouchableOpacity 
                key={budg} 
                style={[styles.filterChip, activeFilter?.val === budg && styles.filterChipActive]}
                onPress={() => toggleFilter('budget', budg)}
              >
                <Text style={[styles.filterChipText, activeFilter?.val === budg && styles.filterChipTextActive]}>{budg}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={itineraries}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>条件に一致するしおりがありません</Text>
          </View>
        }
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
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#343a40',
  },
  searchIcon: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  filterSection: {
    marginBottom: 15,
  },
  filterScroll: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: 'center',
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginLeft: 5,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#868e96',
    marginRight: 8,
    marginLeft: 5,
  },
  filterSeparator: {
    width: 1,
    height: 20,
    backgroundColor: '#dee2e6',
    marginHorizontal: 10,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterChipActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  filterChipText: {
    color: '#6c757d',
    fontWeight: '600',
    fontSize: 13,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    height: 240,
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 28,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    color: '#f8f9fa',
    fontSize: 13,
    fontWeight: '600',
  },
  daysText: {
    color: '#f8f9fa',
    fontSize: 13,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#868e96',
    fontSize: 15,
    fontWeight: '600',
  }
});
