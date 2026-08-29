import { View, Text, TouchableOpacity, Image, FlatList, ScrollView } from "react-native";
import { colors } from '../theme'
import { useEffect, useState } from "react";
import diaryEntryService from "../services/diaryEntryService";
import { useAuth } from "../context/AuthContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";

interface DiaryEntry {
  id: string;
  title: string;
  transcript: string;
  category: string;
  createdAt: string;
}

type RootStackParamList = {
  DiaryList: undefined;
};

export default function HomeScreen() {
  const [recentDiaries, setRecentDiaries] = useState<DiaryEntry[]>();
  const { logout } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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

  const handleViewAll = () => {
    navigation.navigate("DiaryList");
  };

  return (
    <FlatList
      data={recentDiaries || []}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
      ListHeaderComponent={
        <>
          {/* Header */}
          <View className="flex-row justify-between items-center px-4 my-10">
            <Text
              className={`${colors.heading} font-bold text-3xl shadow-sm`}
            >
              DevDiary 
            </Text>

            <TouchableOpacity
              className="p-2 px-3 bg-white border border-gray rounded-full"
              onPress={logout}
            >
              <Text className={colors.heading}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Image */}
          <View className="flex-row justify-center items-center bg-blue-200 rounded-3xl mx-4">
            <Image
              className="w-60 h-60"
              source={require("../assets/thumbnail 2.png")}
            />
          </View>

          {/* Recent Notes header */}
          <View className="px-4 my-5">
            <View className="flex-row justify-between items-center">
              <Text
                className={`${colors.heading} font-bold text-xl`}
              >
                Recent Notes
              </Text>

              <TouchableOpacity
                className="p-2 px-2 bg-white border border-gray rounded-full"
                onPress={handleViewAll}
              >
                <Text>View all</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      }
      renderItem={({ item }) => (
        <TouchableOpacity className="bg-blue-100 mx-6 mb-3 p-3 rounded-xl shadow-md">
          <View className="gap-2">
            <Text className="font-bold text-lg">
              {item.title}
            </Text>

            <Text>
              Transcript: {item.transcript}
            </Text>

            <Text className="text-gray-500 text-sm">
              Category: {item.category}
            </Text>

            <Text className="text-gray-500 text-sm">
              Date: {item.createdAt
                        ? new Date(item.createdAt).toLocaleString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                        })
                        : "Loading..."}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

