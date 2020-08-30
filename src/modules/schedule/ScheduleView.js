import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button, Alert } from 'react-native';

import { colors, fonts } from '../../styles';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ClassEdit', { academyId: this.props.route.params.id })}
            style={ styles.addButton } >
          <Icon
              name="plus-circle"
              style={styles.addIcon}
            />
        </TouchableOpacity>
      </View>
    );
  }
}


export default ScheduleScreen;

const styles = StyleSheet.create({
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
        borderRadius: 20
  }
});