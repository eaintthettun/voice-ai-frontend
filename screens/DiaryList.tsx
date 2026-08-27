import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import LoadingScreen from "./LoadingScreen";
import diaryEntryService from "../services/diaryEntryService";

interface DiaryEntry {
  id: string;
  title: string;
  transcript: string;
  category: string;
  createdAt: string;
}

const DiaryList = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const result = await diaryEntryService.getAllDiaryEntries();
        setDiaryEntries(result.diaryEntries);
      } catch (error) {
        console.error("Failed to fetch diary entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryEntries();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1 justify-center items-center mt-10 p-5">
      <Text className="text-2xl font-bold mb-4">Diary List</Text>
      <FlatList
        data={diaryEntries}
        numColumns={1}
        keyExtractor={item => item.id}
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
  );
};

export default DiaryList;