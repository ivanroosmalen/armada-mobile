import { createStackNavigator, createAppContainer } from "react-navigation";
import Home from './screens/home';
import SignUp from './screens/users/sign-up';
import Login from './screens/users/login';
import CreateAcademy from './screens/academies/create';

const AppNavigator = createStackNavigator(
    {
      Home: Home,
      SignUp: SignUp,
      Login: Login,
      CreateAcademy: CreateAcademy
    },
   {
     initialRouteName: "Home"
   }
);

export default AppNavigator;