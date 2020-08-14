import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button, Alert } from 'react-native';

import { colors, fonts } from '../../styles';
import moment from 'moment';

import ScheduleElement from './ScheduleElement';

class ScheduleScreen extends React.Component {

  async componentDidMount() {
    let data = {
        academyId: this.props.route.params.id,
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(31, 'days').format('YYYY-MM-DD'),
    }
    await this.props.list(data);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScheduleElement classes={this.props.classes} loggedInUser={this.props.loggedInUser} attend={this.props.attend} unattend={this.props.unattend}/>
      </View>
    );
  }
}


export default ScheduleScreen;
