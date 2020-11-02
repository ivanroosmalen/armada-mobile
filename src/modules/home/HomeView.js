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

import { fonts, colors } from '../../styles';
import { Text } from '../../components/StyledText';
import { translate } from '../../translations/index.js';
import GetLocation from 'react-native-get-location'
import { Button } from '../../components';
import settings from '../../settings.js'
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AcademyElement from '../academies/AcademyElement';
import NotificationElement from '../notifications/NotificationElement';
import ScheduleElement from '../schedule/ScheduleElement';
import { LineChart } from "react-native-chart-kit";

export default class HomeScreen extends React.Component {

    state = {
        displayedAcademies: [],
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
          useShadowColorFromDataset: false,
          decimalPlaces: 0,
        },
        maxAttendanceValue: 0,
        allUserAcademies: [],
        academies: [],
        academyIds: [],
        academyQuery: {}
      }


    async onRefresh() {
      this.setState({ refreshing: true })
      await this.getData(this.state.academyQuery, false, false, false);
      this.setState({ refreshing: false })
    }

  async getData(params = null, academiesFromCache = true, classesFromCache = true, othersFromCache = true) {
    let dataRequests = [
        this.props.getAcademies('home-list', params, {}, academiesFromCache)
    ];

    if(this.props.loggedInUser) {
        let startDate = moment().subtract(12, 'weeks').toISOString();
        let endDate = moment().toISOString();
        dataRequests.push(this.props.getUserAcademies(this.props.loggedInUser._id, {}, academiesFromCache))
        dataRequests.push(this.props.getUserAttendanceMetrics({ startDate, endDate }, othersFromCache))
    }
    await Promise.all(dataRequests);

    let academies = this.props.loggedInUser && this.props.userAcademies && this.props.userAcademies[this.props.loggedInUser._id] || {};
    let academyTypeObjs = ['owner', 'instructor', 'student']
    let userAcademiesById = {};
    academyTypeObjs.forEach(academyTypeObj => {
        if(academies && academies[academyTypeObj] && academies[academyTypeObj].length) {
            academies[academyTypeObj].forEach(academy => {
                userAcademiesById[academy._id] = academy;
            })
        }
    })

    let academyIds = [];
    academies.student && academies.student.forEach(academy => {
        academyIds.push(academy._id)
    });

    if(this.props.loggedInUser) {
        this.props.getClasses(this.props.loggedInUser._id + '-home', {
            academyId: academyIds.join(','),
            startDate: moment().toISOString(),
            endDate: moment().add(14, 'days').format('YYYY-MM-DD'),
        }, {}, classesFromCache);
    }

    if(academies['student'] && academies['student'].length) {
        this.props.getNotifications({academyIds: academies['student'].map(academy => academy._id).join(',')})
    }

    let data = null;
    let maxAttendanceValue = 0;
    if(this.props.loggedInUser && this.props.userAttendanceMetrics && this.props.userAttendanceMetrics.byWeek && Object.keys(this.props.userAttendanceMetrics.byWeek).length) {
        data = {
          labels: Object.keys(this.props.userAttendanceMetrics.byWeek).map(date => date.substring(5,10)),
          datasets: [
            {
              data: Object.values(this.props.userAttendanceMetrics.byWeek),
              color: () => colors.secondaryText,
              strokeWidth: 1
            }
          ]
        };

        maxAttendanceValue = Math.max(...Object.values(this.props.userAttendanceMetrics.byWeek))
    }

    this.setState({
        allUserAcademies: Object.values(userAcademiesById),
        data,
        maxAttendanceValue,
        academyIds
    });
  }

  async componentDidMount() {
    let location = {};
    try {
        location = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 1000,
        })
    } catch(e) {
    }

    location.latitude = location.latitude || settings.defaultLat;
    location.longitude = location.longitude  || settings.defaultLng

    let params = {
      currentLat: location.latitude,
      currentLng: location.longitude
    }

    await this.getData(params);

    this.setState({ location, academyQuery: params })

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    async componentDidUpdate(prevProps, prevState) {
      if (prevProps.academyListUpdate !== this.props.academyListUpdate) {
        this.getData(this.state.academyQuery, false);
      }

      if (prevProps.classListUpdate !== this.props.classListUpdate) {
        this.getData(this.state.academyQuery, true, false);
      }

      if(prevProps.loggedInUser !== this.props.loggedInUser) {
        this.getData(this.state.academyQuery, false, false, false);
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

  _getRenderNotificationFunction = ({ item }) => {
    return (
       <NotificationElement
            notification={item}
            broadcast={() => {}}
            deleteMessage={() => {}}
            key={item._id}
            isOwner={false}
            titleColor={colors.terciaryText}
       />
    );
  };

    render() {
           let currentUser = this.props.loggedInUser;
           let hasAcademies = this.state.allUserAcademies && this.state.allUserAcademies.length;
           let displayedAcademies = hasAcademies ? this.state.allUserAcademies : (this.props.academies && this.props.academies['home-list']);
           let notifications = this.props.notifications && this.props.notifications.length ? [this.props.notifications[0]] : [];
           let todaysNotifications = this.props.notifications && this.props.notifications.length ? this.props.notifications.filter(notification => (moment(notification.createdDate) > moment().startOf('day'))) : [];
           let maxAttendanceValue = this.state.maxAttendanceValue;
           let classes = this.props.classes && this.props.loggedInUser ? this.props.classes[this.props.loggedInUser._id + '-home'] : [];

           return (
             <Animated.ScrollView
                style={[,this.fadeIn(0, 0)]}
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
                >
                <View style={styles.section}>
                {!(notifications && notifications.length) && !this.state.maxAttendanceValue && (
                    <View>
                     <Text style={styles.header}>
                         {translate('welcome')}
                     </Text>
                     <Text style={styles.content}>
                        {translate('howToUse')}
                     </Text>
                    </View>
                 )}

                {!!this.state.data && currentUser && (
                     <View style={{flexShrink: 0, marginVertical: 10}}>
                         <Text style={styles.header}>
                             {translate('weeklyAttendance')} ({this.props.userAttendanceMetrics.total} {translate('total')})
                         </Text>
                         <View style={{marginTop: 10, marginLeft: -30}}>
                            <LineChart
                              data={this.state.data}
                              chartConfig={this.state.chartConfig}
                              width={Dimensions.get("window").width + 30}
                              height={100}
                              withVerticalLabels={false}
                              withHorizontalLines={true}
                              withVerticalLines={true}
                              withInnerLines={false}
                              segments={maxAttendanceValue}
                              yAxisInterval={1}
                              fromZero={true}
                            />
                        </View>
                     </View>
                 )}

                {!!(notifications && notifications.length) && currentUser && (
                    <View style={{flexShrink: 1, marginVertical: 10}}>
                     <TouchableOpacity style={styles.headerContainer}
                        onPress={() => {this.props.navigation.navigate('NotificationList')}}>
                     <Text style={styles.header}>
                         {translate('latestNotification')} {todaysNotifications && todaysNotifications.length ? '('+todaysNotifications.length+' '+translate('today')+')' : '' }
                     </Text>
                      <Icon
                        name="menu-right"
                        size={25}
                        color={colors.secondaryIcon}
                      />
                     </TouchableOpacity>
                        <FlatList
                          keyExtractor={item => item._id }
                          style={{ backgroundColor: colors.terciaryBackground, marginHorizontal: 15 }}
                          data={notifications || []}
                          renderItem={this._getRenderNotificationFunction}
                        />
                    </View>
                 )}

                {!currentUser && (
                <Button
                        secondary
                        rounded
                        small
                        bgColor={ colors.primaryBackground }
                        textColor={ colors.primaryText }
                        style={ styles.loginRegisterButton }
                        caption={ translate('loginRegister') }
                        onPress={() => this.props.navigation.navigate('Auth')}
                      />
                )}
              </View>

              {!!(classes && classes.length && currentUser) && (
                <View style={{maxHeight: 600, minHeight: 400, marginVertical: 10 }}>
                     <TouchableOpacity style={styles.headerContainer}
                        onPress={() => {this.props.navigation.navigate('UserSchedule', { id: this.props.loggedInUser._id })}}>
                     <Text style={styles.header}>
                         {translate('mySchedule') }
                     </Text>
                      <Icon
                        name="menu-right"
                        size={25}
                        color={colors.secondaryIcon}
                      />
                     </TouchableOpacity>
                    <ScheduleElement
                        classes={classes}
                        loggedInUser={this.props.loggedInUser}
                        attend={this.props.attend}
                        unattend={this.props.unattend}
                        refreshing={false}
                        onRefresh={() => {}}
                        navigation={this.props.navigation}
                        hideWeekView={true}/>
                </View>
              )}


              {!(classes && classes.length) && !!(displayedAcademies && displayedAcademies.length) && (
                  <View style={styles.academySection} ref={this._academyListElement}>
                     <TouchableOpacity style={styles.headerContainer}
                        onPress={() => {hasAcademies ? this.props.navigation.navigate('UserAcademies', { id: currentUser._id }) : this.props.navigation.navigate('AcademyList')}}>
                     <Text style={styles.header}>
                         {hasAcademies ? translate('yourAcademies') + ' ('+displayedAcademies.length+')' : translate('academiesNearYou')}
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
                               data={displayedAcademies}
                               renderItem={this._getRenderItemFunction}
                               contentContainerStyle={{ paddingRight: 30 }}
                             />
                  </View>
              )}

              {!(classes && classes.length) && !(displayedAcademies && displayedAcademies.length) && (
                <View style={styles.academySection}>
                  <View>
                     <Text style={styles.content}>
                         {translate('noAcademiesNear')}
                     </Text>

                    {!currentUser && (
                        <Button
                            secondary
                            rounded
                            small
                            bgColor={ colors.primaryBackground }
                            textColor={ colors.primaryText }
                            style={ styles.createAcademyButton }
                            caption={ translate('createYourAcademy') }
                            onPress={() => this.props.navigation.navigate('Auth')}
                          />
                    )}

                    {!!currentUser && (
                        <Button
                            secondary
                            rounded
                            small
                            bgColor={ colors.primaryBackground }
                            textColor={ colors.primaryText }
                            style={ styles.createAcademyButton }
                            caption={ translate('createYourAcademy') }
                            onPress={() => this.props.navigation.navigate('AcademyCreate')}
                          />
                    )}
                  </View>

                  <View style={styles.quarterSection}>
                     <Text style={styles.content}>
                         {translate('browse')}
                     </Text>

                        <Button
                            secondary
                            rounded
                            small
                            bgColor={ colors.primaryBackground }
                            textColor={ colors.primaryText }
                            style={ styles.createAcademyButton }
                            caption={ translate('academies') }
                            onPress={() => this.props.navigation.navigate('AcademyList')}
                          />
                  </View>
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
//    flexShrink: 1
  },
  academySection: {
//    flexShrink: 0,
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
