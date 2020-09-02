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
           TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import { fonts, colors } from '../../styles';
import { TextInput, Button, Dropdown } from '../../components';
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
          this.state.editingClass.martialArt = this.props.academy.martialArts[index].name;

          this.setState({
              editingClass: this.state.editingClass
          })
        }

        onLocationSelected = (index) => {
          this.state.editingClass.location = this.props.academy.locations[index];

          this.setState({
              editingClass: this.state.editingClass
          })
        }

        onInstructorSelected = (index) => {
          let instructor = this.props.academy.instructors[index];
          let inst = {
            _id: instructor._id,
            alias: instructor.alias,
            firstName: instructor.firstName,
            lastName: instructor.lastName,
            thumbnailImg: instructor.thumbnailImg
          };
          this.state.editingClass.instructors.length = 0;
          this.state.editingClass.instructors.push(inst);

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
                let isCreating = !(this.props.class && this.props.class._id);

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
        this.props.clearClass();

        let dataRequests = [
            this.props.getAcademy(this.props.route.params.academyId)
        ];

        if(this.props.route.params && this.props.route.params.id) {
            dataRequests.push(this.props.getClass(this.props.route.params.id))
        }

        return Promise.all(dataRequests);
      }

      async prepareData() {
        await this.getData();

        let instructor = this.props.academy.instructors[0];
        let instructors = [];
        if(instructor) {
            instructors = [{
              _id: instructor._id,
              alias: instructor.alias,
              firstName: instructor.firstName,
              lastName: instructor.lastName,
              thumbnailImg: instructor.thumbnailImg
            }]
        }

        let defaults = {
          instructors: instructors,
          schedule: {
              startDate: new Date(),
              endDate: new Date(),
              interval: this.state.intervals[1].value
          },
          martialArt: this.props.academy.martialArts && this.props.academy.martialArts.length && this.props.academy.martialArts[0].name,
          location: this.props.academy.locations && this.props.academy.locations.length && this.props.academy.locations[0]
        }
        let editingClass = this.props.class || defaults;
        editingClass.academyId = this.props.academy._id;

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
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
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
      let martialArts = [];
      let martialArtIndex = -1;
      let locations = [];
      let locationIndex = -1;
      let instructors = [];
      let instructorIndex = -1;
      let intervalIndex = -1;
      this.props.academy && this.props.academy.martialArts && this.props.academy.martialArts.forEach((ma, index) => {
        martialArts.push(ma.name);

        if(editingClass.martialArt && ma.name === editingClass.martialArt) {
            martialArtIndex = index;
        }
      });

      this.props.academy && this.props.academy.locations && this.props.academy.locations.forEach((loc, index) => {
        locations.push(loc.address);
        if(editingClass.location && loc.address === editingClass.location.address) {
            locationIndex = index;
        }
      });

      this.props.academy && this.props.academy.instructors && this.props.academy.instructors.forEach((inst, index) => {
        instructors.push(inst.alias);

        if(editingClass.instructors && editingClass.instructors.length && inst.alias === editingClass.instructors[0].alias) {
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

      return (

        <View
                style={styles.background}
              >
            <Spinner
              visible={this.state.spinner}
              textContent={translate('loading')}
              textStyle={{color: colors.quaternaryText}}
            />
                <View style={styles.container}>

                  <Animated.View
                    style={[styles.section, styles.middle, this.fadeIn(700, -20)]}
                  >

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
                            selectedIndex={locationIndex}
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
                </View>

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
    alignItems: 'center',
    justifyContent: 'space-around',
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
      fontWeight: "bold",
      fontSize: 25,
      color: "white"
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
