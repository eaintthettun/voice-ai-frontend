import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './navigation-tab/BottomTabs';


const RootStack = createNativeStackNavigator({
  screens: {
    // Login: {
    //   screen: LoginScreen,
    //   options: {
    //     headerShown: false,
    //   },
    // },
    // SignUp: {
    //   screen: SignUpScreen,
    //   options: {
    //     headerShown: false,
    //   },
    // },
    Main: {
      screen: BottomTabs,
      options: {
        headerShown: false,
      },
    },
  },
});

export default RootStack;