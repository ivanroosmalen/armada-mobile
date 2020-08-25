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
  ImageBackground
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

export default class AcademyScreen extends React.Component {

  state = {
      placeholderImage: 'https://armada-user-images.s3.amazonaws.com/default/profile.jpg',
      cancelMembershipDialog: false,
      menuEntities:[]
  }

  async selectImage() {
        const options = {
          noData: false,
          mediaType: 'photo'
        }
        ImagePicker.showImagePicker(options, async file => {
          if (file.uri) {
            let response = await this.props.updateProfileImage(this.props.academy._id, { contentType: file.type });
            let uploadUrl = response.data.entity;

            if(uploadUrl) {
                await s3Service.uploadImage(file, uploadUrl);
            }

            await this.props.getAcademy(this.props.route.params.id);
          }
        })
  }

  menuOptionSelected(menuEntity) {
        switch(menuEntity) {
            case 'edit':
                this.props.navigation.navigate('AcademyEdit', { id: this.props.academy._id });
            break;
            case 'updateImage':
                this.selectImage();
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
    this.props.createAcademyRequest({ academy: { _id: this.props.academy._id, name: this.props.academy.name } });
  }

  async removeAcademyRequest() {
    this.props.removeAcademyRequest(this.props.academyRequest._id);
  }

  async cancelMembership() {
    this.props.cancelMembership(this.props.academy._id);
    this.setState({ cancelMembershipDialog: false })
  }

  async componentDidMount() {
    await Promise.all([
        this.props.getAcademy(this.props.route.params.id),
        this.props.list({
            academyId: this.props.route.params.id,
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().add(31, 'days').format('YYYY-MM-DD')
        }),
        this.props.getByAcademyId(this.props.route.params.id, { complete: false, approved: false })
    ])
  }

  _getRenderItemFunction = ({ item }) => {

    return (
       <UserElement
            user={item}
       />

    );
  };
  render() {
      let academy = this.props.academy;
      let classes = this.props.classes;
      if(classes) {
          classes.sort((a, b) => {
            if(!a.schedule) return -1;
            if(!b.schedule) return 1;

           return moment(a.schedule.startDate) > moment(b.schedule.startDate) ? 1 : -1
          })
      }

      let academyRequest = this.props.academyRequest;

      let isLoggedIn = this.props.loggedInUser;
      let isStudent = this.props.loggedInUser && academy.students && !!academy.students.find(student => (student._id === this.props.loggedInUser._id));
      let userIsOwner = !!(academy && academy.owners && academy.owners.find(owner => owner._id === this.props.loggedInUser._id))

      menuOptions = [];
      menuEntities = [];

      if(userIsOwner) {
        menuOptions.push(translate('edit'));
        menuEntities.push('edit');

        menuOptions.push(translate('updateAcademyImage'));
        menuEntities.push('updateImage');
      }

      if(!userIsOwner && !isStudent && !academyRequest) {
        menuOptions.push(translate('join'));
        menuEntities.push('join');
      }

      if(!userIsOwner && academyRequest) {
        menuOptions.push(translate('cancelRequest'));
        menuEntities.push('cancelRequest');
      }

      if(!userIsOwner && isStudent) {
        menuOptions.push(translate('cancelMembership'));
        menuEntities.push('cancelMembership');
      }

      return (
        <View style={styles.container}>
          <ImageBackground
            resizeMode="cover"
            source={{uri: (academy && academy.profileImg) ? academy.profileImg : this.state.placeholderImage} }
            style={[styles.section, styles.header]}
          >

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
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
                            <View style={{ paddingHorizontal: 20, paddingVertical: 10, color: colors.terciaryText }}>
                              <Text>{text}</Text>
                            </View>
                          )}
                          dropdownStyle={{ height: menuEntities.length * 40 }}
                          onSelect={(index) => this.menuOptionSelected(menuEntities[index])}
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
            <ScrollView>
              <View style={styles.expandingRow}>
                    <Text style={styles.itemLabel}>{ translate('styles') }</Text>
                    <View style={styles.multilineText}>
                        {academy && academy.martialArts && academy.martialArts.map(ma =>
                        <Text style={styles.textContent}>
                             {ma.name}
                        </Text>
                        )}
                    </View>
              </View>

              <View style={styles.hr} />

              <View style={styles.expandingRow}>
                    <Text style={styles.itemLabel}>{ translate('nextClass') }</Text>
                    <View>
                        {!!classes && !!classes.length && (
                            <View style={styles.scheduleContent}>
                                <Text style={styles.textContent}>
                                    {moment(classes[0].schedule.startDate).format('dddd DD MMM') }
                                </Text>

                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Schedule', { id: this.props.academy._id })}
                                >
                                  <Icon
                                    name="calendar"
                                    size={30}
                                    color={colors.secondaryIcon}
                                  />
                                </TouchableOpacity>

                            </View>
                        )}

                        {!classes || !classes.length && (
                            <View style={styles.scheduleContent}>
                                <Text style={styles.textContent}>
                                    { translate('noSchedule') }
                                </Text>

                                {!!userIsOwner && (
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Schedule', { id: this.props.academy._id })}
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
                        <Text style={styles.textContent}>
                            {location.address}
                        </Text>
                    ))}
                    </View>
              </View>

              <View style={styles.hr} />

              <View style={styles.userRow}>
                    <Text style={styles.itemLabel}>{ translate('instructors') } ({academy && academy.instructors && academy.instructors.length})</Text>

                    <FlatList
                          horizontal
                          keyExtractor={item => item._id }
                          style={ styles.imageContainer }
                          data={academy && academy.instructors}
                          renderItem={this._getRenderItemFunction}
                      />
              </View>
              <View style={styles.hr} />

              <View style={styles.userRow}>
                    <Text style={styles.itemLabel}>{ translate('members') } ({academy && academy.students && academy.students.length})</Text>

                    <FlatList
                          horizontal
                          keyExtractor={item => item._id }
                          style={ styles.imageContainer }
                          data={academy && academy.students}
                          renderItem={this._getRenderItemFunction}
                      />
              </View>

            </ScrollView>
          </View>

                        <Modal isVisible={this.state.cancelMembershipDialog} onBackdropPress={() => (this.setState({ cancelMembershipDialog: false }))}>
                            <View>
                              <Button
                                secondary
                                rounded
                                small
                                style={ styles.cancelMembershipButton }
                                caption={ translate('confirm') }
                                onPress={() => this.cancelMembership()}
                              />

                              <Button
                                secondary
                                rounded
                                small
                                style={ styles.cancelMembershipButton }
                                caption={ translate('cancel') }
                                onPress={() => this.setState({ cancelMembershipDialog: false })}
                              />
                          </View>
                        </Modal>

        </View>
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 2,
    padding: 20,
  },
  section: {
    flex: 4,
    position: 'relative',
    backgroundColor: colors.secondaryBackground
  },

  itemLabel: {
    width: 200,
    fontWeight: 'bold',
    position: 'absolute',
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
    borderColor: 'rgb(65, 131, 215)',
    paddingLeft: 10,
    paddingRight: 10,
    height: 40
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
      alignItems: 'center',
      paddingHorizontal: 20,
      flexDirection: 'row',
      height: 145
    },
  hr: {
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    marginLeft: 20,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250
  },
  position: {
    color: colors.white,
    fontFamily: fonts.primaryLight,
    fontSize: 16,
    marginBottom: 3,
  },
  imageContainer: {
    backgroundColor: colors.white,
    marginTop: 15
  },
  cancelMembershipButton: {
    width: 300,
    marginTop: 30,
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
    width: 28,
    height: 28,
    textAlign: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});

