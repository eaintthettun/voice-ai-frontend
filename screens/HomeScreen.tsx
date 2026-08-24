import { View,Text,Image, TextInput, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated,{ FadeInUp,FadeInDown } from "react-native-reanimated";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import authService from "../services/authService";

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
};

function HomeScreen() {
  
  return (
    <View className="bg-white h-full w-full">
      <Text>Home Screen</Text>
    </View>
  );
}

export default HomeScreen;