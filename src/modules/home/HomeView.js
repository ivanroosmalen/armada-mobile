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
import AcademyRequestElement from '../academies/AcademyRequestElement';
import NotificationElement from '../notifications/NotificationElement';

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
          useShadowColorFromDataset: false
        },
        maxAttendanceValue: 0

      }

    async onRefresh() {
      this.setState({ refreshing: true })
        let dataRequests = [
            this.props.getAcademies()
        ];
        if(this.props.loggedInUser) {
             dataRequests.push(this.props.getUserAcademies(this.props.loggedInUser._id))
             dataRequests.push(this.props.getAcademyRequests({ complete: false }))
        }
             await Promise.all(dataRequests);

             let academyTypeObjs = ['student', 'instructor', 'owner']
             let userAcademiesById = {};
                 academyTypeObjs.forEach(academyTypeObj => {
                     if(this.props.userAcademies && this.props.userAcademies[academyTypeObj] && this.props.userAcademies[academyTypeObj].length) {
                         this.props.userAcademies[academyTypeObj].forEach(academy => {
                             userAcademiesById[academy._id] = academy;
                         })
                     }
                 })

              let userAcademies = Object.values(userAcademiesById);

             this.setState({
                 allUserAcademies: userAcademies
             });
      this.setState({ refreshing: false })
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

    let dataRequests = [
        this.props.getAcademies(params)
    ];

    if(this.props.loggedInUser) {
        let startDate = moment().subtract(12, 'weeks').format('YYYY-MM-DD');
        let endDate = moment().format('YYYY-MM-DD');
        dataRequests.push(this.props.getUserAcademies(this.props.loggedInUser._id))
        dataRequests.push(this.props.getAcademyRequests({ complete: false })),
        dataRequests.push(this.props.getUserAttendanceMetrics({ startDate, endDate }))
    }
    await Promise.all(dataRequests);

    let academyTypeObjs = ['owner', 'instructor', 'student']
    let studentInstructorAcademyIds = [];
    let userAcademiesById = {};
        academyTypeObjs.forEach(academyTypeObj => {
            if(this.props.userAcademies && this.props.userAcademies[academyTypeObj] && this.props.userAcademies[academyTypeObj].length) {
                this.props.userAcademies[academyTypeObj].forEach(academy => {
                    userAcademiesById[academy._id] = academy;

                    if(academyTypeObj !== 'owner') {
                        studentInstructorAcademyIds.push(academy._id)
                    }
                })
            }
        })

    if(studentInstructorAcademyIds.length) {
        this.props.getNotifications({academyIds: studentInstructorAcademyIds.join(',')})
    }

    let data = null;
    let maxAttendanceValue = 0;
    if(this.props.loggedInUser && this.props.userAttendanceMetrics && this.props.userAttendanceMetrics.length) {
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
        location,
        allUserAcademies: Object.values(userAcademiesById),
        data,
        maxAttendanceValue
    });

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    async componentDidUpdate(prevProps, prevState) {
      if (prevProps.userAcademies !== this.props.userAcademies || prevProps.academies !== this.props.academies) {

        let academyTypeObjs = ['owner', 'instructor', 'student']
        let studentInstructorAcademyIds = [];
        let userAcademiesById = {};
            academyTypeObjs.forEach(academyTypeObj => {
                if(this.props.userAcademies && this.props.userAcademies[academyTypeObj] && this.props.userAcademies[academyTypeObj].length) {
                    this.props.userAcademies[academyTypeObj].forEach(academy => {
                        userAcademiesById[academy._id] = academy;

                    if(academyTypeObj !== 'owner') {
                        studentInstructorAcademyIds.push(academy._id)
                    }
                    })
                }
            })

        if(studentInstructorAcademyIds.length) {
            this.props.getNotifications({academyIds: studentInstructorAcademyIds.join(',')})
        }

            this.setState({
                allUserAcademies: Object.values(userAcademiesById)
            })
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

  _getRenderNotificationFunction = ({ item }) => {
    return (
       <NotificationElement
            notification={item}
            broadcast={() => {}}
            deleteMessage={() => {}}
            key={item._id}
            isOwner={false}
            titleColor={colors.terciaryText}
            height={'auto'}
       />
    );
  };

    render() {
           let currentUser = this.props.loggedInUser;
           let hasAcademies = this.props.userAcademies && (this.props.userAcademies['student'] || this.props.userAcademies['instructor'] || this.props.userAcademies['instructor']);
           let displayedAcademies = hasAcademies ? this.state.allUserAcademies : this.props.academies;
           let academyRequests = (this.props && this.props.academyRequests) || [];
           let notifications = this.props.notifications && this.props.notifications.length ? [this.props.notifications[0]] : [];
           let todaysNotifications = this.props.notifications && this.props.notifications.length ? this.props.notifications.filter(notification => (moment(notification.createdDate) > moment().startOf('day'))) : [];

           return (
             <Animated.ScrollView
                style={[,this.fadeIn(0, 0)]}
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
                >
                <View style={styles.section}>
                {!(academyRequests && academyRequests.length) && !(notifications && notifications.length) && !this.state.maxAttendanceValue && (
                    <View>
                     <Text style={styles.header}>
                         {translate('welcome')}
                     </Text>
                     <Text style={styles.content}>
                        {translate('howToUse')}
                     </Text>
                    </View>
                 )}

                {!academyRequests.length && !!this.state.maxAttendanceValue && !!this.state.data && (
                     <View style={{flexShrink: 0, marginVertical: 10}}>
                         <Text style={styles.header}>
                             {translate('weeklyAttendance')} ({this.props.userAttendanceMetrics.total} {translate('total')})
                         </Text>
                        <LineChart
                          data={this.state.data}
                          chartConfig={this.state.chartConfig}
                          width={Dimensions.get("window").width}
                          height={100}
                          withVerticalLabels={false}
                          withHorizontalLines={true}
                          withVerticalLines={false}
                          segments={this.state.maxAttendanceValue}
                        />
                     </View>
                 )}

                {!!academyRequests && !!academyRequests.length && (
                    <View style={{flexShrink: 0, marginVertical: 10}}>
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
                          data={this.props.academyRequests ? [this.props.academyRequests[0]] : []}
                          renderItem={this._getRenderAcademyRequestFunction}
                        />
                    </View>
                 )}

                {!!notifications && !!notifications.length && (
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

                {!this.props.loggedInUser && (
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

              {!!(displayedAcademies && displayedAcademies.length) && (
                  <View style={styles.academySection} ref={this._academyListElement}>
                     <TouchableOpacity style={styles.headerContainer}
                        onPress={() => {hasAcademies ? this.props.navigation.navigate('UserAcademies', { id: currentUser._id }) : this.props.navigation.navigate('Academies')}}>
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

              {!(displayedAcademies && displayedAcademies.length) && (
                <View style={styles.academySection}>
                  <View>
                     <Text style={styles.content}>
                         {translate('noAcademiesNear')}
                     </Text>

                    {!this.props.loggedInUser && (
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

                    {!!this.props.loggedInUser && (
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
                            onPress={() => this.props.navigation.navigate('Academies')}
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
