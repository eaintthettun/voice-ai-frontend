import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { colors } from "../theme";
import { useState } from "react";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import diaryEntryService from "../services/diaryEntryService";


type RootStackParamList = {
    EditDiary: {
        id: string;
        title: string;
        transcript: string;
        category: string;
    };
    DiaryDetail: {
        id:string
    }
};

type EditDiaryRouteProp = RouteProp<
    RootStackParamList,
    "EditDiary"
>;


export default function EditNoteScreen() {
    const route = useRoute<EditDiaryRouteProp>();

    const {
        id,
        title,
        transcript,
        category,
    } = route.params;

    console.log("id in edit screen:",id)


    const [editedTranscript, setEditedTranscript] = useState(transcript);
    const [editedCategory, setEditedCategory] = useState(category);
    const [editedTitle, setEditedTitle] = useState(title);
    const navigation=useNavigation<NavigationProp<RootStackParamList>>();

    const handleUpdate=async () => {
        const result=await diaryEntryService.updateDiaryEntry(id,editedTitle,editedTranscript)

        if(result.message == "Edited diary entry successfully"){
            Alert.alert("Updated successfully");
            navigation.navigate("DiaryDetail",{id:id})
        }
    }

    return (
        <View className="my-10 p-3">
            <Text className={`${colors.heading} text-2xl font-bold text-center mb-4`}>
                Edit Diary Entry
            </Text>
            <View className="items-center mb-4">
                <Image
                    className="w-72 h-72"
                    source={require("../assets/editNotePhoto.png")}
                />
            </View>
            <View className="mb-5">
                <Text className={`${colors.heading} text-base font-semibold mb-2`}>
                    Title
                </Text>

                <TextInput
                    className="bg-white px-5 py-4 rounded-2xl border border-gray-200"
                    placeholder="Enter diary title..."
                    value={editedTitle}
                    onChangeText={setEditedTitle}
                />
            </View>
            <View className="mb-5">
                <Text className={`${colors.heading} text-base font-semibold mb-2`}>
                    Transcript
                </Text>

                <TextInput
                    className="bg-white px-5 py-5 rounded-2xl border border-gray-200"
                    placeholder="Enter diary transcript..."
                    value={editedTranscript}
                    onChangeText={setEditedTranscript}
                />
            </View>
            <View className="mb-5">
                <Text className={`${colors.heading} text-base font-semibold mb-2`}>
                    Category
                </Text>

                <View className="bg-gray-200 px-5 py-4 rounded-2xl">
                    <Text>{editedCategory}</Text>
                </View>

            </View>
            <TouchableOpacity
                className="bg-blue-600 py-4 rounded-2xl"
                onPress={handleUpdate}
            >
                <Text className="text-white text-center text-lg font-semibold">
                    Save Diary
                </Text>
            </TouchableOpacity>
        </View>
    )
}
