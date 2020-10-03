import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button, Alert, Animated, RefreshControl } from 'react-native';

import { colors, fonts } from '../../styles';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScheduleElement from './ScheduleElement';
import { translate } from '../../translations/index.js';

class ScheduleScreen extends React.Component {

  state = {
    anim: new Animated.Value(0),
    refreshing: false
  }

    async onRefresh() {
      this.setState({ refreshing: true })
      await this.getData();
      this.setState({ refreshing: false })
    }

  async getData() {
    let data = {
        academyId: this.props.route.params.id,
        startDate: moment().toISOString(),
        endDate: moment().add(31, 'days').toISOString(),
    }
    await Promise.all([
        this.props.list(`academy-${this.props.route.params.id}`, data),
        this.props.getAcademy(this.props.route.params.id)
    ]);
  }

  async componentDidMount() {
    await this.getData();

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    async componentDidUpdate(prevProps, prevState) {
      if (prevProps.classListUpdate !== this.props.classListUpdate) {
        await this.getData();
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
    let academy = this.props.academy;
    let classes = this.props.classes && this.props.classes[`academy-${this.props.route.params.id}`]
    let isLoggedIn = this.props.loggedInUser;
    let userIsOwner = !!(isLoggedIn && academy && academy.owners && academy.owners.find(owner => owner._id === this.props.loggedInUser._id))

    return (
      <Animated.View style={[styles.container, this.fadeIn(0, -20)]}>
        <ScheduleElement
            classes={classes}
            loggedInUser={this.props.loggedInUser}
            attend={this.props.attend}
            unattend={this.props.unattend}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.refreshing}
            navigation={this.props.navigation}/>

        {userIsOwner && (
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ClassEdit', { academyId: this.props.route.params.id })}
            style={ styles.addButton } >
          <Icon
              name="plus-circle"
              style={styles.addIcon}
            />
        </TouchableOpacity>
        )}
      </Animated.View>
    );
  }
}


export default ScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
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