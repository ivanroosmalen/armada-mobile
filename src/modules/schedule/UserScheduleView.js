import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { Button } from '../../components';
import { colors, fonts } from '../../styles';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import ScheduleElement from './ScheduleElement';

class UserScheduleScreen extends React.Component {

  state = {
    anim: new Animated.Value(0),
    refreshing: false,
    academyDialogVisible: false,
    academyIds: [],
    startDate: ''

  }

  addClass(ownerAcademies) {
     if(ownerAcademies.length === 1) {
        this.editClass(ownerAcademies[0]._id);
     } else if(ownerAcademies.length > 1) {
        this.setState({ academyDialogVisible: true });
     }
  }

  editClass(academyId) {
    this.props.navigation.navigate('ClassEdit', { academyId: academyId })
    this.setState({ academyDialogVisible: false });
  }

    async onRefresh() {
      this.setState({ refreshing: true });
      await this.getData(false);
      this.setState({ refreshing: false });
    }

    async getData(fromCache = true) {
        this.props.loggedInUser && await this.props.getUserAcademies(this.props.loggedInUser._id, fromCache);
        let academies = this.props.userAcademies && this.props.userAcademies[this.props.loggedInUser._id] || {};
        let academyIds = [];
        academies.owner && academies.owner.forEach(academy => {
            academyIds.push(academy._id)
        });

        academies.instructor && academies.instructor.forEach(academy => {
            academyIds.push(academy._id)
        });

        academies.student && academies.student.forEach(academy => {
            academyIds.push(academy._id)
        });

        if(this.props.loggedInUser) {
            let data = {
                academyId: academyIds.join(','),
                startDate: moment().toISOString(),
                endDate: moment().add(31, 'days').toISOString(),
            }

            await this.props.list(this.props.loggedInUser._id, data, {}, fromCache);
        }

        this.setState({ academyIds });
    }

    async onDayPress(day) {
        if(this.props.loggedInUser) {
            this.setState({ refreshing: true });
            let data = {};
            if(this.state.startDate === day.dateString) {
                data = {
                    academyId: this.state.academyIds.join(','),
                    startDate: moment().toISOString(),
                    endDate: moment().add(31, 'days').toISOString(),
                }
            } else {
                data = {
                    academyId: this.state.academyIds.join(','),
                    startDate: moment(day.dateString).startOf('day').format(),
                    endDate: moment(day.dateString).endOf('day').format(),
                }
            }

            await this.props.list(this.props.loggedInUser._id, data, {}, false);
            this.setState({ startDate: day.dateString, refreshing: false })
        }
    }

  async componentDidMount() {
    await this.getData();

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    async componentDidUpdate(prevProps, prevState) {
      if (prevProps.classListUpdate !== this.props.classListUpdate ||
            (prevProps.loggedInUser !== this.props.loggedInUser && this.props.loggedInUser)) {
        this.getData(false);
      }
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

  render() {
    let isLoggedIn = this.props.loggedInUser;
    let ownerAcademies = this.props.loggedInUser && this.props.userAcademies && this.props.userAcademies[this.props.loggedInUser._id] ? this.props.userAcademies[this.props.loggedInUser._id].owner : [];
    let classes = this.props.classes && this.props.loggedInUser && this.props.classes[this.props.loggedInUser._id];

    return (
      <Animated.View style={[styles.container, this.fadeIn(0, -20)]}>
        <ScheduleElement
            classes={classes}
            loggedInUser={this.props.loggedInUser}
            attend={this.props.attend}
            unattend={this.props.unattend}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.refreshing}
            navigation={this.props.navigation}
            onDayPress={(day) => this.onDayPress(day)}
            />

        {!!ownerAcademies.length && (
            <TouchableOpacity
                onPress={() => this.addClass(ownerAcademies)}
                style={ styles.addButton } >
              <Icon
                  name="plus-circle"
                  style={styles.addIcon}
                />
            </TouchableOpacity>
        )}

                        <Modal isVisible={this.state.academyDialogVisible} onBackdropPress={() => this.setState({ academyDialogVisible: false })}>
                            <View>
                        {!!ownerAcademies.length && ownerAcademies.map(oa =>
                                  <Button
                                    secondary
                                    rounded
                                    small
                                    bgColor={ colors.primaryBackground }
                                    textColor={ colors.primaryText }
                                    style={ styles.editDetailsButton }
                                    caption={ oa.name }
                                    onPress={() => this.editClass(oa._id)}
                                  />
                        )}

                          </View>
                        </Modal>
      </Animated.View>
    );
  }
}


export default UserScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  editDetailsButton: {
      width: 300,
      alignSelf: 'center',
      marginTop: 20
    },
  addIcon: {
        fontSize: 35,
        backgroundColor: colors.iconBackground,
        color: colors.secondaryIcon,
        borderRadius: 20
      },
  addButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        borderRadius: 20,
        overflow: 'hidden'
  }
});