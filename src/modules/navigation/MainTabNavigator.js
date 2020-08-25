import * as React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { store } from '../../redux/store.js';
import tabNavigationData from './tabNavigationData';
import { translate } from '../../translations/index.js';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {

  const headerLeft = () => {
    return (
    <View style={{width: 40}}>
    </View>
    )
  }

  return (
    <Tab.Navigator>
      {tabNavigationData.map((item, idx) => (
        <Tab.Screen 
          key={`tab_item${idx+1}`}
          name={translate(item.name)}
          component={item.component}
          options={{
              headerLeft: item.headerLeft || headerLeft,
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