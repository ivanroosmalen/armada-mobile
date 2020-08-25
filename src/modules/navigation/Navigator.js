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
import { translate } from '../../translations/index.js';
import { updateThumbnailImage } from '../../redux/users/actions';
import S3Service from '../../http/s3-service.js';
const s3Service = new S3Service();

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();

async function selectImage() {
        const options = {
          noData: false,
          mediaType: 'photo'
        }
        ImagePicker.showImagePicker(options, async file => {
          if (file.uri) {
            let response = await store.dispatch(updateThumbnailImage(loggedInUser._id, { contentType: file.type }))
            let uploadUrl = response.data.entity;

            if(uploadUrl) {
                await s3Service.uploadImage(file, uploadUrl);

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

  let userAcademies = state.academies.userAcademies;
  let isAcademyOwner = !!(userAcademies && userAcademies.owner && userAcademies.owner.length)
  let academyRequests = state.academyRequests.academyRequests;
  let hasAcademyRequests = !!(academyRequests && academyRequests.length)

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
                <TouchableOpacity onPress={() => props.navigation.navigate('Profile', { id: state.users.loggedInUser._id })}>
                    <View style={{ paddingLeft: 15, alignSelf: 'stretch' }}>
                      <Text style={styles.userName}>{currentUser.alias || 'Edit profile'}</Text>
                    </View>
                </TouchableOpacity>
              </View>
          </View>)}
          onPress={() => props.navigation.navigate('Profile', { id: state.users.loggedInUser._id })}
          />

          <View style={styles.divider} />
          </View>
      )}

        <DrawerItem
          key={`account`}
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
              key={`account`}
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
              key={`account`}
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

            { isAcademyOwner && (
            <DrawerItem
              key={`account`}
              label={() => (
                <View
                  style={styles.menuLabelFlex}>
                    <Icon
                              name="account-alert-outline"
                              style={{
                                fontSize: 20,
                                color: hasAcademyRequests ? 'red': colors.primaryIcon
                              }}
                            />
                  <Text style={{  marginLeft: 10, color: hasAcademyRequests ? 'red': 'white' }}>{ translate('membershipRequests')  || 'Membership Requests' }</Text>
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
                    props.navigation.navigate('Auth')
                }
            }
          />
          </View>
      )}

      {!currentUser && (
                <DrawerItem
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
