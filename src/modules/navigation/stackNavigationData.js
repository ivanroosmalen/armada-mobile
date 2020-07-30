import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

import TabNavigator from './MainTabNavigator';
import AcademyScreen from '../academies/AcademyViewContainer';
import AcademyEditScreen from '../academies/AcademyEditViewContainer';
import AcademyCreateScreen from '../academies/AcademyCreateViewContainer';
import AcademyListScreen from '../academies/AcademyListViewContainer';
import ProfileScreen from '../profile/ProfileViewContainer';
import ProfileEditScreen from '../profile/ProfileEditViewContainer';
import UpdatePasswordScreen from '../auth/UpdatePasswordContainer';
import ForgotPasswordScreen from '../auth/ForgotPasswordContainer';
import GalleryScreen from '../gallery/GalleryViewContainer';
import ArticleScreen from '../article/ArticleViewContainer';
import ChatScreen from '../chat/ChatViewContainer';
import MessagesScreen from '../chat/MessagesViewContainer';
import ChartsScreen from '../charts/ChartsViewContainer';
import AuthScreen from '../auth/AuthViewContainer';
import BlogScreen from '../blog/BlogContainer';
import PostScreen from '../blog/PostView';

import { colors, fonts } from '../../styles';

const headerLeftComponent = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        paddingLeft: 10,
      }}
    >
      <Image
        source={require('../../../assets/images/icons/arrow-back.png')}
        resizeMode="contain"
        style={{
          height: 20,
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
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Charts',
    displayName: 'Charts',
    component: ChartsScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Gallery',
    displayName: 'Gallery',
    component: GalleryScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Profile',
    displayName: 'Profile',
    component: ProfileScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'ProfileEdit',
    displayName: 'Edit Profile',
    component: ProfileEditScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Academy',
    displayName: 'Academy',
    component: AcademyScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
      name: 'AcademyList',
      displayName: 'Academies',
      component: AcademyListScreen,
      headerLeft: headerLeftComponent,
      headerBackground: { source: headerBackground },
      headerTitleStyle: {
        fontFamily: fonts.primaryRegular,
        color: colors.white,
        fontSize: 18,
      },
    },
    {
      name: 'AcademyEdit',
      displayName: 'Edit Academy',
      component: AcademyEditScreen,
      headerLeft: headerLeftComponent,
      headerBackground: { source: headerBackground },
      headerTitleStyle: {
        fontFamily: fonts.primaryRegular,
        color: colors.white,
        fontSize: 18,
      },
    },
    {
      name: 'AcademyCreate',
      displayName: 'Create Academy',
      component: AcademyCreateScreen,
      headerLeft: headerLeftComponent,
      headerBackground: { source: headerBackground },
      headerTitleStyle: {
        fontFamily: fonts.primaryRegular,
        color: colors.white,
        fontSize: 18,
      },
    },
  {
    name: 'Account',
    displayName: 'Account',
    component: UpdatePasswordScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
      name: 'ForgotPassword',
      displayName: 'Forgot Password',
      component: ForgotPasswordScreen,
      headerLeft: headerLeftComponent,
      headerBackground: { source: headerBackground },
      headerTitleStyle: {
        fontFamily: fonts.primaryRegular,
        color: colors.white,
        fontSize: 18,
      },
    },
  {
    name: 'Article',
    displayName: 'Article',
    component: ArticleScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Chat',
    displayName: 'Chat',
    component: ChatScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Messages',
    displayName: 'Messages',
    component: MessagesScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Auth',
    displayName: 'Login / Register',
    component: AuthScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Blog',
    displayName: 'Blog',
    component: BlogScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
  },
  {
    name: 'Post',
    displayName: 'Post',
    component: PostScreen,
    headerLeft: headerLeftComponent,
    headerBackground: { source: headerBackground },
    headerTitleStyle: {
      fontFamily: fonts.primaryRegular,
      color: colors.white,
      fontSize: 18,
    },
    
  },
]

export default StackNavigationData;