import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import LoadingScreen from "./LoadingScreen";
import diaryEntryService from "../services/diaryEntryService";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Categories from "../components/Categories";

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
  const [loadingIcon, setLoadingIcon] = useState(true);
  const navigation =
    useNavigation<NavigationProp<RootStackParamList>>();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchDiaryEntriesByCategory = async (category: string) => {
      try {
        if (category === "All") {
          setLoadingIcon(true);
          const data = await diaryEntryService.getAllDiaryEntries();
          setLoadingIcon(false);
          setDiaryEntries(data.diaryEntries);
        } else {
          setLoadingIcon(true);
          const data = await diaryEntryService.getDiaryEntriesByCategory(category);
          setLoadingIcon(false);
          setDiaryEntries(data.diaryEntries);
        }
      } catch (error) {
        console.error("Failed to fetch diary entries by category:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiaryEntriesByCategory(activeCategory);
  }, [activeCategory]);

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
      {/* Search bar */}
      <View className="mx-2 mt-2 flex-row items-center rounded-full bg-black/5 p-[6px]">
        <TextInput
          placeholder="Search any diary entry..."
          placeholderTextColor={'gray'}
          style={{ fontSize: hp(1.7) }}
          className="flex-1 mb-1 pl-3 tracking-wider">
        </TextInput>
        <View className="bg-white rounded-full p-3">
          <Feather name="search" color="#000" size={24} />
        </View>
      </View>
      {/* Horizontal scroll bar for categories */}
      <Categories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      {/* show loading icon when the api is fetching data */}
      {loadingIcon &&
        <View className="flex-1 justify-center items-center mt-4">
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      }
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