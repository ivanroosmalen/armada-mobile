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
  ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import { colors, fonts } from '../../styles';
import moment from 'moment';
import { Button } from '../../components';
import { translate } from '../../translations/index.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalDropdown from 'react-native-modal-dropdown';

import UserElement from '../profile/UserElement';

export default class ClassScreen extends React.Component {

  state = {
    editDialogVisible: false,
    deleteDialogVisible: false,
    deleteConfirmationDialogVisible: false,
    deleteSingleItem: true,
    menuOptions: [translate('edit'), translate('delete')],
    menuEntities: ['edit', 'delete']
  }

  async componentDidMount() {
    await Promise.all([
        this.props.getAcademy(this.props.route.params.academyId),
        this.props.getClass(this.props.route.params.id)
    ])
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
        };

        if(confirm) {
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

  onAttendPressed() {
    let data = {
        classId: this.props.class._id,
        startDate: this.props.route.params.startDate,
        endDate: this.props.route.params.endDate
    }
    this.props.attend(data);
  }

  onUnattendPressed() {
      let data = {
          classId: this.props.class._id
      }
      this.props.unattend(data);
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

      let userIsOwner = !!(this.props.academy && this.props.academy.owners && this.props.academy.owners.find(owner => owner._id === this.props.loggedInUser._id));
      let userIsStudent = !!(this.props.academy && this.props.academy.students && this.props.academy.students.find(student => student._id === this.props.loggedInUser._id));
      let userIsAttending = !!(classObj.attendees && classObj.attendees.find(attendee => attendee._id === this.props.loggedInUser._id));
      let classIsFull = classObj.attendees && classObj.attendees.length === classObj.classSize;

      if(moment(classObj.schedule.startDate).valueOf() !== moment(startDate).valueOf()) {
        classObj.attendees = [];
      }

      return (
        <View style={styles.container}>
          <View style={styles.section}>
            <ScrollView>

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
                    <Text style={styles.location}>
                         {classObj.location && classObj.location.address}
                    </Text>
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

              <View style={styles.userRow}>
                    <Text style={styles.itemLabel}>{ translate('attending') } ({classObj && classObj.attendees && classObj.attendees.length}{classIsFull && ' - full'})</Text>

                    <FlatList
                          horizontal
                          keyExtractor={item => item._id }
                          style={ styles.imageContainer }
                          data={classObj && classObj.attendees}
                          renderItem={this._getRenderItemFunction}
                      />
              </View>
            </ScrollView>

                <View style={styles.attendContainer}>
                {!userIsAttending && userIsStudent && !classIsFull && (
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
                                    <View style={{ paddingHorizontal: 20, paddingVertical: 10, color: colors.terciaryText }}>
                                      <Text>{text}</Text>
                                    </View>
                                  )}
                                  dropdownStyle={{ height: 80 }}
                                  onSelect={(index) => this.menuOptionSelected(this.state.menuEntities[index])}
                                >
                            <View>
                              <Text>
                              </Text>
                            </View>
                           </ModalDropdown>

                      </View>
                    )}

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
        </View>
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

