import { NavigationContainer } from "@react-navigation/native";

import "./global.css";

import { AuthProvider } from "./context/AuthContext";
import RootNavigator from "./navigation/RootNavigator";

//hello
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}