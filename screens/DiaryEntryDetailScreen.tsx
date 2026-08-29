import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react"
import diaryEntryService from "../services/diaryEntryService";
import { Image, Text, View } from "react-native"
import { colors } from "../theme";

//this is how we define props when working with react navigation
type RootStackParamList = {
    DiaryDetail: {
        id: string;
    };
};

type DiaryRouteProp = RouteProp<
    RootStackParamList,
    "DiaryDetail"
>;

export const DiaryEntryDetailScreen = () => {
    const route = useRoute<DiaryRouteProp>();

    const {
        id
    } = route.params;

    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [audio, setAudio] = useState("");
    const [transcript, setTranscript] = useState("");
    const [createdAt, setCreatedAt] = useState("");

    useEffect(() => {
        const fetchDiaryEntry = async () => {
            const result = await diaryEntryService.getDiaryEntryDetail(id);
            console.log('result:', result)

            if (result.message === "Diary entry detail get successfully") {
                setTitle(result.diaryEntry.title);
                setTranscript(result.diaryEntry.transcript);
                setCategory(result.diaryEntry.category);
                setAudio(result.diaryEntry.filePath);
                setCreatedAt(result.diaryEntry.createdAt);
            }
        }
        fetchDiaryEntry();
    });



    return (
        <View className="my-10 p-5">
            <Text className={`${colors.heading} text-2xl font-bold text-center mb-4`}>
                {title}
            </Text>
            <View className="items-center mb-4">
                <Image
                    className="w-72 h-72"
                    source={require("../assets/diaryDetailPhoto.png")}
                />
            </View>
            <View className="mb-5">
                <Text className={`${colors.heading} text-base font-semibold mb-2`}>
                    Category
                </Text>

                <Text className="bg-white px-5 py-4 rounded-2xl border border-gray-200">
                    {category}
                </Text>
            </View>
            <View className="mb-5">
                <Text className={`${colors.heading} text-base font-semibold mb-2`}>
                    Transcript
                </Text>

                <Text className="bg-white px-5 py-4 rounded-2xl border border-gray-200">
                    {transcript}
                </Text>
            </View>
            <View className="mb-5">
                <Text className={`${colors.heading} text-base font-semibold mb-2`}>
                    Audio
                </Text>

                <Text className="bg-gray-200 px-5 py-4 rounded-2xl">
                    {audio}
                </Text>
            </View>
            <View className="mb-5">
                <Text className={`${colors.heading} text-base font-semibold mb-2`}>
                    Created At
                </Text>

                <Text className="bg-white px-5 py-4 rounded-2xl border border-gray-200">
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