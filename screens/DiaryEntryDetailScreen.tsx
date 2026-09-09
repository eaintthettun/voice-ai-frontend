import { RouteProp, useNavigation, useRoute, NavigationProp } from "@react-navigation/native";
import { useEffect, useState } from "react"
import diaryEntryService from "../services/diaryEntryService";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native"
import { colors } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";


type RootStackParamList = {
    //for accepting props
    DiaryDetail: {
        id: string;
    };
    //for navigation
    EditDiary: {
        id: string;
        title: string;
        transcript: string;
        category: string;
    };
    DiaryList: undefined;
};

type DiaryRouteProp = RouteProp<
    RootStackParamList,
    "DiaryDetail"
>;

export const DiaryEntryDetailScreen = () => {
    const { top } = useSafeAreaInsets();
    const route = useRoute<DiaryRouteProp>();
    const [menuVisible, setMenuVisible] = useState(false);

    const {
        id
    } = route.params;

    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [audio, setAudio] = useState("");
    const [transcript, setTranscript] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const navigation =
        useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        const fetchDiaryEntry = async () => {
            const result = await diaryEntryService.getDiaryEntryDetail(id);

            if (result.message === "Diary entry detail get successfully") {
                setTitle(result.diaryEntry.title);
                setTranscript(result.diaryEntry.transcript);
                setCategory(result.diaryEntry.category);
                setAudio(result.diaryEntry.filePath);
                setCreatedAt(result.diaryEntry.createdAt);
            }
        }
        fetchDiaryEntry();
    }, [id]);

    const handleEdit = () => {
        navigation.navigate("EditDiary", {
            id,
            title,
            transcript,
            category,
        });
    }

    const handleDelete = async () => {
        try {
            await diaryEntryService.deleteDiaryEntry(id);

            Alert.alert("Success", "Diary deleted.");
            navigation.navigate("DiaryList");
        } catch (error) {
            Alert.alert("Error", "Failed to delete diary.");
        }
    }

    const showDeleteAlert = () => {
        Alert.alert(
            title,
            "Are you sure you want to delete this diary entry?",
            [
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => handleDelete(),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    }



    return (
        <View className="flex -1">
            <View style={{ paddingTop: top }} className="flex-row justify-between bg-sky-600 rounded-b-3xl p-3">
                <TouchableOpacity className="mt-4 " onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back"
                        size={20}
                        color="#ffffff"
                    />
                </TouchableOpacity>
                <Text className={`text-white text-xl font-bold text-center mt-3`}>
                    {title}
                </Text>
                <View>
                    <TouchableOpacity className="mt-4 " onPress={() => setMenuVisible(!menuVisible)}>
                        <Ionicons
                            name="ellipsis-vertical"
                            size={20}
                            color="#ffffff"
                        />
                    </TouchableOpacity>

                    {menuVisible && (
                        <View className="absolute right-0 top-12 bg-white rounded-xl shadow-lg w-32">
                            <TouchableOpacity
                                className="px-4 py-3"
                                onPress={handleEdit}
                            >
                                <Text className="text-base">Edit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="px-4 py-3"
                                onPress={showDeleteAlert}
                            >
                                <Text className="text-base text-red-500">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
            <View className="items-center mb-4">
                <Image
                    className="w-72 h-72"
                    source={require("../assets/diaryDetailPhoto.png")}
                />
            </View>
            <View className="mb-5">
                <Text className={`${colors.heading} text-base font-semibold mb-2 mx-2`}>
                    Category
                </Text>

                <Text className="bg-white px-5 py-4 rounded-2xl border border-gray-200 mx-2">
                    {category}
                </Text>
            </View>
            <View className="mb-5">
                <Text className={`${colors.heading} text-base font-semibold mb-2 mx-2`}>
                    Transcript
                </Text>

                <Text className="bg-white px-5 py-4 rounded-2xl border border-gray-200 mx-2">
                    {transcript}
                </Text>
            </View>
            <View className="mb-5">
                <Text className={`${colors.heading} text-base font-semibold mb-2 mx-2`}>
                    Audio
                </Text>

                <Text className="bg-gray-200 px-5 py-4 rounded-2xl mx-2">
                    {audio}
                </Text>
            </View>
            <View className="mb-5">
                <Text className={`${colors.heading} text-base font-semibold mb-2 mx-2`}>
                    Created At
                </Text>

                <Text className="bg-white px-5 py-4 rounded-2xl border border-gray-200 mx-2">
                    {createdAt
                        ? new Date(createdAt).toLocaleString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                        })
                        : "Loading..."}
                </Text>
            </View>
        </View>
    )
}