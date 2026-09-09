import { act } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Animated,{ FadeInDown } from "react-native-reanimated";

const categoryData = [
    {
        name: "All",
        image: require("../assets/addNotePhoto.png")
    }, {
        name: "LEARNING",
        image: require("../assets/learning.png")
    },
    {
        name: "MEETING",
        image: require("../assets/meetings.png")
    }, {
        name: "TASKS",
        image: require("../assets/tasks.png")
    },
];

type CategoriesProps = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  setActiveFavorite: (favorite: boolean) => void;
  setSearchKeyword: (keyword: string) => void;
};

export default function Categories({activeCategory,setActiveCategory,setActiveFavorite,setSearchKeyword}:CategoriesProps) {
    return (
        <Animated.View entering={FadeInDown.duration(500).springify()}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 9 }}>
                {categoryData.map((cat, index) => {
                    let isActive= cat.name==activeCategory;
                    let activeButtonClass=isActive ? 'bg-amber-300':'bg-blue-100'
                    return (
                        <TouchableOpacity key={index}
                            onPress={()=>{
                                setSearchKeyword("");
                                setActiveFavorite(false);
                                setActiveCategory(cat.name)}
                            }
                            className="flex items-center gap-2">
                            <View className={`rounded-full mx-3 mt-3 p-[3px] ${activeButtonClass}`}>
                                <Image
                                    source={cat.image}
                                    style={{width:hp(6),height:(hp(6))}}
                                >     
                                </Image>
                            </View>
                            <Text className="text-neutral-600"
                            style={{fontSize:hp(1.6)}}>{cat.name}</Text>
                        </TouchableOpacity>
                    )
                })
                }
            </ScrollView>
        </Animated.View>
    );
}