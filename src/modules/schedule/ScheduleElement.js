import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar, Agenda, LocaleConfig } from 'react-native-calendars';
import { Button } from '../../components';
import { colors, fonts } from '../../styles';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import { translate, setLocateConfig } from '../../translations/index.js';
import Modal from 'react-native-modal';

class ScheduleElement extends React.Component {

  state = {
    attendDialogVisible: false,
    loadingVisible: false,
    currentItem: {},
    navigation: {}
  };

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  getMarkedDates = (items) => {
    const marked = {};
    items.forEach(item => {
      if (item.data && item.data.length > 0 && !!item.data[0]) {
        marked[item.title] = {marked: true};
      } else {
        marked[item.title] = {disabled: true};
      }
    });
    return marked;
  }

    buttonPressed = (item) => {
        if(!this.props.loggedInUser) {
            return;
        }
        if(item.isAttending) {
            let data = {
              classId: item.entityId
            }

            this.unattend(data);
        } else if(item.supportOnlineClasses) {
            if(item.isFull && item.onlineIsFull) {
                Toast.showWithGravity(translate('classFull'), Toast.LONG, Toast.TOP);
                return;
            } else {
                this.setState({ attendDialogVisible: true, currentItem: item });
            }
        } else {
            if(item.isFull) {
                Toast.showWithGravity(translate('classFull'), Toast.LONG, Toast.TOP);
                return;
            } else {
                this.attend(item);
            }
        }
    }

