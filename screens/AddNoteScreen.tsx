import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { colors } from "../theme";
import RecordAudioButton from "../components/RecordAudioButton";
import { useState } from "react";
import diaryEntryService from "../services/diaryEntryService";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  DiaryList: undefined;
};

export default function AddNoteScreen() {
  const [transcript, setTranscript] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [audioUri, setAudioUri] = useState("");
  const [filePath, setFilePath] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { top } = useSafeAreaInsets();

  const navigation =
    useNavigation<NavigationProp<RootStackParamList>>();

  const handleTranscribe = async () => {
    try {
      setIsTranscribing(true);
      const result = await diaryEntryService.transcribeDiaryEntry(
        title,
        audioUri
      );
      setIsTranscribing(false);

      if (result) {
        setTranscript(result.transcript);
        setCategory(result.category);
        setFilePath(result.filePath);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to transcribe recording.");
    }
  };

  const handleCreate = async () => {
    try {
      const result = await diaryEntryService.createDiaryEntry(
        title,
        transcript,
        category,
        filePath
      );

      if (result) {
        Alert.alert("Success", "Diary entry created successfully.");
        navigation.navigate("DiaryList");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create diary entry.");
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingBottom: 30,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
        <Text
          style={{ paddingTop: top }}
          className="text-white  bg-sky-600 rounded-b-3xl text-xl font-bold text-center p-3"
        >
          Add Diary
        </Text>

      {/* Illustration */}
      <View className="items-center mb-4">
        <Image
          className="w-72 h-72"
          source={require("../assets/addNotePhoto.png")}
        />
      </View>

      {/* Title */}
      <View className="mb-5">
        <Text className={`${colors.heading} text-base font-semibold mb-2 mx-4`}>
          Title
        </Text>

        <TextInput
          className="bg-white px-5 py-4 rounded-2xl border border-gray-200 mx-4"
          placeholder="Enter diary title..."
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Recording */}
      <View className="mb-5">
        <Text className={`${colors.heading} text-base font-semibold mb-2 mx-4`}>
          Audio
        </Text>

        <View className="bg-white rounded-2xl border border-gray-200 p-3 mx-4">
          <RecordAudioButton
            onRecordingComplete={(uri) => setAudioUri(uri)}
          />
        </View>
      </View>

      {/* Transcribe Button */}
      {audioUri !== "" && (
        <TouchableOpacity
          className="bg-sky-500 py-4 rounded-2xl mb-5 mx-4"
          onPress={handleTranscribe}
          disabled={isTranscribing}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {isTranscribing ? "⏳ Transcribing..." : "🎙️ Transcribe & Predict"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Result */}
      {transcript !== "" && (
        <View className="bg-white rounded-2xl p-5 border border-gray-200 mb-5  mx-2">

          <Text className={`${colors.heading} text-base font-semibold mb-2`}>
            Transcript
          </Text>

          <Text className="text-gray-600 mb-4">
            {transcript}
          </Text>

          <Text className={`${colors.heading} text-base font-semibold mb-2`}>
            Category
          </Text>

          <View className="bg-sky-100 self-start px-4 py-2 rounded-full mb-5">
            <Text className="text-sky-700 font-semibold">
              {category}
            </Text>
          </View>

          {/* Create */}
          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-2xl"
            onPress={handleCreate}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Create Diary
            </Text>
          </TouchableOpacity>

        </View>
      )}
    </ScrollView>
  );
}