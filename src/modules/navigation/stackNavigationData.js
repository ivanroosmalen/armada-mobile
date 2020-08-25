import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

import TabNavigator from './MainTabNavigator';
import HomeScreen from '../home/HomeViewContainer';
import AcademyScreen from '../academies/AcademyViewContainer';
import AcademyEditScreen from '../academies/AcademyEditViewContainer';
import AcademyCreateScreen from '../academies/AcademyCreateViewContainer';
import AcademyListScreen from '../academies/AcademyListViewContainer';
import AcademyRequestListScreen from '../academies/AcademyRequestListViewContainer';
import UserAcademiesScreen from '../academies/UserAcademiesViewContainer';
import ProfileScreen from '../profile/ProfileViewContainer';
import ProfileEditScreen from '../profile/ProfileEditViewContainer';
import ScheduleScreen from '../schedule/ScheduleViewContainer';
import UserScheduleScreen from '../schedule/UserScheduleViewContainer';
import ClassEditScreen from '../classes/ClassEditViewContainer';
import ClassScreen from '../classes/ClassViewContainer';
import UpdatePasswordScreen from '../auth/UpdatePasswordContainer';
import ForgotPasswordScreen from '../auth/ForgotPasswordContainer';
import AuthScreen from '../auth/AuthViewContainer';
import { translate } from '../../translations/index.js';

import { colors, fonts } from '../../styles';

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

const headerBackground = require('../../../assets/images/topBarBg.png');

const StackNavigationData = [
  {
    name: 'React Native Starter',
    displayName: 'Armada',
    component: TabNavigator,
    headerLeft: null,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.primaryText,
      fontSize: 18,
      height: 70
    },
  },
  {
      name: 'Home',
      displayName: 'Armada',
      component: TabNavigator,
      headerLeft: null,
      headerBackground: { source: headerBackground },
      headerTitleStyle: {
        fontFamily: fonts.primaryRegular,
        color: colors.primaryText,
        fontSize: 18,
        height: 70
      },
    },
  {
    name: 'Profile',
    displayName: translate('profile'),
    component: ProfileScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.primaryText,
      fontSize: 18,
      height: 70,
    },
  },
  {
    name: 'ProfileEdit',
    displayName: translate('editProfile'),
    component: ProfileEditScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.primaryText,
      fontSize: 18,
      height: 70
    },
  },
  {
    name: 'Schedule',
    displayName: translate('schedule'),
    component: ScheduleScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.primaryText,
      fontSize: 18,
      height: 70
    }
  },
  {
        name: 'UserSchedule',
        displayName: translate('mySchedule'),
        component: UserScheduleScreen,
        headerLeft: headerLeftComponent,
        headerBackground: { source: headerBackground },
        headerTitleStyle: {
          fontFamily: fonts.primaryRegular,
          color: colors.primaryText,
          fontSize: 18,
          height: 70
        },
      },
  {
    name: 'Class',
    displayName: translate('class'),
    component: ClassScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.primaryText,
      fontSize: 18,
      height: 70
    }
  },
  {
    name: 'ClassEdit',
    displayName: translate('editClass'),
    component: ClassEditScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.primaryText,
      fontSize: 18,
      height: 70
    }
  },
  {
    name: 'Academy',
    displayName: translate('academy'),
    component: AcademyScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.primaryText,
      fontSize: 18,
      height: 70
    },
  },
  {
        name: 'UserAcademies',
        displayName: translate('myAcademies'),
        component: UserAcademiesScreen,
        headerLeft: headerLeftComponent,
        headerBackground: { source: headerBackground },
        headerTitleStyle: {
          fontFamily: fonts.primaryRegular,
          color: colors.primaryText,
          fontSize: 18,
          height: 70
        },
      },
  {
      name: 'AcademyList',
      displayName: translate('academies'),
      component: AcademyListScreen,
      headerLeft: headerLeftComponent,
      headerBackground: { source: headerBackground },
      headerTitleStyle: {
        fontFamily: fonts.primaryRegular,
        color: colors.primaryText,
        fontSize: 18,
        height: 70
      },
    },
    {
      name: 'AcademyEdit',
      displayName: translate('editAcademy'),
      component: AcademyEditScreen,
      headerLeft: headerLeftComponent,
      headerBackground: { source: headerBackground },
      headerTitleStyle: {
        fontFamily: fonts.primaryRegular,
        color: colors.primaryText,
        fontSize: 18,
        height: 70
      },
    },
    {
          name: 'AcademyCreate',
          displayName: translate('editAcademy'),
          component: AcademyCreateScreen,
          headerLeft: headerLeftComponent,
          headerBackground: { source: headerBackground },
          headerTitleStyle: {
            fontFamily: fonts.primaryRegular,
            color: colors.primaryText,
            fontSize: 18,
            height: 70
          },
        },
    {
      name: 'AcademyRequestList',
      displayName: translate('membershipRequests'),
      component: AcademyRequestListScreen,
      headerLeft: headerLeftComponent,
      headerBackground: { source: headerBackground },
      headerTitleStyle: {
        fontFamily: fonts.primaryRegular,
        color: colors.primaryText,
        fontSize: 18,
        height: 70
      },
    },
  {
    name: 'Account',
    displayName: translate('account'),
    component: UpdatePasswordScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.primaryText,
      fontSize: 18,
      height: 70
    },
  },
  {
      name: 'ForgotPassword',
      displayName: translate('forgotPassword'),
      component: ForgotPasswordScreen,
      headerLeft: headerLeftComponent,
      headerBackground: { source: headerBackground },
      headerTitleStyle: {
        fontFamily: fonts.primaryRegular,
        color: colors.primaryText,
        fontSize: 18,
        height: 70
      },
    },
  {
    name: 'Auth',
    displayName: translate('loginRegister'),
    component: AuthScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.primaryText,
      fontSize: 18,
      height: 70
    },
  },
]

export default StackNavigationData;