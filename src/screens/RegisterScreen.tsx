import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Image, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }: any) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const travelStyles = [
    { id: '1', title: '映え＆カフェ巡り', icon: '☕️' },
    { id: '2', title: '子連れでリラックス', icon: '👶' },
    { id: '3', title: '効率よく観光したい', icon: '📸' },
    { id: '4', title: 'サウナ・温泉で整う', icon: '♨️' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>JourneyMatch</Text>
          <Text style={styles.subtitle}>あなただけの特別な旅を一緒に作りませんか？</Text>
        </View>

        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1596395819057-dcfa64d0a6c0?q=80&w=1000&auto=format&fit=crop' }} 
          style={styles.heroImage} 
        />

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>どんな旅をご希望ですか？</Text>

          <View style={styles.styleGrid}>
            {travelStyles.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.styleCard,
                  selectedStyle === item.id && styles.styleCardSelected
                ]}
                onPress={() => setSelectedStyle(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.styleIcon}>{item.icon}</Text>
                <Text style={[
                  styles.styleText,
                  selectedStyle === item.id && styles.styleTextSelected
                ]}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.startButton, !selectedStyle && styles.startButtonDisabled]}
            disabled={!selectedStyle}
            onPress={() => navigation.replace('MainApp')}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>プランナーを探す</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6B6B',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  heroImage: {
    width: width - 48,
    height: 200,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 30,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 16,
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
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  styleCardSelected: {
    borderColor: '#FF6B6B',
    backgroundColor: '#fff5f5',
  },
  styleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  styleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  styleTextSelected: {
    color: '#FF6B6B',
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  startButtonDisabled: {
    backgroundColor: '#e9ecef',
    shadowOpacity: 0,
    elevation: 0,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
