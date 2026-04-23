import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Send, Camera, FileText } from 'lucide-react-native';

const MOCK_MESSAGES = [
  { id: '1', text: 'こんにちは！旅行の相談ですね。どんな感じにしたいか教えてください！', sender: 'planner', time: '10:00' },
  { id: '2', text: '京都で、着物を着てカフェ巡りをしたいです！', sender: 'user', time: '10:05' },
  { id: '3', text: 'いいですね！レンタル着物屋さんの近くで、雰囲気のいい古民家カフェをいくつかピックアップしますね。', sender: 'planner', time: '10:10' },
];

export default function ChatDetailScreen({ route, navigation }: any) {
  const planner = route.params?.planner || { name: 'プランナー', image: 'https://via.placeholder.com/100' };
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');

  const renderMessage = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => (
    <View style={[styles.messageBubble, item.sender === 'user' ? styles.myMessage : styles.plannerMessage]}>
      {item.sender === 'planner' && <Image source={{ uri: planner.image }} style={styles.messageAvatar} />}
      <View style={[styles.messageContent, item.sender === 'user' ? styles.myMessageContent : styles.plannerMessageContent]}>
        <Text style={[styles.messageText, item.sender === 'user' ? styles.myMessageText : styles.plannerMessageText]}>{item.text}</Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: planner.image }} style={styles.headerAvatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{planner.name}</Text>
          <Text style={styles.headerStatus}>オンライン</Text>
        </View>
        <TouchableOpacity 
          style={styles.itineraryButton}
          onPress={() => navigation.navigate('Itinerary')}
        >
          <FileText size={20} color="#FF6B6B" />
          <Text style={styles.itineraryButtonText}>しおり</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.chatContainer}
      >
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Camera size={24} color="#adb5bd" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="メッセージを入力..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343a40',
  },
  headerStatus: {
    fontSize: 12,
    color: '#20c997',
    marginTop: 2,
  },
  itineraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  itineraryButtonText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  chatContainer: {
    flex: 1,
  },
  messageList: {
    padding: 15,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  plannerMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  messageContent: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 20,
  },
  myMessageContent: {
    backgroundColor: '#FF6B6B',
    borderBottomRightRadius: 4,
  },
  plannerMessageContent: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  plannerMessageText: {
    color: '#343a40',
  },
  messageTime: {
    fontSize: 11,
    color: '#adb5bd',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  iconButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f1f3f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
