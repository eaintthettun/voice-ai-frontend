import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { colors } from '../theme'
import { useEffect, useState } from "react";
import diaryEntryService from "../services/diaryEntryService";

interface DiaryEntry {
  _id: string;
  title: string;
  transcript: string;
  category: string;
  createdAt: string;
}

export default function HomeScreen() {
  const [recentDiaries, setRecentDiaries] = useState<DiaryEntry[]>();

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const result = await diaryEntryService.getRecentDiaryEntries();
        setRecentDiaries(result.recentDiaryEntries);
      } catch (error) {
        console.error("Failed to fetch diaries:", error);
      }
    };

    fetchDiaries();
  }, []);
  console.log(recentDiaries)

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center px-4 my-10">
        <Text className={`${colors.heading} font-bold text-3xl shadow-sm`}>DevDiary </Text>
        <TouchableOpacity className="p-2 px-3 bg-white border border-gray rounded-full">
          <Text className={colors.heading}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center items-center bg-blue-200 rounded-3xl mx-4">
        <Image className="w-60 h-60" source={require("../assets/thumbnail 2.png")} ></Image>
      </View>
      <View className="px-4 my-10">
        <View className="flex-row justify-between items-center">
          <Text className={`${colors.heading} font-bold text-xl`}>Recent Notes</Text>
          <TouchableOpacity className="p-2 px-2 bg-white border border-gray rounded-full">
            <Text>View all</Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            data={recentDiaries}
            numColumns={1}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={
              ({ item }) => {
                return (
                  <TouchableOpacity className="bg-blue-100 m-2 p-2 rounded-xl shadow-md">
                    <View className="gap-2">
                      <Text className="font-bold text-lg">{item.title}</Text>
                      <Text>Transcript: {item.transcript}</Text>
                      <Text className="text-gray-500 text-sm">Category: {item.category}</Text>
                      <Text className="text-gray-500 text-sm">Date: {new Date(item.createdAt).toDateString()}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }
            } />
        </View>
      </View>
    </View>
  );
}

