import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Dimensions,
  ImageBackground,
  Animated,
  RefreshControl,
  Linking
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../styles';
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import S3Service from '../../http/s3-service.js';
const s3Service = new S3Service();
import { RadioGroup, GridRow, Button } from '../../components';
import ModalDropdown from 'react-native-modal-dropdown';
import UserElement from '../profile/UserElement';
import moment from 'moment';
import Modal from 'react-native-modal';
import { translate } from '../../translations/index.js';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import openMap from 'react-native-open-maps';

export default class AcademyScreen extends React.Component {

  state = {
      placeholderImage: 'https://armada-user-images.s3.amazonaws.com/default/profile.jpg',
      cancelMembershipDialog: false,
      menuEntities:[],
      spinner: false,
      anim: new Animated.Value(0),
      refreshing: false
  }

    async onRefresh() {
      this.setState({ refreshing: true })
      await this.getData(false);
      this.setState({ refreshing: false })
    }

  async selectImage() {
        const options = {
          noData: false,
          mediaType: 'photo'
        }
        ImagePicker.showImagePicker(options, async file => {
          if (file.uri) {
            this.setState({ spinner: true })
            let response = await this.props.updateProfileImage(this.props.route.params.id, { contentType: file.type });
            let uploadUrl = response.data.entity;

            if(uploadUrl) {
                await s3Service.uploadImage(file, uploadUrl);
            }

            this.setState({ spinner: false })
          }
        })
  }

  locationSelected(location) {
    openMap({ query: location.address } )
  }

  async onSitePressed(website) {
    if(!website) {
        return;
    }

    const supported = await Linking.canOpenURL(website);

    if (supported) {
      await Linking.openURL(website);
    }
  }

  menuOptionSelected(menuEntity) {
        switch(menuEntity) {
            case 'edit':
                this.props.navigation.navigate('AcademyEdit', { id: this.props.route.params.id });
            break;
            case 'updateImage':
                setTimeout(() => {
                    this.selectImage();
                }, 500)
            break;
            case 'manageMembers':
                this.props.navigation.navigate('AcademyUsers', { id: this.props.academy[this.props.route.params.id]._id })
            break;
            case 'join':
                this.createAcademyRequest()
            break;
            case 'cancelRequest':
                this.removeAcademyRequest()
            break;
            case 'cancelMembership':
                this.setState({ cancelMembershipDialog: true })
            break;
        }
  }

  async createAcademyRequest() {
    this.setState({ spinner: true });
    await this.props.createAcademyRequest({ academy: { _id: this.props.route.params.id, name: this.props.academy[this.props.route.params.id].name } });
    this.setState({ spinner: false });
  }

  async removeAcademyRequest() {
    this.setState({ spinner: true });
    await this.props.removeAcademyRequest(this.props.academyRequest._id);
    this.setState({ spinner: false });
  }

  async cancelMembership() {
    this.setState({ spinner: true });
    let academyMembers = this.props.academyMembers && this.props.academyMembers[this.props.route.params.id] || [];
    let currentMember = this.props.loggedInUser && academyMembers.find(member => member.member._id === this.props.loggedInUser._id);
    if(currentMember) {
        await this.props.removeAcademyMember(currentMember._id);
    }
    this.setState({ cancelMembershipDialog: false, spinner: false })
  }

  async getData(fromCache = true) {
    await Promise.all([
            this.props.getAcademy(this.props.route.params.id, {}, fromCache),
            this.props.getAcademyMembers(this.props.route.params.id, { academyId: this.props.route.params.id }, {}, fromCache),
            this.props.list(`academy-${this.props.route.params.id}`, {
                academyId: this.props.route.params.id,
                startDate: moment().format('YYYY-MM-DD'),
                endDate: moment().add(31, 'days').format('YYYY-MM-DD')
            }),
            this.props.getByAcademyId(this.props.route.params.id, { complete: false, approved: false })
        ])
  }

