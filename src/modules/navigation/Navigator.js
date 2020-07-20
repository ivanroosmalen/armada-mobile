import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { 
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import NavigatorView from './RootNavigation';
import { store } from '../../redux/store.js';
import { colors } from '../../styles';
import ImagePicker from 'react-native-image-picker'

import { updateThumbnailImage } from '../../redux/users/actions';
import S3Service from '../../http/s3-service.js';
const s3Service = new S3Service();

const iconHome = require('../../../assets/images/drawer/home.png');
const iconCalendar = require('../../../assets/images/drawer/calendar.png');
const iconGrids = require('../../../assets/images/drawer/grids.png');
const iconPages = require('../../../assets/images/drawer/pages.png');
const iconComponents = require('../../../assets/images/drawer/components.png');
const iconSettings = require('../../../assets/images/drawer/settings.png');
const placeholderImage = require('../../../assets/images/drawer/user.png');

const drawerData = [
  {
    name: 'Home',
    icon: iconHome,
  }
];

const Drawer = createDrawerNavigator();

async function selectImage() {
        const state = store.getState();
        const loggedInUser = state.users.loggedInUser

        const options = {
          noData: false,
          mediaType: 'photo'
        }
        ImagePicker.showImagePicker(options, async file => {
          if (file.uri) {
            let response = await store.dispatch(updateThumbnailImage(loggedInUser._id, { contentType: file.type }))
            let uploadUrl = response.data.entity;

            if(uploadUrl) {
                let url = uploadUrl.split('?')[0];
                await s3Service.uploadImage(file, url);

                loggedInUser.thumbnailImg = url;
                await store.dispatch({type: 'LOGGED_IN_USER', data: loggedInUser});
            }
          }
        })
  }

function CustomDrawerContent(props) {
  const state = store.getState();
  let currentUser = state.users.loggedInUser;
  let placeholderImage = 'https://armada-user-images.s3.amazonaws.com/default/thumbnail.jpg'

  return (
    <DrawerContentScrollView {...props} style={{padding: 0}}>
      {currentUser && currentUser._id && (
      <View>
      <DrawerItem
          label={() => (
          <View>
              <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={() => selectImage()}>
                    <Image
                      style={styles.avatar}
                      source={{ uri: state.users.loggedInUser.thumbnailImg || placeholderImage }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate('Profile')}>
                    <View style={{ paddingLeft: 15 }}>
                      <Text style={styles.userName}>{currentUser.alias}</Text>
                    </View>
                </TouchableOpacity>
              </View>
          </View>)} />

        <DrawerItem
          key={`account`}
          label={() => (
            <View
              style={styles.menuLabelFlex}>
                <Image
                  style={{ width: 20, height: 20}}
                  source={iconSettings}
                />
              <Text style={styles.menuTitle}>Account</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Account')}
        />

          <View style={styles.divider} />
          </View>
      )}

      {drawerData.map((item, idx) => (
        <DrawerItem
          key={`drawer_item-${idx+1}`}
          label={() => (
            <View
              style={styles.menuLabelFlex}>
              <Image
                style={{ width: 20, height: 20}}
                source={item.icon}
              />
              <Text style={styles.menuTitle}>{item.name}</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate(item.name)}
        />        
      ))}
      <View style={styles.divider} />
      {currentUser && (
          <DrawerItem
            label={() => (
              <View style={styles.menuLabelFlex}>
                <Text style={styles.menuTitle}>Logout</Text>
              </View>
            )}
            onPress={() =>  {
                    props.navigation.navigate('Auth')
                }
            }
          />
      )}

      {!currentUser && (
                <DrawerItem
                  label={() => (
                    <View style={styles.menuLabelFlex}>
                      <Image
                        style={{ width: 20, height: 20}}
                        source={iconSettings}
                      />
                      <Text style={styles.menuTitle}>Login / Register</Text>
                    </View>
                  )}
                  onPress={() => props.navigation.navigate('Auth')}
                />
            )}
    </DrawerContentScrollView>
  );
}

export default function App(props) {
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: colors.drawer,
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Homes" component={NavigatorView} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  menuTitle: {
    marginLeft: 10,
    color: '#fff'
  },
  menuLabelFlex: {
    display: 'flex',
    flexDirection: 'row'
  },
  userName: {
    color: '#fff',
    fontSize: 18
  },
  divider: {
    borderBottomColor: 'white',
    opacity: 0.2,
    borderBottomWidth: 1,
    margin: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20,
    marginBottom: 10
  },
});
