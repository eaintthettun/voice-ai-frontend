import { View,Text,Image, TextInput, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated,{ FadeInUp,FadeInDown } from "react-native-reanimated";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

function SignUpScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />
      <Image className="h-full w-full absolute" source={require("../assets/background.png")} />

      {/* lights */}
      <View className='flex-row justify-around w-full absolute'>
        <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className="h-[225] w-[90]" source={require('../assets/light.png')}/>
        <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} className="h-[160] w-[65]" source={require('../assets/light.png')}/>
      </View>

      {/* title and form */}
      <View className="w-full h-full flex justify-around pt-40 pb-10">
        {/* title */}
        <View className="flex items-center">
            <Animated.Text entering={FadeInUp.duration(1000).springify()} className="text-white font-bold text-4xl ">Sign Up</Animated.Text>
        </View>
        {/* form */}
        <View className="flex items-center mx-4 spacy-y-4">
            <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-black/5 p-3 rounded-2xl w-full">
                <TextInput placeholder="Username" placeholderTextColor={'gray'}/>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-black/5 p-3 rounded-2xl w-full mt-3">
                <TextInput placeholder="Email" placeholderTextColor={'gray'}/>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="bg-black/5 p-3 rounded-2xl w-full mt-3 mb-5">
                <TextInput placeholder="Password" secureTextEntry placeholderTextColor={'gray'}/>
            </Animated.View>
            {/* button */}
            <Animated.View  entering={FadeInDown.delay(600).duration(1000).springify()} className="w-full">
                <TouchableOpacity className="w-full bg-sky-400 p-3 rounded-2xl mb-4">
                    <Text className="text-xl font-bold text-white text-center">Sign Up</Text>
                </TouchableOpacity>
            </Animated.View>
            <Animated.View  entering={FadeInDown.delay(800).duration(1000).springify()} className="flex-row justify-center">
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text className="text-sky-600">Login</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
      </View>
    </View>
  );
}

export default SignUpScreen;