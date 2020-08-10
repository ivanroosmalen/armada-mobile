import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button, Alert } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar, Agenda } from 'react-native-calendars';

import { colors, fonts } from '../../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

class ScheduleScreen extends React.Component {

  async componentDidMount() {
    await this.props.list(this.props.route.params.id);
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  onDateChanged = (/* date, updateSource */) => {
      // console.warn('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
      // fetch and set data for date + week ahead
    }

    onMonthChange = (/* month, updateSource */) => {
      // console.warn('ExpandableCalendarScreen onMonthChange: ', month, updateSource);
    }

    buttonPressed() {
//      Alert.alert('show more');
    }

    itemPressed(item) {
      this.props.navigation.navigate('Class', { id: item.entityId, academyId: item.academyId, classId: item.id, startDate: item.startDate, endDate: item.endDate })
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

   renderItem = ({item}) => {
      if (!item) {
        return this.renderEmptyItem();
      }

      return (
        <TouchableOpacity
          onPress={() => this.itemPressed(item)}
          style={styles.item}
        >
          <View>
            <Text style={styles.itemHourText}>{item.time}</Text>
            <Text style={styles.itemDurationText}>{item.durationHour ? item.durationHour+'h' : ''} {item.durationMinute ? item.durationMinute+'m' : ''}</Text>
          </View>
          <Text style={styles.itemTitleText}>{item.description}</Text>
          <View style={styles.itemButtonContainer}>
            <Button color={'grey'} title={item.type} onPress={this.buttonPressed}/>
          </View>
        </TouchableOpacity>
      );
    }

  render() {
    let items = {};
    this.props.classes && this.props.classes.forEach(classObj => {
        items[moment(classObj.schedule.startDate).format('YYYY-MM-DD')] = items[moment(classObj.schedule.startDate).format('YYYY-MM-DD')] || { title: moment(classObj.schedule.startDate).format('YYYY-MM-DD'), data: []};
        let startDate = moment(classObj.schedule.startDate);
        let endDate = moment(classObj.schedule.endDate);
        let duration = endDate.valueOf() && startDate.valueOf() ? endDate.valueOf() - startDate.valueOf() : 0;
        let timeDuration = moment.duration(duration);
        items[moment(classObj.schedule.startDate).format('YYYY-MM-DD')].data.push({
            name: classObj.name,
            description: classObj.description,
            time: moment(classObj.schedule.startDate).format('HH:mm'),
            durationHour: timeDuration.hours(),
            durationMinute: timeDuration.minutes(),
            date: classObj.schedule.startDate,
            type: 'class',
            entityId: classObj._id,
            academyId: classObj.academyId,
            startDate: classObj.schedule.startDate,
            endDate: classObj.schedule.endDate
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
        onDateChanged={this.onDateChanged}
        onMonthChange={this.onMonthChange}
        showTodayButton
        disabledOpacity={0.6}
        // theme={{
        //   todayButtonTextColor: themeColor
        // }}
        // todayBottomMargin={16}
      >
        {this.props.weekView ?
          <WeekCalendar
            firstDay={1}
            markedDates={markedDates}
          /> :
          <ExpandableCalendar
            // horizontal={false}
            // hideArrows
            // disablePan
            // hideKnob
            // initialPosition={ExpandableCalendar.positions.OPEN}
            // calendarStyle={styles.calendar}
            // headerStyle={styles.calendar} // for horizontal only
            // disableWeekScroll
            // theme={this.getTheme()}
            disableAllTouchEventsForDisabledDays
            firstDay={1}
            markedDates={markedDates} // {'2019-06-01': {marked: true}, '2019-06-02': {marked: true}, '2019-06-03': {marked: true}};
          />
        }
        <AgendaList
          sections={displayItems}
          renderItem={this.renderItem}
          // sectionStyle={styles.section}
        />
      </CalendarProvider>

          <Icon
              name="plus-circle"
              style={styles.addIcon}
              onPress={() => this.props.navigation.navigate('ClassEdit', { academyId: this.props.route.params.id })}
            />

      </View>
    );
  }
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row'
  },
  itemHourText: {
    color: 'black'
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  itemTitleText: {
    color: 'black',
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
  addIcon: {
        fontSize: 35,
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: 'white',
        borderRadius: 20
      },
});

export default ScheduleScreen;
