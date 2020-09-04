import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  NavigationEvents,
  Animated,
  RefreshControl,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../styles';

import settings from '../../settings.js';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AcademyRequestElement from './AcademyRequestElement';
import { translate } from '../../translations/index.js';

export default class AcademyRequestListScreen extends React.Component {

  state = {
    anim: new Animated.Value(0),
    refreshing: false
  }

  async onRefresh() {
    this.setState({ refreshing: true })
    await this.props.getAcademyRequests({ complete: false });
    this.setState({ refreshing: false })
  }

  async componentDidMount() {
    await this.props.getAcademyRequests({ complete: false });

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

  _getRenderItemFunction = ({ item }) => {
    return (
       <AcademyRequestElement
            academyRequest={item}
            approveAcademyRequest={this.props.approveAcademyRequest}
            key={item._id}
       />

    );
  };

  render() {
    let academyRequests = (this.props && this.props.academyRequests) || [];
    return (
        <Animated.ScrollView style={[styles.container, this.fadeIn(0, 0)]}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}>
                { !academyRequests.length && (
                    <Text style={styles.noRequests}>{ translate('noRequests') }</Text>
                )}

                { !!academyRequests.length && (
                    <FlatList
                      keyExtractor={item => item._id }
                      style={{ backgroundColor: colors.terciaryBackground, paddingHorizontal: 15 }}
                      data={this.props.academyRequests || []}
                      renderItem={this._getRenderItemFunction}
                      refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
                    />
                )}
          </Animated.ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondaryBackground
    },
    noRequests: {
        fontSize: 20,
        textAlign: 'center',
        color: colors.terciaryText
    }
});
