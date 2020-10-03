import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { 
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  CommonActions
} from '@react-navigation/native';
import NavigatorView from './RootNavigation';
import { store } from '../../redux/store.js';
import { colors } from '../../styles';
import ImagePicker from 'react-native-image-picker'
import { translate } from '../../translations/index.js';
import { updateThumbnailImage, logout } from '../../redux/users/actions';
import S3Service from '../../http/s3-service.js';
const s3Service = new S3Service();
import Toast from 'react-native-simple-toast';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();

async function selectImage(props) {
        const state = store.getState();
        let currentUser = state.users.loggedInUser;
        const options = {
          noData: false,
          mediaType: 'photo'
        }
        ImagePicker.showImagePicker(options, async file => {
          if (file.uri) {
            let response = await store.dispatch(updateThumbnailImage(currentUser._id, { contentType: file.type }))
            let uploadUrl = response.data.entity;

            if(uploadUrl) {
                Toast.showWithGravity(translate('imageUpload'), Toast.LONG, Toast.TOP);
                await s3Service.uploadImage(file, uploadUrl);
                currentUser.thumbnailImg = uploadUrl.split('?')[0];
                await store.dispatch({type: 'LOGGED_IN_USER', data: currentUser});
            }

            props.navigation.closeDrawer();
          }
        })
  }

  async function onLogout(props) {
    await store.dispatch(logout());
    props.navigation.navigate('Auth')
  }

