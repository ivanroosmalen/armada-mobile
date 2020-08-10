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
    dialogVisible: false
  }

  async componentDidMount() {
    await Promise.all([
        this.props.getAcademy(this.props.route.params.academyId),
        this.props.getClass(this.props.route.params.id)
    ])
  }

  onEditPressed() {
    if(this.props.class.recurring) {
        this.setState({ dialogVisible: true });
    } else {
        this.props.navigation.navigate('ClassEdit', { id: this.props.class._id, academyId: this.props.academy._id })
    }
  }

  onDetailedEditPressed(singleItem) {
        this.setState({ dialogVisible: false });
        this.props.navigation.navigate('ClassEdit', { id: this.props.class._id, academyId: this.props.academy._id, singleItem })
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
      let classObj = this.props.class || {};
      let startDate = this.props.route.params.startDate;
      let endDate = this.props.route.params.endDate;

      let userIsOwner = !!(this.props.academy && this.props.academy.owners && this.props.academy.owners.find(owner => owner._id === this.props.loggedInUser._id));
      let userIsStudent = !!(this.props.academy && this.props.academy.students && this.props.academy.students.find(student => student._id === this.props.loggedInUser._id));
      let userIsAttending = !!(classObj.attendees && classObj.attendees.find(attendee => attendee._id === this.props.loggedInUser._id));

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
                    <Text style={styles.itemLabel}>Attending ({classObj && classObj.attendees && classObj.attendees.length})</Text>

                    <FlatList
                          horizontal
                          keyExtractor={item => item._id }
                          style={ styles.imageContainer }
                          data={classObj && classObj.attendees}
                          renderItem={this._getRenderItemFunction}
                      />
              </View>

            </ScrollView>
          </View>
                <View>
                {userIsOwner && (
                      <Button
                        secondary
                        rounded
                        small
                        style={ styles.editButton }
                        caption="Edit"
                        onPress={ () => (this.onEditPressed()) }
                      />
                )}
                {!userIsAttending && userIsStudent && (
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

                        <Modal isVisible={this.state.dialogVisible} onBackdropPress={() => (this.setState({ dialogVisible: false }))}>
                            <View>
                              <Button
                                secondary
                                rounded
                                small
                                style={ styles.editDetailsButton }
                                caption="Update all future events"
                                onPress={() => this.onDetailedEditPressed(false)}
                              />

                              <Button
                                secondary
                                rounded
                                small
                                style={ styles.editDetailsButton }
                                caption="Update this event"
                                onPress={() => this.onDetailedEditPressed(false)}
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
  editButton: {
    width: 150,
    position: 'absolute',
    bottom: 20,
    right: 20
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
  }
});

