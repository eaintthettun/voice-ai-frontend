import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabs from "../navigation-tab/BottomTabs";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";

import { useAuth } from "../context/AuthContext";
import DiaryList from "../screens/DiaryList";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Main" component={BottomTabs} />
          <Stack.Screen name="DiaryList" component={DiaryList} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}