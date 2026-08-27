import { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import LoadingScreen from "./LoadingScreen";
import diaryEntryService from "../services/diaryEntryService";
import { colors } from '../theme'
import { NavigationProp, useNavigation } from "@react-navigation/native";

interface DiaryEntry {
  id: string;
  title: string;
  transcript: string;
  category: string;
  createdAt: string;
}

type RootStackParamList = {
  EditDiary: {
    id: string;
    title: string;
    transcript: string;
    category: string;
  };
};

const DiaryList = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation =
  useNavigation<NavigationProp<RootStackParamList>>();

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

  const handleLongPress = (item: DiaryEntry) => {
    Alert.alert(
      item.title,
      "What would you like to do?",
      [
        {
          text: "Edit",
          onPress: () => handleEdit(item),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(item.id),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  }

  const handleEdit = (item: DiaryEntry) => {
    navigation.navigate("EditDiary", {
      id: item.id,
      title: item.title,
      transcript: item.transcript,
      category: item.category,
    });
  }

  const handleDelete = async (id: string) => {
    try {
      await diaryEntryService.deleteDiaryEntry(id);

      // Remove it from the current list
      setDiaryEntries((prev) =>
        prev.filter((item) => item.id !== id)
      );

      Alert.alert("Success", "Diary deleted.");
    } catch (error) {
      Alert.alert("Error", "Failed to delete diary.");
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1 justify-center items-center p-5">
      <Text className={`text-2xl font-bold my-10 ${colors.heading}`}>Diary List</Text>
      <FlatList
        data={diaryEntries}
        numColumns={1}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={
          ({ item }) => {
            return (
              <TouchableOpacity className="bg-blue-100 m-2 p-2 rounded-xl shadow-md" onLongPress={() => handleLongPress(item)}>
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