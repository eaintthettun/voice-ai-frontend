import { Text, View } from "react-native"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const NoData = () => {
    return (
        <View className="flex gap-5  items-center justify-center h-[70%]">
            <MaterialCommunityIcons name="note-edit-outline" color="#00000088" size={50} />
            <Text className="text-neutral-500">No notes here yet</Text>
        </View>
    )
}