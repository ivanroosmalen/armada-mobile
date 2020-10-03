import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Dimensions,
  Animated,
  RefreshControl
} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import { fonts, colors } from '../../styles';
import { Text } from '../../components/StyledText';
import { translate } from '../../translations/index.js';
import { Button } from '../../components';
import settings from '../../settings.js'
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AcademyElement from '../academies/AcademyElement';
import AcademyRequestElement from '../academies/AcademyRequestElement';

import { LineChart } from "react-native-chart-kit";

export default class OwnerDashboardScreen extends React.Component {

    state = {
        academies: [],
        academyRequests: [],
        totalAttendanceValue: 0,
        maxAttendanceValue: 0,
        anim: new Animated.Value(0),
        refreshing: false,
        data: null,
        chartConfig: {
          backgroundGradientFrom: colors.secondaryBackground,
          backgroundGradientFromOpacity: 1,
          backgroundGradientTo: colors.secondaryBackground,
          backgroundGradientToOpacity: 1,
          color: () => colors.secondaryText,
          strokeWidth: 2,
          useShadowColorFromDataset: false
        }
      }

    async onRefresh() {
      this.setState({ refreshing: true })
      await this.getData();
      this.setState({ refreshing: false })
    }

  async getData() {
    let dataRequests = [];
    if(this.props.loggedInUser) {
        let startDate = moment().subtract(2, 'weeks').toISOString();
        let endDate = moment().toISOString();
        dataRequests.push(this.props.getUserAcademies(this.props.loggedInUser._id))
        dataRequests.push(this.props.getAcademyRequests({ complete: false })),
        dataRequests.push(this.props.getTotalAttendanceMetrics({ startDate, endDate, timezone: RNLocalize.getTimeZone() }))
    }
    await Promise.all(dataRequests);

    let data = null;
    let maxAttendanceValue = 0;
    if(this.props.loggedInUser && this.props.totalAttendanceMetrics && this.props.totalAttendanceMetrics.byWeek && Object.keys(this.props.totalAttendanceMetrics.byWeek).length) {
        data = {
          labels: Object.keys(this.props.totalAttendanceMetrics.byWeek).map(date => date.substring(5,10)),
          datasets: [
            {
              data: Object.values(this.props.totalAttendanceMetrics.byWeek),
              color: () => colors.secondaryText,
              strokeWidth: 1
            }
          ]
        };

        maxAttendanceValue = Math.max(...Object.values(this.props.totalAttendanceMetrics.byWeek))
    }

    this.setState({
        academies: this.props.userAcademies['owner'] || [],
        academyRequests: this.props.academyRequests || [],
        data,
        totalAttendanceValue: this.props.totalAttendanceMetrics ? this.props.totalAttendanceMetrics.total : 0,
        maxAttendanceValue
    });
  }

  async componentDidMount() {
    await this.getData();

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    async componentDidUpdate(prevProps, prevState) {
      if (prevProps.userAcademies && prevProps.userAcademies['owner'] && this.props.userAcademies && this.props.userAcademies['owner'] && prevProps.userAcademies['owner'].length !== this.props.userAcademies['owner'].length ||
          prevProps.academyRequests.length !== this.props.academyRequests.length) {
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

    _getRenderItemFunction = ({ item }) => {
        return (
               <AcademyElement
                    academy={item}
                    key={item._id}
                    style={{flex: 1}}
               />
        );
      };

  _getRenderAcademyRequestFunction = ({ item }) => {
    return (
       <AcademyRequestElement
            academyRequest={item}
            approveAcademyRequest={this.props.approveAcademyRequest}
            key={item._id}
       />
    );
  };

    render() {
           let currentUser = this.props.loggedInUser;
           let academies = this.state.academies;
           let hasAcademies = !!(academies && academies.length);
           let academyRequests = this.state.academyRequests;
           let totalAttendanceValue = this.state.totalAttendanceValue;
           let maxAttendanceValue = this.state.maxAttendanceValue;

           return (
             <Animated.ScrollView
                style={[,this.fadeIn(0, 0)]}
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
                >
                <View style={styles.section}>

                {!!(academyRequests && academyRequests.length) && (
                    <View style={{flexShrink: 1, marginVertical: 10}}>
                     <TouchableOpacity style={styles.headerContainer}
                        onPress={() => {this.props.navigation.navigate('AcademyRequestList')}}>
                         <Text style={styles.header}>
                             {translate('academyRequests')} ({academyRequests.length})
                         </Text>
                      <Icon
                        name="menu-right"
                        size={25}
                        color={colors.secondaryIcon}
                      />
                     </TouchableOpacity>
                        <FlatList
                          keyExtractor={item => item._id }
                          style={{ backgroundColor: colors.terciaryBackground, paddingHorizontal: 15 }}
                          data={academyRequests}
                          renderItem={this._getRenderAcademyRequestFunction}
                        />
                    </View>
                 )}

                {!!this.state.data && (
                     <View style={{flexShrink: 0, marginVertical: 10}}>
                         <Text style={styles.header}>
                             {translate('dailyAttendance')} ({totalAttendanceValue} {translate('total')})
                         </Text>
                        <View style={{marginTop: 10, marginLeft: -30}}>
                            <LineChart
                              data={this.state.data}
                              chartConfig={this.state.chartConfig}
                              width={Dimensions.get("window").width + 30}
                              height={academyRequests.length ? 130 : 200}
                              withVerticalLabels={false}
                              withHorizontalLines={true}
                              withVerticalLines={true}
                              withInnerLines={false}
                              segments={maxAttendanceValue}
                              yAxisInterval={1}
                              formatYLabel={(value) => (parseInt(value))}
                            />
                        </View>
                     </View>
                 )}
              </View>

              {hasAcademies && (
                  <View style={styles.academySection} ref={this._academyListElement}>
                     <TouchableOpacity style={styles.headerContainer}
                        onPress={() => {hasAcademies ? this.props.navigation.navigate('UserAcademies', { id: currentUser._id }) : this.props.navigation.navigate('Academies')}}>
                     <Text style={styles.header}>
                         { translate('yourAcademies') + ' ('+academies.length+')' }
                     </Text>
                      <Icon
                        name="menu-right"
                        size={25}
                        color={colors.secondaryIcon}
                      />
                     </TouchableOpacity>
                             <FlatList
                               horizontal
                               keyExtractor={item => item._id }
                               style={{ backgroundColor: colors.white, paddingHorizontal: 15 }}
                               data={academies}
                               renderItem={this._getRenderItemFunction}
                               contentContainerStyle={{ paddingRight: 30 }}
                             />
                  </View>
              )}

             </Animated.ScrollView>
           );
         }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'space-between'
  },
  section: {
    flexShrink: 1
  },
  academySection: {
    flexShrink: 0,
    justifyContent: 'flex-end'
  },
  quarterSection: {
    justifyContent: 'flex-end',
    paddingBottom: 20
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    color: colors.terciaryText
  },
  content: {
    paddingTop: 20,
    fontSize: 20,
    paddingHorizontal: 15
  },
  loginRegisterButton: {
    width: 200,
    marginTop: 50,
    alignSelf: 'center'
  },
  createAcademyButton: {
    width: 250,
    marginTop: 20,
    alignSelf: 'center'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10
  }
});
