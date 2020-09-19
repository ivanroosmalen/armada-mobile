import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  Animated,
  RefreshControl
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { colors, fonts } from '../../styles';
import moment from 'moment';
import { Button } from '../../components';
import { translate } from '../../translations/index.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalDropdown from 'react-native-modal-dropdown';
import Spinner from 'react-native-loading-spinner-overlay';
import openMap from 'react-native-open-maps';

import UserElement from '../profile/UserElement';

export default class ClassScreen extends React.Component {

  state = {
    editDialogVisible: false,
    deleteDialogVisible: false,
    deleteConfirmationDialogVisible: false,
    attendDialogVisible: false,
    deleteSingleItem: true,
    menuOptions: [translate('edit'), translate('delete')],
    menuEntities: ['edit', 'delete'],
    anim: new Animated.Value(0),
    refreshing: false,
    spinner: false
  }

    async onRefresh() {
      this.setState({ refreshing: true })
        await Promise.all([
            this.props.getAcademy(this.props.route.params.academyId),
            this.props.getClass(this.props.route.params.id)
        ]);
      this.setState({ refreshing: false })
    }

  locationSelected(location) {
    openMap({ query: location.address } )
  }

  async componentDidMount() {
    await Promise.all([
        this.props.getAcademy(this.props.route.params.academyId),
        this.props.getClass(this.props.route.params.id)
    ]);

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

  menuOptionSelected(menuEntity) {
        switch(menuEntity) {
            case 'edit':
                if(this.props.class.schedule.recurring) {
                    this.setState({ editDialogVisible: true });
                } else {
                    this.props.navigation.navigate('ClassEdit', { id: this.props.class._id, academyId: this.props.academy._id })
                }
            break;
            case 'delete':
                if(this.props.class.schedule.recurring) {
                    this.setState({ deleteDialogVisible: true });
                } else {
                    this.setState({ deleteConfirmationDialogVisible: true });
                }
            break;
        }
  }

  onDetailedEditPressed(singleItem) {
        this.setState({ editDialogVisible: false });
        this.props.navigation.navigate('ClassEdit', {
             id: this.props.class._id,
             academyId: this.props.academy._id,
             startDate: this.props.route.params.startDate,
             endDate: this.props.route.params.endDate,
             singleItem
         })
    }

    onDetailedRemovePressed(singleItem) {
        this.setState({
            deleteDialogVisible: false,
            deleteConfirmationDialogVisible: true,
            deleteSingleItem: singleItem
        });
    }

    async onDeleteConfirmationPressed(confirm) {
             let state = {
                 deleteConfirmationDialogVisible: false,
                 spinner: false
             };

             if(confirm) {
                 this.setState({ spinner: true });
                 if(!this.props.class.schedule.recurring || !this.state.deleteSingleItem) {
                     await this.props.removeClass(this.props.class._id);
                 } else {
                     let classObj = this.props.class;
                     classObj.schedule.excludes = classObj.schedule.excludes || [];
                     classObj.schedule.excludes.push(moment(this.props.route.params.startDate).toDate())

                     await this.props.updateClass(this.props.class._id, classObj);
                 }

                 this.props.navigation.pop(1);
             } else {
                 state.deleteSingleItem = false;
             }

             this.setState(state);
         }

    async attend(online = false) {
        this.setState({ spinner: true });
        let data = {
            classId: this.props.class._id,
            startDate: this.props.route.params.startDate,
            endDate: this.props.route.params.endDate,
            online
        }
        await this.props.attend(data);

        this.setState({ spinner: false, attendDialogVisible: false });
    }

  async onAttendPressed() {
    if(this.props.class.supportOnlineClasses) {
        this.setState({ attendDialogVisible: true })
    } else {
        await this.attend();
    }
  }

  async onUnattendPressed() {
      this.setState({ spinner: true });
      let data = {
          classId: this.props.class._id
      }
      await this.props.unattend(data);

      this.setState({ spinner: false });
    }

  _getRenderItemFunction = ({ item }) => {
    return (
       <UserElement
            user={item}
       />
    );
  };

  render() {
      let classObj = this.props.class || { schedule: {} };
      let startDate = this.props.route.params.startDate;
      let endDate = this.props.route.params.endDate;

      let userIsOwner = !!(this.props.loggedInUser && this.props.academy && this.props.academy.owners && this.props.academy.owners.find(owner => owner._id === this.props.loggedInUser._id));
      let userIsStudent = !!(this.props.loggedInUser && this.props.academy && this.props.academy.students && this.props.academy.students.find(student => student._id === this.props.loggedInUser._id));
      let userIsAttending = !!(this.props.loggedInUser && classObj.attendees && classObj.attendees.find(attendee => attendee._id === this.props.loggedInUser._id));

      if(moment(classObj.schedule.startDate).valueOf() !== moment(startDate).valueOf()) {
        classObj.attendees = [];
      }

      let attendees = classObj.attendees.filter(attendee => !attendee.online) || [];
      let onlineAttendees = classObj.attendees.filter(attendee => !!attendee.online) || [];

      let classIsFull = attendees && attendees.length === classObj.classSize;
      let onlineClassIsFull = onlineAttendees && onlineAttendees.length === classObj.onlineClassSize;

      return (
        <Animated.View style={[styles.container, this.fadeIn(0, -20)]}>
             <Spinner
               visible={this.state.spinner}
               textContent={translate('loading')}
               textStyle={{color: colors.quaternaryText}}
             />
          <View style={styles.section}>
            <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}>

              <View style={styles.expandingRow}>
                    <Text style={styles.name}>
                         {classObj.name}
                    </Text>
              </View>

              <View style={styles.expandingDateRow}>
                    <Text style={styles.martialArt}>
                          {classObj.martialArt}
                    </Text>
                    <Text style={styles.dates}>
                         {moment(startDate).format('DD MMM HH:mm')} - {moment(endDate).format('DD MMM HH:mm')}
                    </Text>
              </View>

              <View style={styles.expandingRow}>
                    <Text style={styles.description}>
                         {classObj.description}
                    </Text>
              </View>

              <View style={styles.expandingRow}>
                    {!!(classObj.location && classObj.location.address) && (
                    <TouchableOpacity
                        onPress={() => this.locationSelected(classObj.location)}
                    >
                        <Text style={styles.location}>
                             {classObj.location && classObj.location.address}
                        </Text>
                    </TouchableOpacity>
                    )}
              </View>

              <View style={styles.hr} />

              <View style={styles.userRow}>
                    <Text style={styles.itemLabel}>{ translate('instructor') }</Text>

                    <FlatList
                          horizontal
                          keyExtractor={item => item._id }
                          style={ styles.imageContainer }
                          data={classObj && classObj.instructors}
                          renderItem={this._getRenderItemFunction}
                      />

              </View>
              <View style={styles.hr} />

              {userIsStudent && (
                  <View style={styles.userRow}>
                        <Text style={styles.itemLabel}>{ translate('attending') } ({attendees && attendees.length}{classIsFull && ' - full'})</Text>

                        <FlatList
                              horizontal
                              keyExtractor={item => item._id }
                              style={ styles.imageContainer }
                              data={attendees}
                              renderItem={this._getRenderItemFunction}
                          />
                  </View>
              )}

              {userIsStudent && classObj.supportOnlineClasses && (
                  <View style={styles.userRow}>
                        <Text style={styles.itemLabel}>{ translate('attendingOnline') } ({onlineAttendees && onlineAttendees.length}{onlineClassIsFull && ' - full'})</Text>

                        <FlatList
                              horizontal
                              keyExtractor={item => item._id }
                              style={ styles.imageContainer }
                              data={onlineAttendees}
                              renderItem={this._getRenderItemFunction}
                          />
                  </View>
              )}
            </ScrollView>

                <View style={styles.attendContainer}>
                {!userIsAttending && userIsStudent && !(classIsFull && onlineClassIsFull) && (
                    <View>
                      <Button
                        secondary
                        rounded
                        small
                        bgColor={ colors.primaryBackground }
                        textColor={ colors.primaryText }
                        style={ styles.attendButton }
                        caption={ translate('attend') }
                        onPress={ () => (this.onAttendPressed()) }
                      />
                    </View>
                )}

                {userIsAttending && userIsStudent && (
                      <Button
                        secondary
                        rounded
                        small
                        bgColor={ colors.primaryBackground }
                        textColor={ colors.primaryText }
                        style={ styles.attendButton }
                        caption={ translate('unattend') }
                        onPress={ () => (this.onUnattendPressed()) }
                      />
                )}
              </View>

          </View>
                    {userIsOwner && (
                      <View style={ styles.optionsMenu }>
                          <TouchableOpacity onPress={() => this.optionsMenu.show()}>
                              <Icon
                                name="dots-horizontal"
                                size={25}
                                color={colors.secondaryIcon}
                              />
                          </TouchableOpacity>

                          <ModalDropdown ref={(el) => {this.optionsMenu = el}}
                                  options={ this.state.menuOptions }
                                  renderRow={text => (
                                    <View style={{ paddingHorizontal: 20, paddingVertical: 10, color: colors.terciaryText, backgroundColor: colors.primaryBackground }}>
                                      <Text style={{color: colors.primaryText}}>{text}</Text>
                                    </View>
                                  )}
                                  dropdownStyle={{ height: 80}}
                                  onSelect={(index) => this.menuOptionSelected(this.state.menuEntities[index])}
                                  renderSeparator={() => (<View></View>)}
                                >
                                <View>
                                <Text>
                                </Text>
                                </View>
                           </ModalDropdown>
                      </View>
                    )}

                        <Modal isVisible={this.state.attendDialogVisible} onBackdropPress={() => (this.setState({ attendDialogVisible: false }))}>
                            <View>
                              {!classIsFull && (
                                  <Button
                                    secondary
                                    rounded
                                    small
                                    bgColor={ colors.primaryBackground }
                                    textColor={ colors.primaryText }
                                    style={ styles.editDetailsButton }
                                    caption={ translate('online') }
                                    onPress={() => this.attend(true)}
                                  />
                              )}

                              {!onlineClassIsFull && (
                                  <Button
                                    secondary
                                    rounded
                                    small
                                    bgColor={ colors.primaryBackground }
                                    textColor={ colors.primaryText }
                                    style={ styles.editDetailsButton }
                                    caption={ translate('inPerson') }
                                    onPress={() => this.attend(false)}
                                  />
                              )}
                          </View>
                        </Modal>

                        <Modal isVisible={this.state.editDialogVisible} onBackdropPress={() => (this.setState({ editDialogVisible: false }))}>
                            <View>
                              <Button
                                secondary
                                rounded
                                small
                                bgColor={ colors.primaryBackground }
                                textColor={ colors.primaryText }
                                style={ styles.editDetailsButton }
                                caption={ translate('updateSeries') }
                                onPress={() => this.onDetailedEditPressed(false)}
                              />

                              <Button
                                secondary
                                rounded
                                small
                                bgColor={ colors.primaryBackground }
                                textColor={ colors.primaryText }
                                style={ styles.editDetailsButton }
                                caption={ translate('updateEvent') }
                                onPress={() => this.onDetailedEditPressed(true)}
                              />
                          </View>
                        </Modal>

                        <Modal isVisible={this.state.deleteDialogVisible} onBackdropPress={() => (this.setState({ deleteDialogVisible: false }))}>
                            <View>
                              <Button
                                secondary
                                rounded
                                small
                                bgColor={ colors.primaryBackground }
                                textColor={ colors.primaryText }
                                style={ styles.editDetailsButton }
                                caption={ translate('removeSeries') }
                                onPress={() => this.onDetailedRemovePressed(false)}
                              />

                              <Button
                                secondary
                                rounded
                                small
                                bgColor={ colors.primaryBackground }
                                textColor={ colors.primaryText }
                                style={ styles.editDetailsButton }
                                caption={ translate('removeEvent') }
                                onPress={() => this.onDetailedRemovePressed(true)}
                              />
                          </View>
                        </Modal>

                        <Modal isVisible={this.state.deleteConfirmationDialogVisible} onBackdropPress={() => (this.onDeleteConfirmationPressed(false))}>
                            <View>
                              <Button
                                secondary
                                rounded
                                small
                                bgColor={ colors.primaryBackground }
                                textColor={ colors.primaryText }
                                style={ styles.editDetailsButton }
                                caption={ translate('confirmDelete') }
                                onPress={() => this.onDeleteConfirmationPressed(true)}
                              />

                              <Button
                                secondary
                                rounded
                                small
                                bgColor={ colors.primaryBackground }
                                textColor={ colors.primaryText }
                                style={ styles.editDetailsButton }
                                caption={ translate('cancel') }
                                onPress={() => this.onDeleteConfirmationPressed(false)}
                              />
                          </View>
                        </Modal>
        </Animated.View>
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
    color: colors.terciaryText
  },
  header: {
    flex: 2,
    padding: 20,
  },
  section: {
    flex: 4,
    position: 'relative',
    color: colors.terciaryText
  },
  dates: {
        fontSize: 15,
        fontStyle: 'italic',
        color: colors.terciaryText
   },
   name: {
        fontSize: 25,
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingTop: 20,
        color: colors.terciaryText
   },
   description: {
           fontSize: 20,
           paddingLeft: 20,
           color: colors.terciaryText
    },
    martialArt: {
        fontSize: 15,
        fontStyle: 'italic',
        color: colors.terciaryText
   },
   location: {
      fontSize: 15,
      paddingLeft: 20,
      paddingTop: 20,
      color: colors.terciaryText
   },
  itemLabel: {
    width: 200,
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
    paddingHorizontal: 20
  },
  title: {
    color: colors.white,
    fontFamily: fonts.primaryBold,
    fontSize: 25,
    letterSpacing: 0.04,
    marginBottom: 10,
    backgroundColor: 'rgba(65, 131, 215, 0.6)',
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
  expandingDateRow: {
    minHeight: 50,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    paddingTop: 40,
    paddingLeft: 20
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
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
  },
  actionButton: {
    width: 150,
  },
  attendButton: {
    width: 180,
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100
  },
  editDetailsButton: {
    width: 300,
    marginTop: 30,
    alignSelf: 'center'
  },
  attendContainer: {
  },
  optionsMenu: {
    opacity: 1,
    position: 'absolute',
    top: 20,
    right: 20,
    color: colors.secondaryIcon,
    backgroundColor: colors.iconBackground,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.quaternaryText,
    width: 28,
    height: 28,
    textAlign: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});

