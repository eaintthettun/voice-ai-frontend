import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { colors } from "../theme";
import { useState } from "react";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import diaryEntryService from "../services/diaryEntryService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
    //for accepting props
    EditDiary: {
        id: string;
        title: string;
        transcript: string;
        category: string;
    };
    //for navigation
    DiaryDetail: {
        id: string
    }
};

//for props access, we need to define the type of the route prop
type EditDiaryRouteProp = RouteProp<
    RootStackParamList,
    "EditDiary"
>;


export default function EditNoteScreen() {
    const route = useRoute<EditDiaryRouteProp>();
    const { top } = useSafeAreaInsets();

    const {
        id,
        title,
        transcript,
        category,
    } = route.params;

    const [editedTranscript, setEditedTranscript] = useState(transcript);
    const [editedCategory, setEditedCategory] = useState(category);
    const [editedTitle, setEditedTitle] = useState(title);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleUpdate = async () => {
        const result = await diaryEntryService.updateDiaryEntry(id, editedTitle, editedTranscript)

        if (result.message == "Edited diary entry successfully") {
            Alert.alert("Updated successfully");
            navigation.navigate("DiaryDetail", { id: id })
        }
    }

    return (
        <View className="flex-1">
            <View className="flex-row items-center bg-sky-600 rounded-3xl" style={{ paddingTop: top }}>
                <View className="flex-1 mx-2"  >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color="#ffffff"
                        />
                    </TouchableOpacity>
                </View>
                <View className="flex-1 text-center">
                    <Text className={`text-white text-xl font-bold text-center mb-4`}>
                        Edit Diary
                    </Text>
                </View>
                <View className="flex-1"></View>
            </View>
            <View className="items-center mb-4">
                <Image
                    className="w-72 h-72"
                    source={require("../assets/editNotePhoto.png")}
                />
            </View>
            <View className="mb-5">
                <Text className={`${colors.heading} text-base font-semibold mb-2 mx-2`}>
                    Title
                </Text>

                <TextInput
                    className="bg-white px-5 py-4 rounded-2xl border border-gray-200 mx-2"
                    placeholder="Enter diary title..."
                    value={editedTitle}
                    onChangeText={setEditedTitle}
                />
            </View>
            <View className="mb-5 mx-2">
                <Text className={`${colors.heading} text-base font-semibold mb-2`}>
                    Transcript
                </Text>

                <TextInput
                    className="bg-white px-5 py-5 rounded-2xl border border-gray-200 mx-2"
                    placeholder="Enter diary transcript..."
                    value={editedTranscript}
                    onChangeText={setEditedTranscript}
                />
            </View>
            <View className="mb-5 mx-2">
                <Text className={`${colors.heading} text-base font-semibold mb-2`}>
                    Category
                </Text>

                <View className="bg-gray-200 px-5 py-4 rounded-2xl mx-2">
                    <Text>{editedCategory}</Text>
                </View>

            </View>
            <TouchableOpacity
                className="bg-blue-600 py-4 rounded-2xl mx-2"
                onPress={handleUpdate}
            >
                <Text className="text-white text-center text-lg font-semibold">
                    Save Diary
                </Text>
            </TouchableOpacity>
        </View>
    )
}
