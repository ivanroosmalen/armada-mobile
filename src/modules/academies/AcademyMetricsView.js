import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Dimensions,
  Animated,
  RefreshControl,
  ScrollView
} from 'react-native';

import * as RNLocalize from 'react-native-localize';
import { fonts, colors } from '../../styles';
import { Text } from '../../components/StyledText';
import { Dropdown } from '../../components';
import { translate } from '../../translations/index.js';
import settings from '../../settings.js'
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart } from "react-native-chart-kit";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default class AcademyMetrics extends React.Component {

    state = {
        anim: new Animated.Value(0),
        refreshing: false,
        ownerAcademies: [],
        academyIndex: 0,
        memberIndex: 0,
        dailyAcademyData: null,
        dailyAcademyChartConfig: {
          backgroundGradientFrom: colors.secondaryBackground,
          backgroundGradientFromOpacity: 1,
          backgroundGradientTo: colors.secondaryBackground,
          backgroundGradientToOpacity: 1,
          color: () => colors.secondaryText,
          strokeWidth: 2,
          decimalPlaces: 0,
          useShadowColorFromDataset: false
        },
        byDayAcademyData: null,
        byDayAcademyChartConfig: {
          backgroundGradientFrom: colors.secondaryBackground,
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: colors.secondaryBackground,
          backgroundGradientToOpacity: 0,
          fillShadowGradient: colors.primaryBackground,
          fillShadowGradientOpacity: 1,
          decimalPlaces: 0,
          strokeWidth: 3,
          barPercentage: 1,
          color: () => colors.secondaryText,
        },
        memberData: null,
        memberChartConfig: {
          backgroundGradientFrom: colors.secondaryBackground,
          backgroundGradientFromOpacity: 1,
          backgroundGradientTo: colors.secondaryBackground,
          backgroundGradientToOpacity: 1,
          color: () => colors.secondaryText,
          strokeWidth: 2,
          decimalPlaces: 0,
          useShadowColorFromDataset: false
        },
        totalAttendanceValue: 0,
        totalMemberAttendanceValue: 0,
        maxAttendanceValue: 0,
        maxAttendanceValueByDay: 0,
        maxMemberValue: 0,
        numberOfDays: 1,
        numberOfWeeks: 1,
        startDate: moment().subtract(13, 'days').toISOString(),
        endDate: moment().toISOString(),
        isStartDatePickerVisible: false
      }

    async onRefresh() {
      this.setState({ refreshing: true })
      await this.getData(false);
      this.setState({ refreshing: false })
    }

    async getMetrics(academyIndex, memberIndex, startDate, endDate) {
        this.setState({ refreshing: true });

        let ownerAcademies = this.props.userAcademies && this.props.userAcademies[this.props.loggedInUser._id] && this.props.userAcademies[this.props.loggedInUser._id].owner || [];
        let academyId = ownerAcademies[academyIndex]._id;

        let academyMember = this.props.academyMembers && this.props.academyMembers[academyId] && this.props.academyMembers[academyId][memberIndex] || {};
        startDate = moment(startDate).startOf('day').toISOString()

        if(moment(endDate).endOf('day') <= moment()) {
            endDate = moment(endDate).endOf('day').toISOString()
        } else {
            endDate = moment().toISOString()
        }

        await Promise.all([
            this.props.getTotalAttendanceMetrics({ startDate, endDate, timezone: RNLocalize.getTimeZone(), academyId: academyId }),
            this.props.getUserAttendanceMetrics({ startDate, endDate, academyId: academyId, memberId: academyMember._id})
        ])

        let dailyAcademyData = null;
        let byDayAcademyData = null;
        let maxAttendanceValue = 0;
        let maxAttendanceValueByDay = 0;
        let numberOfDays = 1;
        let attendanceByDay = this.props.totalAttendanceMetrics && this.props.totalAttendanceMetrics.byWeek;
        if(this.props.loggedInUser && attendanceByDay && Object.keys(attendanceByDay).length) {
            let modulo = parseInt(Object.keys(attendanceByDay).length / 7) || 1;
            let labels = Object.keys(attendanceByDay).map((date, index) => {
                if(index % modulo === 0) {
                    return date.substring(5,10);
                } else {
                    return '';
                }
            });

            dailyAcademyData = {
              labels: labels,
              datasets: [
                {
                  data: Object.values(attendanceByDay),
                  color: () => colors.secondaryText,
                  strokeWidth: 1
                }
              ]
            };

            maxAttendanceValue = Math.max(...Object.values(attendanceByDay));
            numberOfDays = labels.length;

            let dayCount = {};
            let labelMap = {};
            Object.keys(attendanceByDay).forEach(day => {
                let dayLabel = moment(day).format('ddd');
                let dayNumber = moment(day).day();
                labelMap[dayNumber] = dayLabel;
                dayCount[dayLabel] = dayCount[dayLabel] ? dayCount[dayLabel] + attendanceByDay[day] : attendanceByDay[day];
            })

            const orderedDays = {};
            const orderedLabels = {};
            Object.keys(labelMap).sort().forEach(key =>  {
              orderedLabels[key] = labelMap[key];
            });
            Object.values(orderedLabels).forEach(label => {
                orderedDays[label] = dayCount[label];
            })

            byDayAcademyData = {
              labels: Object.keys(orderedDays),
              datasets: [
                {
                  data: Object.values(orderedDays),
                  color: () => colors.secondaryText
                }
              ]
            };

            maxAttendanceValueByDay = Math.max(...Object.values(dayCount))
        }

        let memberData = null;
        let maxMemberValue = 0;
        let numberOfWeeks = 1;
        let userAttendance = this.props.userAttendanceMetrics && this.props.userAttendanceMetrics.byWeek;
        if(this.props.loggedInUser && userAttendance && Object.keys(userAttendance).length) {
            let moduloMember = parseInt(Object.keys(userAttendance).length / 7) || 1;
            let labelsMember = Object.keys(userAttendance).map((date, index) => {
                if(index % moduloMember === 0) {
                    return date.substring(5,10);
                } else {
                    return '';
                }
            });
            memberData = {
              labels: labelsMember,
              datasets: [
                {
                  data: Object.values(userAttendance),
                  color: () => colors.secondaryText,
                  strokeWidth: 1
                }
              ]
            };

            maxMemberValue = Math.max(...Object.values(userAttendance));
            numberOfWeeks = Object.keys(userAttendance).length;
        }

        this.setState({
            dailyAcademyData,
            byDayAcademyData,
            memberData,
            totalAttendanceValue: this.props.totalAttendanceMetrics ? this.props.totalAttendanceMetrics.total : 0,
            totalMemberAttendanceValue: this.props.userAttendanceMetrics ? this.props.userAttendanceMetrics.total : 0,
            maxAttendanceValue,
            maxAttendanceValueByDay,
            maxMemberValue,
            startDate,
            endDate,
            numberOfDays,
            numberOfWeeks,
            ownerAcademies,
            refreshing: false
        });
    }

  async getData(fromCache = true) {

    if(this.props.loggedInUser) {
        let dataRequests = [];
        dataRequests.push(this.props.getUserAcademies(this.props.loggedInUser._id, {}, fromCache));
        await Promise.all(dataRequests);

        let startDate = moment().subtract(13, 'days').toISOString();
        let endDate = moment().toISOString();
        await this.getAcademyMembers(this.state.academyIndex);
        await this.getMetrics(this.state.academyIndex, this.state.memberIndex, startDate, endDate);

    }

  }

  async getAcademyMembers(academyIndex) {
    let ownerAcademies = this.props.userAcademies && this.props.userAcademies[this.props.loggedInUser._id] && this.props.userAcademies[this.props.loggedInUser._id].owner || [];
    let academyId = ownerAcademies[academyIndex]._id;

    await this.props.getAcademyMembers(academyId, { academyId: academyId }, {}, true)

    let sortedMembers = this.props.academyMembers && this.props.academyMembers[academyId] && this.props.academyMembers[academyId].sort((a,b) => {
        if(!a.member.alias) a.member.alias = 'Unknown';
        if(!b.member.alias) b.member.alias = 'Unknown';

        return a.member.alias > b.member.alias;
    });
    this.setState({ sortedMembers })
  }

  async componentDidMount() {
    await this.getData();

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

  async onAcademySelected(index) {
    this.setState({ academyIndex: index, memberIndex: 0 });
    await this.getAcademyMembers(index);
    await this.getMetrics(index, 0, this.state.startDate, this.state.endDate);
  }

  async onMemberSelected(index) {
    this.setState({ memberIndex: index });
    await this.getMetrics(this.state.academyIndex, index, this.state.startDate, this.state.endDate);
  }

  onConfirmStartDatePicker = (date) => {
      this.getMetrics(this.state.academyIndex, this.state.memberIndex, date, this.state.endDate);
      this.setState({
        isStartDatePickerVisible: false
      })
  }

  onConfirmEndDatePicker = (date) => {
      this.getMetrics(this.state.academyIndex, this.state.memberIndex, this.state.startDate, date);
      this.setState({
        isEndDatePickerVisible: false
      })
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
           let currentUser = this.props.loggedInUser;
           let ownerAcademies = this.state.ownerAcademies;
           let sortedMembers = this.state.sortedMembers;
           let currentAcademy = ownerAcademies[this.state.academyIndex];
           let academyNames = ownerAcademies.map(oa => oa.name);

           let memberNames = sortedMembers && sortedMembers.map(am => am.member.alias);

           let totalAttendanceValue = this.state.totalAttendanceValue;
           let maxAttendanceValue = this.state.maxAttendanceValue;
           let maxAttendanceValueByDay = this.state.maxAttendanceValueByDay;

           return (
             <Animated.View
                style={[,this.fadeIn(0, 0), styles.container]}
                contentContainerStyle={styles.container} >
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh() }/>}>
                    <View>
                            <Dropdown
                                color={colors.terciaryText}
                                listBackgroundColor={colors.primaryBackground}
                                listTextColor={colors.primaryText}
                                fontSize={20}
                                style={ styles.dropdown }
                                items={academyNames}
                                selectedIndex={this.state.academyIndex}
                                onSelect={(index) => { this.onAcademySelected(index) }}
                            />

                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.dateText}>
                                       { moment(this.state.startDate || new Date()).format('DD MMM, YYYY') }
                                    </Text>
                                    <Icon
                                      name="calendar"
                                      style={styles.calendarIcon}
                                      onPress={() => (this.setState({ isStartDatePickerVisible: true }))}
                                    />
                                </View>

                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.dateText}>
                                       { moment(this.state.endDate || new Date()).format('DD MMM, YYYY') }
                                    </Text>
                                    <Icon
                                      name="calendar"
                                      style={styles.calendarIcon}
                                      onPress={() => (this.setState({ isEndDatePickerVisible: true }))}
                                    />
                                </View>
                            </View>

                {!!(currentUser && totalAttendanceValue) && (
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20}}>
                        <View>
                            <Text style={styles.header}>
                                 {translate('total').charAt(0).toUpperCase() + translate('total').slice(1)}
                            </Text>
                            <Text style={styles.value}>
                                 {totalAttendanceValue}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.header}>
                                 {translate('average')}
                            </Text>
                            <Text style={styles.value}>
                                 {(totalAttendanceValue / this.state.numberOfDays).toFixed(1)}
                            </Text>
                        </View>
                    </View>
                )}

                {!!(currentUser && this.state.dailyAcademyData) && (
                     <View style={{flexShrink: 0, marginVertical: 10}}>
                        <View style={{marginTop: 10, marginLeft: -30}}>
                            <LineChart
                              data={this.state.dailyAcademyData}
                              chartConfig={this.state.dailyAcademyChartConfig}
                              width={Dimensions.get("window").width + 30}
                              height={250}
                              withVerticalLabels={true}
                              withHorizontalLines={true}
                              withVerticalLines={true}
                              withInnerLines={false}
                              segments={maxAttendanceValue || 1}
                              yAxisInterval={1}
                              fromZero={true}
                              verticalLabelRotation={45}
                            />
                        </View>
                     </View>
                 )}

                {!!(currentUser && this.state.byDayAcademyData) && (
                     <View style={{flexShrink: 0, marginVertical: 10}}>
                        <View style={{marginTop: 10, marginLeft: -30}}>
                            <BarChart
                              data={this.state.byDayAcademyData}
                              chartConfig={this.state.byDayAcademyChartConfig}
                              width={Dimensions.get("window").width}
                              height={250}
                              withInnerLines={false}
                              segments={maxAttendanceValueByDay || 1}
                              yAxisInterval={1}
                              fromZero={true}
                              verticalLabelRotation={45}
                              showValuesOnTopOfBars={true}
                              showBarTops={true}
                            />
                        </View>
                     </View>
                 )}


                            <DateTimePickerModal
                              isVisible={this.state.isStartDatePickerVisible}
                              mode="date"
                              date={this.state.startDate ? new Date(this.state.startDate) : new Date()}
                              onConfirm={this.onConfirmStartDatePicker}
                              onCancel={() => (this.setState({ isStartDatePickerVisible: false }))}
                            />

                            <DateTimePickerModal
                              isVisible={this.state.isEndDatePickerVisible}
                              mode="date"
                              date={this.state.endDate ? new Date(this.state.endDate) : new Date()}
                              onConfirm={this.onConfirmEndDatePicker}
                              onCancel={() => (this.setState({ isEndDatePickerVisible: false }))}
                            />

                {!!(currentUser && memberNames && memberNames.length) && (
                    <View>
                            <Dropdown
                                color={colors.terciaryText}
                                listBackgroundColor={colors.primaryBackground}
                                listTextColor={colors.primaryText}
                                fontSize={20}
                                style={ styles.dropdown }
                                items={memberNames || []}
                                selectedIndex={this.state.memberIndex}
                                onSelect={(index) => { this.onMemberSelected(index) }}
                            />
                    </View>
                )}

                {!!(currentUser && totalAttendanceValue) && (
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20}}>
                        <View>
                            <Text style={styles.header}>
                                 {translate('total').charAt(0).toUpperCase() + translate('total').slice(1)}
                            </Text>
                            <Text style={styles.value}>
                                 {this.state.totalMemberAttendanceValue}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.header}>
                                 {translate('weeklyAverage')}
                            </Text>
                            <Text style={styles.value}>
                                 {(this.state.totalMemberAttendanceValue / this.state.numberOfWeeks).toFixed(1)}
                            </Text>
                        </View>
                    </View>
                )}

                {!!(currentUser && this.state.memberData) && (
                     <View style={{flexShrink: 0, marginVertical: 10}}>
                        <View style={{marginTop: 10, marginLeft: -30}}>
                            <LineChart
                              data={this.state.memberData}
                              chartConfig={this.state.memberChartConfig}
                              width={Dimensions.get("window").width + 30}
                              height={250}
                              withVerticalLabels={true}
                              withHorizontalLines={true}
                              withVerticalLines={true}
                              withInnerLines={false}
                              segments={this.state.maxMemberValue || 1}
                              yAxisInterval={1}
                              fromZero={true}
                              verticalLabelRotation={45}
                            />
                        </View>
                     </View>
                 )}
                </ScrollView>
             </Animated.View>
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
  dropdown: {
    fontSize: 25,
    paddingHorizontal: 20
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.terciaryText
  },
  value: {
    fontSize: 30,
    textAlign: 'center',
    color: colors.terciaryText
  },
  dateText: {
    fontSize: 20
  },
  calendarIcon: {
    fontSize: 30,
  },
});
