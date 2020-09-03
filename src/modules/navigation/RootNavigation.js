import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator, Header } from '@react-navigation/stack';
import { Image, StyleSheet, TouchableOpacity, TouchableHighlight, View, Text } from 'react-native';
import StackNavigationData from './stackNavigationData';
const headerBackground = require('../../../assets/images/topBarBg.png');
const Stack = createStackNavigator();

export default function NavigatorView(props) {
  const headerRightComponentMenu = () => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.toggleDrawer()}
        style={{
          paddingRight: 10,
          width: 40
        }}
      >
        <Image
          source={require('../../../assets/images/drawer/menu.png')}
          resizeMode="contain"
          style={{
            height: 40
          }}
        />
      </TouchableOpacity>    
    )
  }

  const headerTitleComponent = () => {
    return (
         <Image
            source={require('../../../assets/images/armada-logo.png')}
            resizeMode="contain"
            style={{
                marginTop: 15,
               height: 45,
               width: 175
            }}
         />
    )
  }

  const headerLeft = () => {
    return (
    <View style={{width: 40}}>
    </View>
    )
  }

  return (
    <Stack.Navigator
        screenOptions={{
            headerTitle: headerTitleComponent(),
            headerTitleAlign: 'center',
            headerTitleStyle: {
                height: 70
            },
            headerRight: headerRightComponentMenu,
            headerStyle: { backgroundColor: 'rgb(10,42,84)' }
        }}
    >
      {StackNavigationData.map((item, idx) => (
        <Stack.Screen
          key={`stack_item-${idx+1}`}
          name={item.name}
          component={item.component} 
          options={{
            headerLeft: item.headerLeft || headerLeft,
          }}
        />
      ))}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100 + '%',
    height: Header.height,
  },
});