import React from 'react';
import { StyleSheet,
           View,
           Text,
           Animated,
           Keyboard,
           Platform,
           LayoutAnimation,
           TouchableOpacity,
           ImageBackground,
           Image,
           TouchableHighlight,
           ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import { fonts, colors } from '../../styles';
import { TextInput, Button, Dropdown, KeyboardInputWrapper } from '../../components';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CheckBox from 'react-native-check-box'
import { translate } from '../../translations/index.js';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ClassEditScreen extends React.Component {

    state = {
        anim: new Animated.Value(0),

        // Current visible form
        isKeyboardVisible: false,
        errors: {
        },
        isValid: false,
        editingClass: { instructors: [], schedule: {} },
        isStartDatePickerVisible: false,
        isEndDatePickerVisible: false,
        intervals: [{
                value: 'daily',
                display: translate('daily')
            },
            {
                value: 'weekly',
                display: translate('weekly')
            },
            {
                value: 'semiMonthly',
                display: translate('semiMonthly')
            },
            {
                value: 'monthly',
                display: translate('monthly')
            },
            {
                value: 'yearly',
                display: translate('yearly')
            }],
            spinner: false
      };

        onChangeText = async (key, val) => {
          this.state.editingClass[key] = val;

          this.setState({
              editingClass: this.state.editingClass
          })
        }

        onMartialArtSelected = (index) => {
          this.state.editingClass.martialArt = this.props.academy[this.props.route.params.academyId].martialArts[index].name;

          this.setState({
              editingClass: this.state.editingClass
          })
        }

        onLocationSelected = (index) => {
          if(!this.props.academy[this.props.route.params.academyId].locations) {
                return;
          }

          let location = (index === this.props.academy[this.props.route.params.academyId].locations.length) ? {} : this.props.academy[this.props.route.params.academyId].locations[index];
          this.state.editingClass.location = location || {};

          this.setState({
              editingClass: this.state.editingClass
          })

        }

        onInstructorSelected = (index) => {
          let academyMember = this.props.academyMembers[this.props.route.params.academyId][index];
          let instructor = {};
          Object.assign(instructor, academyMember.member);
          instructor.academyMember = academyMember;
          this.state.editingClass.instructors.length = 0;
          this.state.editingClass.instructors.push(instructor);

          this.setState({
              editingClass: this.state.editingClass
          })
        }

        onIntervalSelected = (index) => {
          let interval = this.state.intervals[index];

          this.state.editingClass.schedule.interval = interval.value;

          this.setState({
              editingClass: this.state.editingClass
          })
        }

        onConfirmStartDatePicker = (date) => {
            this.state.editingClass.schedule.startDate = date;

            this.setState({
              editingClass: this.state.editingClass,
              isStartDatePickerVisible: false
            })
        }

        onConfirmEndDatePicker = (date) => {
            this.state.editingClass.schedule.endDate = date;

            this.setState({
              editingClass: this.state.editingClass,
              isEndDatePickerVisible: false
            })
        }

        onCheckboxUpdate = () => {
            this.state.editingClass.schedule.recurring = !this.state.editingClass.schedule.recurring;
            this.setState({
                editingClass: this.state.editingClass
            })
        }

        onOnlineCheckboxUpdate = () => {
            this.state.editingClass.supportOnlineClasses = !this.state.editingClass.supportOnlineClasses;

            this.setState({
                editingClass: this.state.editingClass
            })
        }

        validate = () => {
            this.state.isValid = true;

            this.setState({
                errors: this.state.errors
            })

            return this.state.isValid;
        }

      submit = async () => {
            if(this.validate()) {
                this.setState({spinner: true});
                let entity;
                let isCreating = !(this.props.class && this.props.class[this.props.route.params.id] && this.props.class[this.props.route.params.id]._id);
                if(this.state.editingClass._id) {
                    entity = await this.props.updateClass(this.state.editingClass._id, this.state.editingClass);
                } else {
                    entity = await this.props.createClass(this.state.editingClass);
                }

                if(isCreating) {
                    this.props.navigation.pop(1);
                } else {
                    this.props.navigation.pop(2);
                }

                this.props.navigation.navigate('Class', { id: entity._id, academyId: entity.academyId, startDate: entity.schedule.startDate, endDate: entity.schedule.endDate })

                this.setState({spinner: true});
            }
      }

      async getData() {
        this.props.clearClass(this.props.route.params.id);

        let dataRequests = [
            this.props.getAcademy(this.props.route.params.academyId),
            this.props.getAcademyMembers(this.props.route.params.academyId, { academyId: this.props.route.params.academyId })
        ];

        if(this.props.route.params && this.props.route.params.id) {
            dataRequests.push(this.props.getClass(this.props.route.params.id))
        }

        return Promise.all(dataRequests);
      }

      async prepareData() {
        await this.getData();

        let academy = this.props.academy && this.props.academy[this.props.route.params.academyId] ? this.props.academy[this.props.route.params.academyId] : {};
        let academyMember = this.props.academyMembers && this.props.academyMembers[this.props.route.params.academyId] && this.props.academyMembers[this.props.route.params.academyId][0];
        let instructor = {};
        Object.assign(instructor, academyMember.member);
        instructor.academyMember = academyMember;

        let defaults = {
          instructors: instructor ? [instructor] : [],
          schedule: {
              startDate: new Date(),
              endDate: new Date(),
              interval: this.state.intervals[1].value
          },
          martialArt: academy.martialArts && academy.martialArts.length && academy.martialArts[0].name,
          location: (academy.locations && academy.locations.length && academy.locations[0]) || {}
        }
        let editingClass = this.props.class[this.props.route.params.id] || defaults;
        editingClass.academyId = academy._id;

        if(this.props.route.params.singleItem) {
            editingClass.parentId = editingClass._id;
            editingClass._id = undefined;
            editingClass.schedule.recurring = false;

            if(this.props.route.params.startDate && this.props.route.params.endDate) {
                editingClass.schedule.startDate = moment(this.props.route.params.startDate).toDate();
                editingClass.schedule.endDate = moment(this.props.route.params.endDate).toDate();
                editingClass.excludeDate = moment(this.props.route.params.startDate).toDate();
            }
        }

        this.setState({
            editingClass,
            defaults
        });

        this.keyboardDidShowListener = Keyboard.addListener(
          Platform.select({ android: 'keyboardDidShow', ios: 'keyboardWillShow' }),
          this._keyboardDidShow.bind(this)
        );
        this.keyboardDidHideListener = Keyboard.addListener(
          Platform.select({ android: 'keyboardDidHide', ios: 'keyboardWillHide' }),
          this._keyboardDidHide.bind(this),
        );

        Animated.timing(this.state.anim, { toValue: 3000, duration: 3000 }).start();
      }

      async componentDidMount() {
        await this.prepareData();

        this.props.navigation.addListener('willFocus', async () => {
            await this.prepareData();
        });
      }

      componentWillUnmount() {
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
        this.props.navigation.removeListener('willFocus')
      }

      _keyboardDidShow() {
        LayoutAnimation.easeInEaseOut();
        this.setState({ isKeyboardVisible: true });
      }

      _keyboardDidHide() {
        LayoutAnimation.easeInEaseOut();
        this.setState({ isKeyboardVisible: false });
      }

      fadeIn(delay, from = 0) {
        const { anim } = this.state;
        return {
          opacity: anim.interpolate({
            inputRange: [delay, Math.min(delay + 500, 3000)],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [delay, Math.min(delay + 500, 3000)],
                outputRange: [from, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        };
      }

  render() {
      const { editingClass } = this.state;
      let academy = this.props.academy && this.props.academy[this.props.route.params.academyId] ? this.props.academy[this.props.route.params.academyId] : {}
      let academyMembers = this.props.academyMembers && this.props.academyMembers[this.props.route.params.academyId] || [];
      let martialArts = [];
      let martialArtIndex = -1;
      let locations = [];
      let locationIndex = -1;
      let instructors = academyMembers.map(member => member.member.alias);
      let instructorIndex = -1;
      let intervalIndex = -1;
      academy.martialArts && academy.martialArts.forEach((ma, index) => {
        martialArts.push(ma.name);

        if(editingClass.martialArt && ma.name === editingClass.martialArt) {
            martialArtIndex = index;
        }
      });

      academy.locations && academy.locations.forEach((loc, index) => {
        locations.push(loc.address);
        if(editingClass.location && (loc.address === editingClass.location.address)) {
            locationIndex = index;
        }
      });

      locations.push(translate('noLocation'));

      instructors.forEach((inst, index) => {
        if(editingClass.instructors && editingClass.instructors.length && editingClass.instructors[0].academyMember.member && inst === editingClass.instructors[0].academyMember.member.alias) {
            instructorIndex = index;
        }
      });

      if(editingClass.schedule.interval) {
            intervalIndex = 0;
            this.state.intervals.forEach((interval, i) => {
                if(interval.value === editingClass.schedule.interval) {
                    intervalIndex = i;
                }
            });
      }

      let classSize = (this.state.editingClass.classSize !== null && this.state.editingClass.classSize !== undefined) ? this.state.editingClass.classSize.toString() : '';
      let onlineClassSize = (this.state.editingClass.onlineClassSize !== null && this.state.editingClass.onlineClassSize !== undefined) ? this.state.editingClass.onlineClassSize.toString() : '';

      return (
        <View
                style={styles.background}
              >
            <Spinner
              visible={this.state.spinner}
              textContent={translate('loading')}
              textStyle={{color: colors.quaternaryText}}
            />
            <KeyboardInputWrapper>
                <ScrollView style={styles.container}>

                  <Animated.View
                    style={[styles.section, styles.middle, this.fadeIn(700, -20)]}
                  >
                    {!!(this.props.route.params && this.props.route.params.id) && (
                        <Text style={styles.headerTitle}>{translate('updateClass')}</Text>
                    )}
                    {!(this.props.route.params && this.props.route.params.id) && (
                        <Text style={styles.headerTitle}>{translate('createClass')}</Text>
                    )}

                    <TextInput
                      placeholder={ translate('name') }
                      style={styles.textInput}
                      value={this.state.editingClass.name}
                      onChangeText={val => this.onChangeText('name', val)}
                    />

                    <TextInput
                      placeholder={ translate('description') }
                      style={styles.textAreaInput}
                      value={this.state.editingClass.description}
                      onChangeText={val => this.onChangeText('description', val)}
                      multiline
                      numberOfLines={6}
                    />

                    <TextInput
                      placeholder={ translate('classSize') }
                      style={styles.textInput}
                      value={classSize}
                      onChangeText={val => this.onChangeText('classSize', val)}
                      keyboardType={'numeric'}
                    />

                    <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 10}}>
                        <CheckBox
                            onClick={this.onOnlineCheckboxUpdate}
                            isChecked={!!this.state.editingClass.supportOnlineClasses}
                            checkBoxColor={colors.primaryText}
                        />

                        <Text style={{color: colors.primaryText }}> { translate('supportOnline') } </Text>
                    </View>

                    {!!this.state.editingClass.supportOnlineClasses && (
                    <TextInput
                      placeholder={ translate('onlineClassSize') }
                      style={[styles.textInput, {marginTop: 0}]}
                      value={onlineClassSize}
                      onChangeText={val => this.onChangeText('onlineClassSize', val)}
                      keyboardType={'numeric'}
                    />
                    )}

                    <View style={{alignSelf: 'stretch'}}>
                        <Dropdown
                            color={colors.primaryText}
                            style={ styles.dropdown }
                            items={martialArts}
                            selectedIndex={martialArtIndex}
                            placeholder={ translate('selectMartialArt') }
                            onSelect={(index) => { this.onMartialArtSelected(index) }}
                        />

                        <Dropdown
                            color={colors.primaryText}
                            style={styles.dropdown}
                            items={locations}
                            selectedIndex={locationIndex === -1 ? locations.length - 1 : locationIndex}
                            placeholder={ translate('selectLocation') }
                            onSelect={(index) => { this.onLocationSelected(index) }}
                        />

                        <Dropdown
                            color={colors.primaryText}
                            style={ styles.dropdown }
                            items={instructors}
                            selectedIndex={instructorIndex}
                            placeholder={ translate('selectInstructor') }
                            onSelect={(index) => { this.onInstructorSelected(index) }}
                        />
                    </View>

                        <DateTimePickerModal
                          isVisible={this.state.isStartDatePickerVisible}
                          mode="datetime"
                          date={this.state.editingClass.schedule.startDate ? new Date(this.state.editingClass.schedule.startDate) : new Date()}
                          onConfirm={this.onConfirmStartDatePicker}
                          onCancel={() => (this.setState({ isStartDatePickerVisible: false }))}
                        />

                    <View style={ styles.datepickerField }>

                        <Text style={styles.dateText}>
                           { moment(this.state.editingClass.schedule.startDate || new Date()).format('DD MMM, YYYY HH:mm') }
                        </Text>
                        <Icon
                          name="calendar"
                          style={styles.calendarIcon}
                          onPress={() => (this.setState({ isStartDatePickerVisible: true }))}
                        />
                    </View>

                        <DateTimePickerModal
                          isVisible={this.state.isEndDatePickerVisible}
                          mode="datetime"
                          date={this.state.editingClass.schedule.endDate ? new Date(this.state.editingClass.schedule.endDate) : new Date()}
                          onConfirm={this.onConfirmEndDatePicker}
                          onCancel={() => (this.setState({ isEndDatePickerVisible: false }))}
                        />

                    <View style={ styles.datepickerField }>

                        <Text style={styles.dateText}>
                            { moment(this.state.editingClass.schedule.endDate || new Date()).format('DD MMM, YYYY HH:mm') }
                        </Text>
                        <Icon
                          name="calendar"
                          style={styles.calendarIcon}
                          onPress={() => (this.setState({ isEndDatePickerVisible: true }))}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 10}}>
                        <CheckBox
                            onClick={this.onCheckboxUpdate}
                            isChecked={!!this.state.editingClass.schedule.recurring}
                            checkBoxColor={colors.primaryText}
                        />

                        <Text style={{color: colors.primaryText }}> { translate('recurring') } </Text>
                    </View>

                    {!!this.state.editingClass.schedule.recurring && (
                        <View  style={{alignSelf: 'stretch'}}>
                            <Dropdown
                                color={colors.primaryText}
                                style={ styles.dropdown }
                                items={this.state.intervals.map(interval => interval.display)}
                                selectedIndex={intervalIndex}
                                placeholder={ translate('selectInterval') }
                                onSelect={this.onIntervalSelected}
                            />
                        </View>
                    )}

                        <Animated.View
                          style={[styles.section, styles.bottom, this.fadeIn(700, -20)]}
                        >
                          <Text style={{ fontSize: 12, color: 'red'}}>
                                {this.state.errors.pageError}
                          </Text>

                        </Animated.View>

                  </Animated.View>
                </ScrollView>
                </KeyboardInputWrapper>
                        <Button
                            bgColor={colors.secondaryBackground}
                            textColor={colors.secondaryText}
                            secondary
                            rounded
                            style={{
                             position: 'absolute',
                             bottom: 30,
                             right: 30,
                             zIndex: 100
                             }}
                            caption={ translate('save') }
                            onPress={this.submit}
                          />

              </View>
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
  background: {
    flex: 1,
    backgroundColor: colors.primaryBackground
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 2,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
  },
  bottom: {
    flex: 1,
    alignSelf: 'stretch',
    paddingBottom: Platform.OS === 'android' ? 30 : 0,
  },
  last: {
    justifyContent: 'flex-end',
  },
  textAreaInput: {
    alignSelf: 'stretch',
    height:100
  },
  textInput: {
    alignSelf: 'stretch',
    marginTop: 30,
    color: colors.primaryText,
    borderColor: colors.primaryText
  },
  headerTitle: {
      fontSize: 25,
      color: colors.primaryText,
      textAlign: 'left',
      marginTop: 10
  },
  datepickerField: {
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginTop: 15,
  },
  dateText: {
    width: 200,
    fontSize: 15,
    color: colors.primaryText,
    fontFamily: fonts.primaryRegular
  },
  calendarIcon: {
    fontSize: 30,
    color: colors.primaryText
  },
  dropdown: {
      backgroundColor: colors.primaryBackground,
      marginTop: 10
  }
});
