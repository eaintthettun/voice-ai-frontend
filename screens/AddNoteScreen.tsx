import { Text, View, Image, TextInput, Button, TouchableOpacity, Alert } from "react-native";
import { colors } from '../theme'
import RecordAudioButton from "../components/RecordAudioButton";
import { useState } from "react";
import diaryEntryService from "../services/diaryEntryService";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  DiaryList: undefined;
};

export default function AddNoteScreen() {
  const [transcript, setTranscript] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [audioUri, setAudioUri] = useState("");
  const [filePath,setFilePath]= useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleTranscribe = async () => {
    const result = await diaryEntryService.transcribeDiaryEntry(title, audioUri);

    if(result){
      setTranscript(result.transcript)
      setCategory(result.category)
      setFilePath(result.filePath);
    }
  };

  const handleCreate = async () => {
    const result = await diaryEntryService.createDiaryEntry
    (title, transcript,category,filePath);

    if(result){
       Alert.alert("Diary Entry Created Successfully")
       navigation.navigate("DiaryList")
    };
    
  }

  return (
    <View className="flex-1 mx-4 mt-4 justify-between">

      {/* Top + form */}
      <View>
        <Text
          className={`${colors.heading} text-xl font-bold text-center`}
        >
          Add Diary Entry
        </Text>

        <View className="flex-row justify-center">
          <Image
            className="w-60 h-60"
            source={require("../assets/addNotePhoto.png")}
          />
        </View>

        <View className="gap-2">
          <Text className={`${colors.heading} text-lg font-bold`}>
            Add Title
          </Text>

          <TextInput className="p-4 bg-white rounded-full mb-3" value={title} onChangeText={setTitle} />

          <Text className={`${colors.heading} text-lg font-bold`}>
            Add Recording
          </Text>

          <RecordAudioButton
            onRecordingComplete={(uri) => setAudioUri(uri)}
          />
        </View>
      </View>

      {/* Bottom button */}
      <View className="mb-5">
        <TouchableOpacity
          className="w-full bg-sky-400 p-1 rounded-full"
          onPress={handleTranscribe}
        >
          <Text className="text-xl text-white text-center">
            Transcribe and Predict
          </Text>
        </TouchableOpacity>
      </View>

      <View className="bg-gray-200 gap-2 mb-2">
        <Text className={`${colors.heading} text-md font-bold`}>Transcript: {transcript}</Text>
        <Text className={`${colors.heading} text-md font-bold`}>Category: {category}</Text>
        <TouchableOpacity
          className="w-full bg-blue-600 p-3 rounded-full"
          onPress={handleCreate}
        >
          <Text className="text-xl text-white text-center">
            Create
          </Text>
        </TouchableOpacity>
      </View> 
    </View>
  );
}