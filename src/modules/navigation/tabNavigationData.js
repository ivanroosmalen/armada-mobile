import HomeScreen from '../home/HomeViewContainer';
import AcademyListScreen from '../academies/AcademyListViewContainer';
import OwnerDashboardScreen from '../home/OwnerDashboardViewContainer';
import AcademyMetricsScreen from '../academies/AcademyMetricsViewContainer';
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
    name: 'managerDashboard',
    component: OwnerDashboardScreen,
    icon: 'view-dashboard',
    headerLeft: null,
    ifOwner: true
  },
  {
    name: 'metrics',
    component: AcademyMetricsScreen,
    icon: 'chart-line',
    headerLeft: null,
    ifOwner: true
  }
];

export default tabNavigationData;