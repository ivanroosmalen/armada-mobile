import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button, Alert } from 'react-native';

import { colors, fonts } from '../../styles';
import moment from 'moment';

import ScheduleElement from './ScheduleElement';

class UserScheduleScreen extends React.Component {

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
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScheduleElement  classes={this.props.classes} loggedInUser={this.props.loggedInUser} attend={this.props.attend} unattend={this.props.unattend} />
      </View>
    );
  }
}


export default UserScheduleScreen;
