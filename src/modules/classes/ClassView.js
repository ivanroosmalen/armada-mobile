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

import UserElement from '../profile/UserElement';

export default class ClassScreen extends React.Component {

  state = {
    editDialogVisible: false,
    deleteDialogVisible: false,
    deleteConfirmationDialogVisible: false,
    deleteSingleItem: true
  }

  async componentDidMount() {
    await Promise.all([
        this.props.getAcademy(this.props.route.params.academyId),
        this.props.getClass(this.props.route.params.id)
    ])
  }

  onEditPressed() {
    if(this.props.class.schedule.recurring) {
        this.setState({ editDialogVisible: true });
    } else {
        this.props.navigation.navigate('ClassEdit', { id: this.props.class._id, academyId: this.props.academy._id })
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

  onDeletePressed() {
    if(this.props.class.schedule.recurring) {
        this.setState({ deleteDialogVisible: true });
    } else {
        this.setState({ deleteConfirmationDialogVisible: true });
    }
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
                    <Text style={styles.itemLabel}>Instructor</Text>

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
                    <Text style={styles.itemLabel}>Attending ({classObj && classObj.attendees && classObj.attendees.length}{classIsFull && ' - full'})</Text>

                    <FlatList
                          horizontal
                          keyExtractor={item => item._id }
                          style={ styles.imageContainer }
                          data={classObj && classObj.attendees}
                          renderItem={this._getRenderItemFunction}
                      />
              </View>
              <View style={styles.attendContainer}>
                {!userIsAttending && userIsStudent && !classIsFull && (
                      <Button
                        secondary
                        rounded
                        small
                        style={ styles.attendButton }
                        caption="Attend"
                        onPress={ () => (this.onAttendPressed()) }
                      />
                )}

                {userIsAttending && userIsStudent && (
                      <Button
                        secondary
                        rounded
                        small
                        style={ styles.attendButton }
                        caption="Unattend"
                        onPress={ () => (this.onUnattendPressed()) }
                      />
                )}
              </View>
            </ScrollView>

          </View>
                <View style={ styles.buttonContainer }>
                    {userIsOwner && (
                          <Button
                            secondary
                            rounded
                            small
                            style={ styles.actionButton }
                            caption="Edit"
                            onPress={ () => (this.onEditPressed()) }
                          />
                    )}

                    {userIsOwner && (
                          <Button
                            secondary
                            rounded
                            small
                            style={ styles.actionButton }
                            caption="Delete"
                            onPress={ () => (this.onDeletePressed()) }
                          />
                    )}

          </View>
                        <Modal isVisible={this.state.editDialogVisible} onBackdropPress={() => (this.setState({ editDialogVisible: false }))}>
                            <View>
                              <Button
                                secondary
                                rounded
                                small
                                style={ styles.editDetailsButton }
                                caption="Update entire series"
                                onPress={() => this.onDetailedEditPressed(false)}
                              />

                              <Button
                                secondary
                                rounded
                                small
                                style={ styles.editDetailsButton }
                                caption="Update this event"
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
                                style={ styles.editDetailsButton }
                                caption="Remove entire series"
                                onPress={() => this.onDetailedRemovePressed(false)}
                              />

                              <Button
                                secondary
                                rounded
                                small
                                style={ styles.editDetailsButton }
                                caption="Remove this event"
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
                                style={ styles.editDetailsButton }
                                caption="Confirm delete"
                                onPress={() => this.onDeleteConfirmationPressed(true)}
                              />

                              <Button
                                secondary
                                rounded
                                small
                                style={ styles.editDetailsButton }
                                caption="Cancel"
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
    backgroundColor: 'white',
  },
  header: {
    flex: 2,
    padding: 20,
  },
  section: {
    flex: 4,
    position: 'relative',
  },
  dates: {
        fontSize: 15,
        fontStyle: 'italic'
   },
   name: {
        fontSize: 25,
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingTop: 20
   },
   description: {
           fontSize: 20,
           paddingLeft: 20
    },
    martialArt: {
        fontSize: 15,
        fontStyle: 'italic'
   },
   location: {
      fontSize: 15,
      paddingLeft: 20,
      paddingTop: 20
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
    marginTop: 15
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
//    position: 'absolute',
//    bottom: 20,
//    right: 20
  },
  attendButton: {
    width: 150,
    position: 'absolute',
    bottom: 20,
    left: 20
  },
  editDetailsButton: {
    width: 300,
    marginTop: 30,
    alignSelf: 'center'
  },
  attendContainer: {
    marginTop: 40
  }
});