   renderItem = ({item}, parent) => {
      if (!item) {
        return renderEmptyItem();
      }

      return (
        <TouchableOpacity
          onPress={() => parent.itemPressed(item)}
          style={styles.item}
        >
            <View style={styles.topPart}>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.itemHourText}>{item.time} ({item.durationHour ? item.durationHour+'h' : ''} {item.durationMinute ? item.durationMinute+'m' : ''})</Text>
                <Text style={styles.itemMartialArt}>{item.martialArt}</Text>
              </View>
              <View style={styles.itemButtonContainer}>
                        <Button
                                        secondary
                                        rounded
                                        small
                                        bgColor={ item.isAttending ? colors.primaryBackground : (item.isFull ? 'red' : colors.quaternaryBackground) }
                                        textColor={colors.primaryText}
                                        style={{ }}
                                        caption={ `${item.numberOfAttendees} ${translate('attending')}` }
                                        onPress={() => parent.buttonPressed(item)}
                                      />

              </View>
              </View>
          <View style={styles.middlePart}>
              <Text style={styles.itemTitleText} textBreakStrategy="simple">{item.name}</Text>
          </View>

          {!!(item.classLocation && item.classLocation.address) && (
              <View style={styles.bottomPart}>
                <Text style={styles.location}>{item.classLocation.address}</Text>
              </View>
          )}
        </TouchableOpacity>
      );
    }

    async attend(item, online = false) {
            this.setState({ loadingVisible: true});
            let data = {
                classId: item.entityId,
                startDate: item.startDate,
                endDate: item.endDate,
                online
            }

            await this.props.attend(data);
            this.setState({ attendDialogVisible: false, loadingVisible: false});
    }

    async unattend(data) {
            this.setState({ attendDialogVisible: true, loadingVisible: true});
            await this.props.unattend(data);
            this.setState({ attendDialogVisible: false, loadingVisible: false});
    }

    itemPressed(item) {
      this.state.navigation.navigate('Class', { id: item.entityId, academyId: item.academyId, startDate: item.startDate, endDate: item.endDate });
    }

  async componentDidMount() {
    setLocateConfig(LocaleConfig);

    this.setState({
        navigation: this.props.navigation
    })
  }

  render() {

let items = {};
    this.props.classes && this.props.classes.length && this.props.classes.forEach(classObj => {
        items[moment(classObj.schedule.startDate).format('YYYY-MM-DD')] = items[moment(classObj.schedule.startDate).format('YYYY-MM-DD')] || { title: moment(classObj.schedule.startDate).format('YYYY-MM-DD'), data: []};
        let startDate = moment(classObj.schedule.startDate);
        let endDate = moment(classObj.schedule.endDate);
        let duration = endDate.valueOf() && startDate.valueOf() ? endDate.valueOf() - startDate.valueOf() : 0;
        let timeDuration = moment.duration(duration);
        let isAttending = !!(this.props.loggedInUser && classObj.attendees && classObj.attendees.find(attendee => (attendee._id === this.props.loggedInUser._id)))

        let attendees = classObj.attendees.filter(attendee => !attendee.online) || [];
        let onlineAttendees = classObj.attendees.filter(attendee => !!attendee.online) || [];
        let isFull = attendees && attendees.length === classObj.classSize;
        let onlineIsFull = onlineAttendees && onlineAttendees.length === classObj.onlineClassSize;

        items[moment(classObj.schedule.startDate).format('YYYY-MM-DD')].data.push({
            name: classObj.name,
            description: classObj.description,
            time: moment(classObj.schedule.startDate).format('HH:mm'),
            durationHour: timeDuration.hours(),
            durationMinute: timeDuration.minutes(),
            date: classObj.schedule.startDate,
            type: 'class',
            entityId: classObj._id || classObj.parentId,
            academyId: classObj.academyId,
            startDate: classObj.schedule.startDate,
            endDate: classObj.schedule.endDate,
            classSize: classObj.classSize,
            classLocation: classObj.location,
            martialArt: classObj.martialArt,
            numberOfAttendees: classObj.attendees ? classObj.attendees.length : 0,
            isAttending,
            isFull: isFull,
            onlineIsFull: onlineIsFull,
            supportOnlineClasses: classObj.supportOnlineClasses
        })
    })

    let displayItems = Object.values(items).sort((a, b) => {
        return moment(a.title) - moment(b.title);
    });

    let markedDates = this.getMarkedDates(displayItems)

    return (
      <View style={{flex: 1}}>
      <CalendarProvider
        date={displayItems[0] && displayItems[0].title}
        disabledOpacity={0.6}
      >

    {!this.props.hideWeekView && (
          <WeekCalendar
            firstDay={1}
            markedDates={markedDates}
            theme={{
                calendarBackground: colors.terciaryBackground,
                backgroundColor: colors.terciaryBackground,
                textSectionTitleColor: colors.terciaryText,
                textSectionTitleDisabledColor: colors.quaternaryText,
                selectedDayBackgroundColor: colors.primaryBackground,
                selectedDayTextColor: colors.primaryText,
                todayTextColor: colors.secondaryText,
                dayTextColor: colors.quaternaryText,
                dotColor: colors.secondaryText,
                selectedDotColor: colors.primaryText,
                textDayFontWeight: '300',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16
          }}
          />
      )}

        <AgendaList
          sections={displayItems}
          renderItem={(data) => this.renderItem(data, this)}
          theme={{
            calendarBackground: colors.secondaryBackground,
            textSectionTitleColor: 'blue',
            textSectionTitleDisabledColor: 'blue',
          }}
          onRefresh={() => (this.props.refreshing && this.props.onRefresh())}
          refreshing={this.props.refreshing}
        />
      </CalendarProvider>

                        <Modal isVisible={this.state.attendDialogVisible} onBackdropPress={() => this.setState({ attendDialogVisible: false })}>
                            <View style={{flex: 1}}>
                            {!this.state.loadingVisible && this.state.attendDialogVisible && (
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                  {!this.state.currentItem.isFull && (
                                      <Button
                                        secondary
                                        rounded
                                        small
                                        bgColor={ colors.primaryBackground }
                                        textColor={ colors.primaryText }
                                        style={ styles.editDetailsButton }
                                        caption={ translate('online') }
                                        onPress={() => this.attend(this.state.currentItem, true)}
                                      />
                                  )}

                                  {!this.state.currentItem.onlineIsFull && (
                                      <Button
                                        secondary
                                        rounded
                                        small
                                        bgColor={ colors.primaryBackground }
                                        textColor={ colors.primaryText }
                                        style={ styles.editDetailsButton }
                                        caption={ translate('inPerson') }
                                        onPress={() => this.attend(this.state.currentItem, false)}
                                      />
                                  )}
                              </View>
                            )}

                            {this.state.loadingVisible && this.state.attendDialogVisible && (
                            <View style={{flex: 1, alignItems: 'center', marginTop: 200}}>
                                <Text style={{color: colors.primaryText, fontSize: 20}}>{translate('pleaseWait')}</Text>
                            </View>
                            )}
                          </View>
                        </Modal>
      </View>
    );

  }
}

export default ScheduleElement;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  section: {
    color: 'grey',
    textTransform: 'capitalize'
  },
  item: {
    padding: 10,
    backgroundColor: colors.terciaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flex: 1,
    minHeight: 50,
    paddingLeft: 20
  },
  topPart: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 10
  },
  middlePart: {
    flexDirection: 'row',
    flex: 1,
  },
  bottomPart: {
    flexDirection: 'column',
    flex: 1,
    paddingTop: 10
  },
  itemHourText: {
    color: colors.terciaryText
  },
  itemDurationText: {
    color: colors.quaternaryText,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  dateTimeSection: {
    width: 40
  },
  titleContainer: {
  },
  itemTitleText: {
    color: colors.terciaryText,
    fontWeight: 'bold',
    fontSize: 16,
    width: '100%'
  },
  itemMartialArt: {
    color: colors.quaternaryText,
    fontWeight: 'bold'
  },
  location: {
    fontSize: 12,
    color: colors.quaternaryText,
    fontWeight: 'bold'
  },
  itemButtonContainer: {
    width: 135,
    paddingRight: 10,
    alignItems: 'stretch'
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14
  },
  modalText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center'
  },
  editDetailsButton: {
      width: 300,
      alignSelf: 'center',
      marginTop: 20
    },
});