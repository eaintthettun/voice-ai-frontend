import { View, ActivityIndicator } from "react-native";

const LoadingScreen = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" />
    </View>
  );
};

export default LoadingScreen;