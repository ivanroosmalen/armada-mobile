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

import isEmail from 'validator/lib/isEmail';

export default class ClassEditScreen extends React.Component {

    state = {
        anim: new Animated.Value(0),

        // Current visible form
        isKeyboardVisible: false,
        errors: {
        },
        isValid: false,
        editingClass: { instructors: [], schedule: {} },
        martialArtIndex: 0,
        locationIndex: 0,
        instructorIndex: 0,
        intervalIndex: 1,
        isStartDatePickerVisible: false,
        isEndDatePickerVisible: false,
        intervals: ['daily', 'weekly', 'monthly', 'yearly'],
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
              editingClass: this.state.editingClass,
              martialArtIndex: index
          })
        }

        onLocationSelected = (index) => {
          this.state.editingClass.location = this.props.academy.locations[index];

          this.setState({
              editingClass: this.state.editingClass,
              locationIndex: index
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
              editingClass: this.state.editingClass,
              instructorIndex: index
          })
        }

        onIntervalSelected = (index) => {
          let interval = this.state.intervals[index];

          this.state.editingClass.schedule.interval = interval;

          this.setState({
              editingClass: this.state.editingClass,
              intervalIndex: index
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
                let classId = '';
                if(this.props.route.params && this.props.route.params.id) {
                    await this.props.updateClass(this.props.class._id, this.state.editingClass);
                    classId = this.props.class._id
                } else {
                    let entity = await this.props.createClass(this.state.editingClass);
                    classId = entity._id
                }

                this.props.navigation.goBack();
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
              interval: this.state.intervals[0]
          },
          martialArt: this.props.academy.martialArts && this.props.academy.martialArts.length && this.props.academy.martialArts[0].name,
          location: this.props.academy.locations && this.props.academy.locations.length && this.props.academy.locations[0],
          academyId: this.props.academy._id
        }
        let editingClass = this.props.class || defaults;

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

        if(editingClass.instructor && inst.alias === editingClass.instructor.alias) {
            instructorIndex = index;
        }
      });

      return (

        <ImageBackground
                source={require('../../../assets/images/background.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
              >
                <View style={styles.container}>

                  <Animated.View
                    style={[styles.section, styles.middle, this.fadeIn(700, -20)]}
                  >

                    <TextInput
                      placeholder="Name"
                      style={styles.textInput}
                      value={this.state.editingClass.name}
                      onChangeText={val => this.onChangeText('name', val)}
                    />

                    <TextInput
                      placeholder="Description"
                      style={styles.textAreaInput}
                      value={this.state.editingClass.description}
                      onChangeText={val => this.onChangeText('description', val)}
                      multiline
                      numberOfLines={6}
                    />

                    <View style={{alignSelf: 'stretch'}}>
                        <Dropdown
                            style={{ backgroundColor: colors.white }}
                            items={martialArts}
                            selectedIndex={this.state.martialArtIndex}
                            placeholder={'select a martial art'}
                            onSelect={(index) => { this.onMartialArtSelected(index) }}
                        />

                        <Dropdown
                            style={{ backgroundColor: colors.white }}
                            items={locations}
                            selectedIndex={this.state.locationIndex}
                            placeholder={'select a location'}
                            onSelect={(index) => { this.onLocationSelected(index) }}
                        />

                        <Dropdown
                            style={{ backgroundColor: colors.white }}
                            items={instructors}
                            selectedIndex={this.state.instructorIndex}
                            placeholder={'select an instructor'}
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

                    <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                        <CheckBox
                            onClick={this.onCheckboxUpdate}
                            isChecked={!!this.state.editingClass.schedule.recurring}
                        />

                        <Text style={{color: 'black'}}> Recurring </Text>
                    </View>

                    {!!this.state.editingClass.schedule.recurring && (
                        <View  style={{alignSelf: 'stretch'}}>
                            <Dropdown
                                style={{ backgroundColor: colors.white }}
                                items={this.state.intervals}
                                selectedIndex={this.state.intervalIndex}
                                placeholder={'select an interval'}
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

                      <Button
                            bgColor="white"
                            textColor={colors.primary}
                            secondary
                            rounded
                            style={{
                             position: 'absolute',
                             bottom: 10,
                             right: 10,
                             }}
                            caption={ 'Save' }
                            onPress={this.submit}
                          />
                  </Animated.View>
                </View>
              </ImageBackground>
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
  backgroundImage: {
    flex: 1,
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
    height:150
  },
  textInput: {
    alignSelf: 'stretch',
    marginTop: 30
  },
  headerTitle: {
      fontWeight: "bold",
      fontSize: 25,
      color: "white"
  },
  mapElement: {
        alignSelf: 'stretch',
        width: '100%'
  },
  mapTextInput: {
  },
  locations: {
      width: '100%',
      marginTop: 50,
      zIndex: 1,
      elevation: 1,
  },
  datepickerField: {
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  dateText: {
    width: 200,
    fontSize: 17
  },
  calendarIcon: {
    fontSize: 35
  }
});
