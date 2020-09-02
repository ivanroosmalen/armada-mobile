import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button, Animated } from 'react-native';

import { colors, fonts } from '../../styles';
import moment from 'moment';

import ScheduleElement from './ScheduleElement';

class UserScheduleScreen extends React.Component {

  state = {
    anim: new Animated.Value(0),
    refreshing: false
  }

    async onRefresh() {
      this.setState({ refreshing: true })
        await this.props.getUserAcademies(this.props.loggedInUser._id);
        let academies = this.props.userAcademies || {};
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

        let data = {
            academyId: academyIds.join(','),
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().add(31, 'days').format('YYYY-MM-DD'),
        }
        await this.props.list(data);
      this.setState({ refreshing: false })
    }

  async componentDidMount() {
    await this.props.getUserAcademies(this.props.loggedInUser._id);
    let academies = this.props.userAcademies || {};
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

    let data = {
        academyId: academyIds.join(','),
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(31, 'days').format('YYYY-MM-DD'),
    }
    await this.props.list(data);

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

  render() {
    return (
      <Animated.View style={[styles.container, this.fadeIn(0, -20)]}>
        <ScheduleElement
            classes={this.props.classes}
            loggedInUser={this.props.loggedInUser}
            attend={this.props.attend}
            unattend={this.props.unattend}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.refreshing}/>
      </Animated.View>
    );
  }
}


export default UserScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});