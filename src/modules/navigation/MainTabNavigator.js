import * as React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { store } from '../../redux/store.js';
import tabNavigationData from './tabNavigationData';
import { translate } from '../../translations/index.js';
import { getUserAcademies } from '../../redux/users/actions';

const Tab = createBottomTabNavigator();

export default class MainTabNavigator extends React.Component {

  state = {
    isAcademyOwner: false
  }

  async getData() {
    let currentUser = this.props.loggedInUser;
    if(currentUser) {
        await this.props.getUserAcademies(currentUser._id);
        let userAcademies = this.props.userAcademies[currentUser._id];
        let isAcademyOwner = !!(userAcademies && userAcademies.owner && userAcademies.owner.length);
        this.setState({ isAcademyOwner });
    }
  }

  async componentDidMount() {
     await this.getData()
  }

  async componentDidUpdate(prevProps, prevState) {
    if(prevProps.academyListUpdate !== this.props.academyListUpdate || prevProps.loggedInUser !== this.props.loggedInUser) {
        this.getData()
    }
  }

  headerLeft = () => {
    return (
    <View style={{width: 40}}>
    </View>
    )
  }

    render() {
      return (
        <Tab.Navigator>
          {tabNavigationData.filter(item => ((item.ifOwner && this.state.isAcademyOwner) || !item.ifOwner)).map((item, idx) => (
            <Tab.Screen
              key={`tab_item${idx+1}`}
              name={translate(item.name)}
              component={item.component}
              options={{
                  headerLeft: item.headerLeft || this.headerLeft,
                  tabBarIcon: ({ focused }) => (
                    <View style={styles.tabBarItemContainer}>
                      <Icon
                                                name={item.icon}
                                                style={{
                                                  fontSize: 30,
                                                  color: colors.secondaryIcon
                                                }}
                                              />
                    </View>
                  ),
                  tabBarLabel: ({ focused }) => <Text style={{ fontSize: 14, color: focused ? colors.secondaryText : colors.secondaryIcon }}>{ translate(item.name) }</Text>
                }}
            />
          ))}
        </Tab.Navigator>
      );
    }

};

const styles = StyleSheet.create({
  tabBarItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.terciaryBackground,
    paddingHorizontal: 10,
  },
  tabBarIcon: {
    width: 23,
    height: 23,
  },
  tabBarIconFocused: {
    tintColor: colors.primary,
  },
});