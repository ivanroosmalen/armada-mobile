import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button, Alert } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar, Agenda, LocaleConfig } from 'react-native-calendars';

import { colors, fonts } from '../../styles';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import { translate, setLocateConfig } from '../../translations/index.js';

  function renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  function getMarkedDates(items) {
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

   function renderItem({item}) {
      if (!item) {
        return renderEmptyItem();
      }

      return (
        <TouchableOpacity
          onPress={() => itemPressed(item)}
          style={styles.item}
        >
          <View>
            <Text style={styles.itemHourText}>{item.time}</Text>
            <Text style={styles.itemDurationText}>{item.durationHour ? item.durationHour+'h' : ''} {item.durationMinute ? item.durationMinute+'m' : ''}</Text>
          </View>
          <Text style={styles.itemTitleText}>{item.description}</Text>
          <View style={styles.itemButtonContainer}>
            <Button color={item.isAttending ? colors.primaryBackground : (item.isFull ? 'red' : colors.quaternaryBackground)} title={`${item.numberOfAttendees} ${translate('attending')}`} onPress={() => buttonPressed(item)}/>
          </View>
        </TouchableOpacity>
      );
    }

export default function ScheduleElement(props) {
    setLocateConfig(LocaleConfig);

    const navigation = useNavigation();

    buttonPressed = (item) => {
        if(!props.loggedInUser) {
            return;
        }
        if(item.isAttending) {
            let data = {
              classId: item.entityId
            }

            props.unattend(data);
        } else {
            if(item.isFull) {
                Toast.showWithGravity(translate('classFull'), Toast.LONG, Toast.TOP);
                return;
            }

            let data = {
                classId: item.entityId,
                startDate: item.startDate,
                endDate: item.endDate
            }

            props.attend(data);
        }
    }

    itemPressed = (item) => {
      navigation.navigate('Class', { id: item.entityId, academyId: item.academyId, startDate: item.startDate, endDate: item.endDate })
    }

    let items = {};
    props.classes && props.classes.forEach(classObj => {
        items[moment(classObj.schedule.startDate).format('YYYY-MM-DD')] = items[moment(classObj.schedule.startDate).format('YYYY-MM-DD')] || { title: moment(classObj.schedule.startDate).format('YYYY-MM-DD'), data: []};
        let startDate = moment(classObj.schedule.startDate);
        let endDate = moment(classObj.schedule.endDate);
        let duration = endDate.valueOf() && startDate.valueOf() ? endDate.valueOf() - startDate.valueOf() : 0;
        let timeDuration = moment.duration(duration);
        let isAttending = !!(props.loggedInUser && classObj.attendees && classObj.attendees.find(attendee => (attendee._id === props.loggedInUser._id)))
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
            numberOfAttendees: classObj.attendees ? classObj.attendees.length : 0,
            isAttending,
            isFull: classObj.classSize && classObj.attendees && classObj.classSize === classObj.attendees.length
        })
    })

    let displayItems = Object.values(items).sort((a, b) => {
        return moment(a.title) - moment(b.title);
    });

    let markedDates = getMarkedDates(displayItems)

    return (
      <View style={{flex: 1}}>

      <CalendarProvider
        date={displayItems[0] && displayItems[0].title}
        disabledOpacity={0.6}
      >

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

        <AgendaList
          sections={displayItems}
          renderItem={renderItem}
          theme={{
            calendarBackground: colors.secondaryBackground,
            textSectionTitleColor: 'blue',
            textSectionTitleDisabledColor: 'blue',
          }}
          onRefresh={() => props.onRefresh()}
          refreshing={props.refreshing}
        />
      </CalendarProvider>

      </View>
    );

}

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
    padding: 20,
    backgroundColor: colors.terciaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row'
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
  itemTitleText: {
    color: colors.terciaryText,
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end'
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
  }
});