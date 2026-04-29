import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Search, FileText, User } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { View, Text, ActivityIndicator } from 'react-native';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import ExploreScreen from '../screens/ExploreScreen';
import PublicItineraryScreen from '../screens/PublicItineraryScreen';
import CommentsScreen from '../screens/CommentsScreen';
import CreateItineraryScreen from '../screens/CreateItineraryScreen';
import EditItineraryScreen from '../screens/EditItineraryScreen';
import ItineraryScreen from '../screens/ItineraryScreen';
import ItineraryListScreen from '../screens/ItineraryListScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#adb5bd',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#f1f3f5',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        }
      }}
    >
      <Tab.Screen 
        name="ExploreTab" 
        component={ExploreScreen} 
        options={{ 
          tabBarLabel: '探す',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} /> 
        }} 
      />
      <Tab.Screen 
        name="ItineraryTab" 
        component={ItineraryListScreen} 
        options={{ 
          tabBarLabel: 'マイしおり',
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} /> 
        }} 
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: 'マイページ',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} /> 
        }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { session, user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {(!session && !user) ? (
          // 未ログイン状態のフロー
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
          </>
        ) : (
          // ログイン状態のフロー
          <>
            <Stack.Screen name="MainApp" component={TabNavigator} />
            <Stack.Screen 
              name="ProfileEdit" 
              component={ProfileEditScreen} 
              options={{ 
                headerShown: true, 
                headerTitle: 'プロフィール編集',
                headerBackTitleVisible: false,
                headerTintColor: '#343a40'
              }} 
            />
            <Stack.Screen 
              name="PublicItinerary" 
              component={PublicItineraryScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="Comments" 
              component={CommentsScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="CreateItinerary" 
              component={CreateItineraryScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="EditItinerary" 
              component={EditItineraryScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="Itinerary" 
              component={ItineraryScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
