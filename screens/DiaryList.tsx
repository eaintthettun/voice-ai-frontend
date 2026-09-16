import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import LoadingScreen from "./LoadingScreen";
import diaryEntryService from "../services/diaryEntryService";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Categories from "../components/Categories";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { FadeInDown } from "react-native-reanimated";
import { NoData } from "../components/NoData";
import MasonryList from "@react-native-seoul/masonry-list";

interface DiaryEntry {
  id: string;
  title: string;
  transcript: string;
  category: string;
  createdAt: string;
}

type RootStackParamList = {
  //for navigation
  EditDiary: {
    id: string;
    title: string;
    transcript: string;
    category: string;
  };
  DiaryDetail: {
    id: string
  },
  AddDiary: undefined;
};


const DiaryList = () => {
  const { top } = useSafeAreaInsets();
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState<boolean>(false);
  const navigation =
    useNavigation<NavigationProp<RootStackParamList>>();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeFavorite, setActiveFavorite] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    const fetchDiaryEntriesByCategory = async (category: string) => {
      try {
        if (category === "All") {
          setLoadingIcon(true);
          const data = await diaryEntryService.getAllDiaryEntries();
          setDiaryEntries(data.diaryEntries);
        } else {
          setLoadingIcon(true);
          const data = await diaryEntryService.getDiaryEntriesByCategory(category);
          setDiaryEntries(data.diaryEntries);
        }
      } catch (error) {
        console.error("Failed to fetch diary entries by category:", error);
      } finally {
        setLoadingIcon(false);
      }
    };

    const fetchFavoriteDiaryEntries = async () => {
      try {
        setLoadingIcon(true);
        const data = await diaryEntryService.getFavoriteDiaryEntries();
        setDiaryEntries(data.favoriteDiaryEntries);
      } catch (error) {
        console.error("Failed to fetch favorite diary entries:", error);
      } finally {
        setLoadingIcon(false);
      }
    }

    const fetchSearchDiaryEntries = async (searchKeyword: string) => {
      try {
        const data = await diaryEntryService.searchDiaryEntries(searchKeyword);
        setDiaryEntries(data.diaryEntries);
      } catch (error) {
        console.error("Failed to fetch search diary entries:", error);
      } finally {
        setLoadingIcon(false);
      }
    }


    //only call one api at a time(search->date->favorite->category)
    if (searchKeyword.trim()) {
      fetchSearchDiaryEntries(searchKeyword);
    }
    else if (activeFavorite) {
      fetchFavoriteDiaryEntries();
    }
    //when there is active category
    else {
      fetchDiaryEntriesByCategory(activeCategory);
    }
  }, [activeCategory, activeFavorite, searchKeyword]);

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
    <View className="flex-1 pb-10">
      {/* title and back arrow */}
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
          <Text className={`text-white text-xl font-bold text-center`}>
            Diary List
          </Text>
        </View>
        <View className="flex-1">
        </View>
      </View>
      {/* Search bar */}
      <View className="flex-row items-center rounded-full bg-black/5 p-[3px]"
        style={{ width: "85%" }}>
        <TextInput
          placeholder="Search any diary entry..."
          placeholderTextColor={'gray'}
          style={{ fontSize: hp(1.7) }}
          className="flex-1 mb-1 pl-3 tracking-wider"
          onChangeText={setSearchKeyword}
          value={searchKeyword}>
        </TextInput>
        <View className="bg-white rounded-full p-3">
          <Feather name="search" color="#000" size={24} />
        </View>
      </View>

      {/* Horizontal scroll bar for categories */}
      <View className="flex-row mb-2">
        <Categories activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          setActiveFavorite={setActiveFavorite}
          setSearchKeyword={setSearchKeyword} />
        {/* isFavorite button */}
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          className="flex items-center gap-3 mt-3">
          <TouchableOpacity
            className={`rounded-full p-[13px] ${activeFavorite ? "bg-amber-300" : "bg-blue-100"
              }`}
            onPress={() => {
              setSearchKeyword("");
              setActiveFavorite(true);
              setActiveCategory("");
            }}>
            <MaterialIcons name="favorite-outline" color="#000" size={24} />
          </TouchableOpacity>
          <Text className="text-neutral-600" style={{ fontSize: hp(1.6) }}>Favorites</Text>
        </Animated.View>
      </View>

      {/* show loading icon when the api is fetching data */}
      {loadingIcon &&
        <View className="flex-1 justify-center items-center mt-4">
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      }
      {
        diaryEntries.length > 0 ? (
          <View className="flex-1">
            <View className="flex-1 px-2">
              <MasonryList
                data={diaryEntries}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, i }) => (
                  <DiaryCard
                    diary={item as DiaryEntry}
                    i={i}
                    handleLongPress={handleLongPress}
                    navigation={navigation}
                  />
                )}
                onEndReachedThreshold={0.1}
              />
            </View>

            {/* Floating Plus Button */}
            <TouchableOpacity
              className="absolute bottom-10 right-10 w-16 h-16 rounded-full items-center justify-center shadow-lg"
              style={{ backgroundColor: "#0ea5e9" }}
              onPress={() => {
                navigation.navigate("AddDiary");
              }}
            >
              <Text className="text-white text-5xl font-medium">+</Text>
            </TouchableOpacity>
          </View>
        ) :
          (<NoData />)
      }

    </View>
  );
};

export default DiaryList;

type DiaryCardProps = {
  diary: DiaryEntry;
  i: number;
  handleLongPress: (diary: DiaryEntry) => void;
  navigation: NavigationProp<RootStackParamList>;
};


const DiaryCard = ({
  diary,
  i,
  handleLongPress,
  navigation,
}: DiaryCardProps) => {
  //height based on the length of the transcript
  const transcriptLength = diary.transcript.length;

  let cardHeight = hp(20); // default height

  if (transcriptLength >= 40) {
    cardHeight = hp(25);
  }

  return (
    <TouchableOpacity
      className="bg-gray-200 rounded-xl shadow-sm m-2"
      onLongPress={() => handleLongPress(diary)}
      onPress={() =>
        navigation.navigate("DiaryDetail", {
          id: diary.id,
        })
      }
    >
      <View
        style={{
          padding: 16,
          height: cardHeight
        }}
        className="flex justify-center"
      >
        <Text className="font-bold text-lg">
          {diary.title}
        </Text>

        <Text
          className="mt-2"
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          Transcript: {diary.transcript}
        </Text>

        <Text className="text-gray-500 text-sm mt-4">
          Category: {diary.category}
        </Text>

        <Text className="text-gray-500 text-sm mt-1">
          Date: {new Date(diary.createdAt).toDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