function CustomDrawerContent(props) {
  const state = store.getState();
  let currentUser = state.users.loggedInUser;

  let userAcademies = state.academies.userAcademies && state.academies.userAcademies[currentUser._id];
  let isAcademyOwner = !!(userAcademies && userAcademies.owner && userAcademies.owner.length)
  let academyRequests = state.academyRequests.academyRequests;
  let hasAcademyRequests = !!(academyRequests && academyRequests.length)

  return (
    <DrawerContentScrollView {...props} style={{padding: 0}}>
      {currentUser && currentUser._id && (
      <View>
      <View style={{flexDirection: 'row'}}>
      {!!(currentUser && currentUser.thumbnailImg) && (
      <DrawerItem
            key={`profileImage`}
            style={{width: 75}}
          label={() => (
              <View style={styles.avatarContainer}>
                        <Image
                          style={styles.avatar}
                          source={{ uri: currentUser.thumbnailImg }}
                        />
              </View>)}
          onPress={() => selectImage(props)}
          />
      )}
      <DrawerItem
            key={`editProfile`}
            style={{width: '100%'}}
          label={() => (
            <View style={{justifyContent: 'center', alignItems: 'center', height: 75, width: '100%'}}>
                <Text style={styles.userName}>{currentUser.alias || 'Edit profile'}</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Profile', { id: state.users.loggedInUser._id })}
          />
          </View>

          <View style={styles.divider} />
          </View>
      )}

        <DrawerItem
          key={`home`}
          label={() => (
            <View
              style={styles.menuLabelFlex}>
                <Icon
                          name="home"
                          style={{
                            fontSize: 20,
                            color: colors.primaryIcon
                          }}
                        />
              <Text style={styles.menuTitle}>{ translate('home') || 'home' }</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Home')}
        />

      {currentUser && (
        <View>
            <DrawerItem
              key={`profile`}
              label={() => (
                <View
                  style={styles.menuLabelFlex}>
                    <Icon
                              name="account"
                              style={{
                                fontSize: 20,
                                color: colors.primaryIcon
                              }}
                            />
                  <Text style={styles.menuTitle}>{ translate('myProfile') }</Text>
                </View>
              )}
              onPress={() => props.navigation.navigate('Profile', { id: state.users.loggedInUser._id })}
            />

            <DrawerItem
              key={`academies`}
              label={() => (
                <View
                  style={styles.menuLabelFlex}>
                    <Icon
                              name="mixed-martial-arts"
                              style={{
                                fontSize: 20,
                                color: colors.primaryIcon
                              }}
                            />
                  <Text style={styles.menuTitle}>{ translate('myAcademies') || 'My Academies' }</Text>
                </View>
              )}
              onPress={() => props.navigation.navigate('UserAcademies', { id: currentUser._id })}
            />

            <DrawerItem
              key={`schedule`}
              label={() => (
                <View
                  style={styles.menuLabelFlex}>
                    <Icon
                              name="calendar"
                              style={{
                                fontSize: 20,
                                color: colors.primaryIcon
                              }}
                            />
                  <Text style={styles.menuTitle}>{ translate('mySchedule') || 'My Schedule' }</Text>
                </View>
              )}
              onPress={() => props.navigation.navigate('UserSchedule', { id: currentUser._id })}
            />

            <DrawerItem
              key={`notifications`}
              label={() => (
                <View
                  style={styles.menuLabelFlex}>
                    <Icon
                              name="bullhorn"
                              style={{
                                fontSize: 20,
                                color: colors.primaryIcon
                              }}
                            />
                  <Text style={styles.menuTitle}>{ translate('myNotifications') || 'My Notifications' }</Text>
                </View>
              )}
              onPress={() => props.navigation.navigate('NotificationList')}
            />

            { isAcademyOwner && (
            <DrawerItem
              key={`requests`}
              label={() => (
                <View
                  style={styles.menuLabelFlex}>
                    <Icon
                              name="account-alert-outline"
                              style={{
                                fontSize: 20,
                                color: hasAcademyRequests ? colors.quintenaryText : colors.primaryIcon
                              }}
                            />
                  <Text style={{  marginLeft: 10, color: hasAcademyRequests ? colors.quintenaryText : colors.primaryText }}>{ translate('membershipRequests')  || 'Membership Requests' }</Text>
                </View>
              )}
              onPress={() => props.navigation.navigate('AcademyRequestList')}
            />
            )}
        </View>
      )}

      <View style={styles.divider} />

      {currentUser && (
        <View>
        <DrawerItem
          key={`account`}
          label={() => (
            <View
              style={styles.menuLabelFlex}>
                <Icon
                          name="account-edit"
                          style={{
                            fontSize: 20,
                            color: colors.primaryIcon
                          }}
                        />
              <Text style={styles.menuTitle}>{ translate('account') || 'Account'}</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Account')}
        />

          <DrawerItem
            key={`logout`}
            label={() => (
              <View style={styles.menuLabelFlex}>
                    <Icon
                          name="logout"
                          style={{
                            fontSize: 20,
                            color: colors.primaryIcon
                          }}
                        />
                <Text style={styles.menuTitle}>{ translate('logout') || 'Logout' }</Text>
              </View>
            )}
            onPress={() =>  {
                    onLogout(props)
                }
            }
          />
          </View>
      )}

      {!currentUser && (
                <DrawerItem
                  key={`login`}
                  label={() => (
                    <View style={styles.menuLabelFlex}>
                        <Icon
                          name="login"
                          style={{
                            fontSize: 20,
                            color: colors.primaryIcon
                          }}
                        />
                      <Text style={styles.menuTitle}>{ translate('loginRegister') || 'Login / Register' }</Text>
                    </View>
                  )}
                  onPress={() => props.navigation.navigate('Auth')}
                />
            )}

    <DrawerItem
          key={`contact`}
          label={() => (
            <View
              style={styles.menuLabelFlex}>
                <Icon
                          name="email"
                          style={{
                            fontSize: 20,
                            color: colors.primaryIcon
                          }}
                        />
              <Text style={styles.menuTitle}>{ translate('contact') || 'Contact'}</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate('Contact')}
        />

    </DrawerContentScrollView>
  );
}

export default function App(props) {
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: colors.drawer,
      }}
      drawerPosition={ 'right' }
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Homes" component={NavigatorView} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  menuTitle: {
    marginLeft: 10,
    color: colors.primaryText
  },
  menuLabelFlex: {
    display: 'flex',
    flexDirection: 'row'
  },
  userName: {
    color: '#fff',
    fontSize: 18,
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