  async componentDidMount() {
    await this.getData();

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    fadeIn(delay, from = 0) {
        const { anim } = this.state;
        return {
          opacity: anim.interpolate({
            inputRange: [delay, Math.min(delay + 500, 1000)],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [delay, Math.min(delay + 500, 1000)],
                outputRange: [from, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        };
      }

  _getRenderItemFunction = ({ item }) => {

    return (
       <UserElement
            user={item}
       />

    );
  };

  render() {
      let academy = this.props.academy ? this.props.academy[this.props.route.params.id] : {};
      let classes = this.props.classes && this.props.classes[`academy-${this.props.route.params.id}`];
      let academyMembers = this.props.academyMembers && this.props.academyMembers[this.props.route.params.id];
      let nextClass = { schedule: {} };
      if(classes) {
          classes.sort((a, b) => {
            if(!a.schedule) return -1;
            if(!b.schedule) return 1;

           return moment(a.schedule.startDate) > moment(b.schedule.startDate) ? 1 : -1
          })

          nextClass = classes.find(classObj => {
            return moment() < moment(classObj.schedule.startDate)
          }) || { schedule: {} }
      }

      let academyRequest = this.props.academyRequest;

      let isLoggedIn = this.props.loggedInUser;
      let currentUser = isLoggedIn && academyMembers && academyMembers.find(member => (member.member._id === this.props.loggedInUser._id));
      let isStudent = !!currentUser;
      let userIsOwner = currentUser && currentUser.isOwner;

      let instructors = academyMembers && academyMembers.filter(member => member.isInstructor) || [];

      let menuOptions = [];
      let menuEntities = [];

      if(userIsOwner) {
        menuOptions.push(translate('edit'));
        menuEntities.push('edit');

        menuOptions.push(translate('updateAcademyImage'));
        menuEntities.push('updateImage');
        menuOptions.push(translate('manageMembers'));
        menuEntities.push('manageMembers');
      }

      if(!userIsOwner && !isStudent && !academyRequest) {
        menuOptions.push(translate('join'));
        menuEntities.push('join');
      }

      if(!userIsOwner && academyRequest && !isStudent) {
        menuOptions.push(translate('cancelRequest'));
        menuEntities.push('cancelRequest');
      }

      if(!userIsOwner && isStudent) {
        menuOptions.push(translate('cancelMembership'));
        menuEntities.push('cancelMembership');
      }

      return (
        <Animated.ScrollView
                style={[this.fadeIn(0, 0)]}
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
                >
            <Spinner
              visible={this.state.spinner}
              textContent={translate('loading')}
              textStyle={{color: colors.quaternaryText}}
            />

          <ImageBackground
            resizeMode="cover"
            source={{uri: (academy && academy.profileImg) ? academy.profileImg : this.state.placeholderImage} }
            style={styles.backgroundImage}
          >

            <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 20, paddingLeft: 20 }}>
              <Text style={styles.title}>{academy && academy.name}</Text>
            </View>

          {isLoggedIn && (
              <View style={ styles.optionsMenu }>
                  <TouchableOpacity onPress={() => this.optionsMenu.show()}>
                      <Icon
                        name="dots-horizontal"
                        size={25}
                        color={colors.secondaryIcon}
                      />
                  </TouchableOpacity>

                  <ModalDropdown ref={(el) => {this.optionsMenu = el}}
                          options={ menuOptions }
                          renderRow={text => (
                            <View style={{ paddingHorizontal: 20, paddingVertical: 10, color: colors.terciaryText, backgroundColor: colors.primaryBackground }}>
                              <Text style={{color: colors.primaryText}}>{text}</Text>
                            </View>
                          )}
                          dropdownStyle={{ height: menuEntities.length * 40 }}
                          onSelect={(index) => this.menuOptionSelected(menuEntities[index])}
                          renderSeparator={() => (<View></View>)}
                        >
                                <View>
                                <Text>
                                </Text>
                                </View>
                   </ModalDropdown>

              </View>
          )}
          </ImageBackground>

          <View style={styles.section}>
            <View>
                        {isLoggedIn && !userIsOwner && !isStudent && !academyRequest && (
                            <Button
                                bgColor={colors.primaryBackground}
                                textColor={colors.primaryText}
                                secondary
                                rounded
                                small
                                style={ styles.joinButton }
                                caption={ translate('join') }
                                onPress={() => this.menuOptionSelected('join')}
                              />
                        )}
                        {isLoggedIn && !userIsOwner && academyRequest && !isStudent && (
                            <Button
                                bgColor={colors.primaryBackground}
                                textColor={colors.primaryText}
                                secondary
                                rounded
                                small
                                style={ styles.joinButton }
                                caption={ translate('cancelRequest') }
                                onPress={() => this.menuOptionSelected('cancelRequest')}
                              />
                        )}

              <View style={styles.hr} />

              <View style={styles.expandingRow}>
                    <Text style={styles.itemLabel}>{ translate('styles') }</Text>
                    <View style={styles.multilineText}>
                        {academy && academy.martialArts && academy.martialArts.map(ma =>
                        <Text style={styles.textContent} key={ma.name}>
                             {ma.name}
                        </Text>
                        )}
                    </View>
              </View>

              <View style={styles.hr} />

              <View style={styles.expandingRow}>
                    <Text style={styles.itemLabel}>{ translate('website') }</Text>
                    <TouchableOpacity style={styles.multilineText}
                        onPress={() => this.onSitePressed(academy && academy.website)}>
                        <Text style={styles.textContent}>
                             {academy && academy.website}
                        </Text>
                    </TouchableOpacity>
              </View>

              <View style={styles.hr} />

              <View style={styles.expandingRow}>
                    <Text style={styles.itemLabel}>{ translate('nextClass') }</Text>
                    <View>
                        {!!(classes && classes.length) && (
                            <View style={styles.scheduleContent}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Class', { id: nextClass._id, academyId: this.props.route.params.id, startDate: nextClass.schedule.startDate, endDate: nextClass.schedule.endDate })}>
                                <Text style={styles.textContent}>
                                    {moment(nextClass.schedule.startDate).format('dddd DD MMM') }
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Schedule', { id: this.props.route.params.id })}
                                >
                                  <Icon
                                    name="calendar"
                                    size={30}
                                    color={colors.secondaryIcon}
                                  />
                            </TouchableOpacity>
                            </View>
                        )}

                        {!(classes && classes.length) && (
                            <View style={styles.scheduleContent}>
                                <Text style={styles.textContent}>
                                    { translate('noSchedule') }
                                </Text>

                                {!!userIsOwner && (
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Schedule', { id: this.props.route.params.id })}
                                >
                                  <Icon
                                    name="calendar"
                                    size={30}
                                    color={colors.secondaryIcon}
                                  />
                                </TouchableOpacity>
                                )}

                            </View>
                        )}

                    </View>
              </View>

              <View style={styles.hr} />

              <View style={styles.expandingRow}>
                    <Text style={styles.itemLabel}>{ translate('locations') }</Text>
                    <View style={styles.multilineText}>
                    {academy && academy.locations && academy.locations.map(location => (
                        <TouchableOpacity
                            onPress={() => this.locationSelected(location)}
                            style={styles.textContent}
                        >
                            <Text>
                                {location.address}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    </View>
              </View>

              <View style={styles.hr} />

              <View style={styles.userRow}>

                        {academy && userIsOwner && (
                            <TouchableOpacity style={styles.headerContainer}
                                onPress={() => {this.props.navigation.navigate('AcademyUsers', { id: academy._id })}}>
                             <Text style={styles.itemLabel}>{ translate('instructors') } ({instructors && instructors.length})</Text>
                              <Icon
                                name="menu-right"
                                size={25}
                                color={colors.secondaryIcon}
                              />
                             </TouchableOpacity>
                         )}

                        {academy && !userIsOwner && (
                            <Text style={styles.itemLabel}>{ translate('instructors') } ({instructors && instructors.length})</Text>
                         )}

                    <View style={ styles.imageContainer }>
                      <FlatList
                          horizontal
                          keyExtractor={item => item._id }
                          data={instructors}
                          renderItem={this._getRenderItemFunction}
                      />
                    </View>
              </View>
              <View style={styles.hr} />

                  <View style={styles.userRow}>

                        {academy && userIsOwner && (
                            <TouchableOpacity style={styles.headerContainer}
                                onPress={() => {this.props.navigation.navigate('AcademyUsers', { id: academy._id })}}>
                             <Text style={styles.itemLabel}>{ translate('members') } ({academy.memberCount || 0})</Text>
                              <Icon
                                name="menu-right"
                                size={25}
                                color={colors.secondaryIcon}
                              />
                             </TouchableOpacity>
                         )}

                        {academy && !userIsOwner && (
                            <Text style={styles.itemLabel}>{ translate('members') } ({academyMembers && academyMembers.length})</Text>
                         )}

                        {isStudent && (
                        <View style={ styles.imageContainer }>
                        <FlatList
                              horizontal
                              keyExtractor={item => item._id }
                              data={academyMembers}
                              renderItem={this._getRenderItemFunction}
                          />
                          </View>
                        )}
                  </View>

            </View>
          </View>

                        <Modal isVisible={this.state.cancelMembershipDialog} onBackdropPress={() => (this.setState({ cancelMembershipDialog: false }))}>
                            <View>
                              <Button
                                bgColor={colors.primaryBackground}
                                textColor={colors.primaryText}
                                secondary
                                rounded
                                small
                                style={ styles.cancelMembershipButton }
                                caption={ translate('confirm') }
                                onPress={() => this.cancelMembership()}
                              />

                              <Button
                                bgColor={colors.primaryBackground}
                                textColor={colors.primaryText}
                                secondary
                                rounded
                                small
                                style={ styles.cancelMembershipButton }
                                caption={ translate('cancel') }
                                onPress={() => this.setState({ cancelMembershipDialog: false })}
                              />
                          </View>
                        </Modal>

        </Animated.ScrollView>
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  section: {
    position: 'relative',
    backgroundColor: colors.secondaryBackground
  },
  backgroundImage: {
    height: Dimensions.get('window').width / 1.5
  },
  itemLabel: {
    width: 200,
    fontWeight: 'bold',
    top: 10,
    paddingHorizontal: 20,
    color: colors.terciaryText
  },
  title: {
    color: colors.primaryText,
    fontFamily: fonts.primaryBold,
    fontSize: 25,
    letterSpacing: 0.04,
    backgroundColor: colors.primaryBackgroundTransparent,
    alignSelf: 'flex-start',
    borderRadius: 15,
    overflow: 'hidden',
    borderColor: 'rgb(65, 131, 215)',
    paddingLeft: 10,
    paddingRight: 10,
    height: 35
  },
  infoRow: {
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    height: 100
  },
  expandingRow: {
    minHeight: 50,
    paddingBottom: 10
  },
  multilineText: {
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  scheduleContent: {
        paddingTop: 25,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
  },
  textContent: {
    paddingTop: 10,
    color: colors.black
  },
  userRow: {
      flexDirection: 'column',
      minHeight: 100
    },
  hr: {
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    marginLeft: 20,
  },
  position: {
    color: colors.white,
    fontFamily: fonts.primaryLight,
    fontSize: 16,
    marginBottom: 3,
  },
  imageContainer: {
    backgroundColor: colors.white,
    marginTop: 20,
    paddingLeft: 20
  },
  cancelMembershipButton: {
    width: 300,
    marginTop: 30,
    alignSelf: 'center'
  },
  joinButton: {
    width: 150,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center'
  },
  optionsMenu: {
    opacity: 1,
    position: 'absolute',
    bottom: 20,
    right: 20,
    color: colors.secondaryIcon,
    backgroundColor: colors.iconBackground,
    borderRadius: 30,
    borderColor: colors.secondaryIcon,
    borderWidth: 1,
    width: 28,
    height: 28,
    textAlign: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10
  }
});

