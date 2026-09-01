import { useEffect, useState } from "react";
import { Alert, FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import LoadingScreen from "./LoadingScreen";
import diaryEntryService from "../services/diaryEntryService";
import { colors } from '../theme'
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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
  DiaryDetail: {
    id: string
  }
};

const DiaryList = () => {
  const { top } = useSafeAreaInsets();
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
    <View className="flex-1">
      <View style={{ paddingTop: top }} className="flex-row items-center bg-sky-600 rounded-b-3xl p-3">
        <View className="flex-1">
          <TouchableOpacity className="mt-4 " onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center">
          <Text className={`text-white text-2xl font-bold text-center`}>
            Diary List
          </Text>
        </View>
        <View className="flex-1">
        </View>
      </View>
      <FlatList
        data={diaryEntries}
        numColumns={1}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={
          ({ item }) => {
            return (
              <TouchableOpacity
                className="bg-blue-100 m-4 rounded-xl shadow-md"
                onLongPress={() => handleLongPress(item)}
                onPress={() => navigation.navigate("DiaryDetail", { id: item.id })}>
                <View className="flex-row items-center p-3">
                  {/* Diary information */}
                  <View className="flex-1 gap-2">
                    <Text className="font-bold text-lg">
                      {item.title}
                    </Text>

                    <Text numberOfLines={2}>
                      Transcript: {item.transcript}
                    </Text>

                    <Text className="text-gray-500 text-sm">
                      Category: {item.category}
                    </Text>

                    <Text className="text-gray-500 text-sm">
                      Date: {new Date(item.createdAt).toDateString()}
                    </Text>
                  </View>

                  {/* Arrow */}
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color="#0ea5e9"
                  />

                </View>
              </TouchableOpacity>
            )
          }
        } />
    </View>
  );
};

export default DiaryList;