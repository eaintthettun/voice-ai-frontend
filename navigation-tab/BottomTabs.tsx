import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import AddNoteScreen from "../screens/AddNoteScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import DiaryList from "../screens/DiaryList";
import Feather from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0ea5e9",
        tabBarInactiveTintColor: "gray",
      }}>
      <Tab.Screen name="Home" component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }} />
      <Tab.Screen name="Diary" component={DiaryList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }} />
      <Tab.Screen name="Add" component={AddNoteScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="add-circle"
              size={30}
              color="#0ea5e9"
            />
          ),
        }} />
      <Tab.Screen name="Report" component={CategoriesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
             <Feather name="pie-chart" color={color} size={size} />
          ),
        }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }} />
    </Tab.Navigator>
  );
}