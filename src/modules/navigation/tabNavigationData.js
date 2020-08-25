import HomeScreen from '../home/HomeViewContainer';
import AcademyListScreen from '../academies/AcademyListViewContainer';
import { TouchableOpacity, Image } from 'react-native';

const headerLeftComponent = (props) => {
        return (
            <TouchableOpacity
              onPress={props.onPress}
              style={{
                paddingLeft: 20,
                width: 40
              }}
            >
              <Image
                source={require('../../../assets/images/icons/arrow-back.png')}
                resizeMode="contain"
                style={{
                  height: 20,
                  color: 'white'
                }}
              />
            </TouchableOpacity>
          )
    }

const tabNavigationData = [
  {
    name: 'home',
    component: HomeScreen,
    icon: 'home',
    headerLeft: null,
  },
  {
      name: 'academies',
      component: AcademyListScreen,
      icon: 'mixed-martial-arts',
      headerLeft: headerLeftComponent,
    }
];

export default tabNavigationData;