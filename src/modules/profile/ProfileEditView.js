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
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';
import { RadioGroup, Dropdown } from '../../components';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts, colors } from '../../styles';
import { TextInput, Button } from '../../components';

import isEmail from 'validator/lib/isEmail';

export default class ProfileEditScreen extends React.Component {

    state = {
        anim: new Animated.Value(0),

        // Current visible form
        isKeyboardVisible: false,
        errors: {
           aliasError: ''
        },
        isValid: false,
        selectedIndex: -1,
        selectedMAIndex: 0,
        selectedMAs: [],
        selectedMANames: [],
        martialArtList: [],
        datePickerVisible: false,
        datePickerValue: moment(),
        editingUser: {}
      };

      showDatePicker = () => {
            this.setState({ datePickerVisible: true })
        };

        hideDatePicker = () => {
          this.setState({ datePickerVisible: false })
        };

        handleDateSelected = (event, date) => {
            if(date) {
                this.state.editingUser.martialArts[this.state.selectedMAIndex].startDate = moment(date, "MM-YYYY");

                this.setState({
                    editingUser: this.state.editingUser,
                    datePickerValue: moment(date, "MM-YYYY"),
                    datePickerVisible: false
                })
            } else {
                this.hideDatePicker();
            }
          };

        setMartialArt(index) {
            this.setState({
                selectedMAIndex: index,
                datePickerValue: this.state.editingUser.martialArts[index].startDate ? moment(this.state.editingUser.martialArts[index].startDate) : moment()
            })
        }

        onChangeText = async (key, val) => {
          this.state.editingUser[key] = val;

          this.setState({
              editingUser: this.state.editingUser
          })
        }

        onChangeLevel = async (val) => {
          this.state.editingUser.martialArts[this.state.selectedMAIndex].level = val;

           this.setState({
               editingUser: this.state.editingUser
           })
        }

        validate = () => {
            this.state.isValid = true;

            if(!this.state.editingUser.alias) {
                this.state.errors.aliasError = 'You must provide a valid alias';
                this.state.isValid = false;
            } else {
                this.state.errors.aliasError = '';
            }

            this.setState({
                errors: this.state.errors
            })

            return this.state.isValid;
        }

      submit = async () => {
            if(this.validate()) {
                await this.props.updateUser(this.props.loggedInUser._id, this.state.editingUser);
                this.props.navigation.goBack();
            }
      }

      addNewMartialArt = async (index) => {
        if(this.state.editingUser.martialArts.find(ma => ma.name === this.state.martialArtList[index])) {
            return; //MA already exists for user
        }

         let martialArt = this.props.martialArts.find(ma => {
            return ma.name === this.state.martialArtList[index];
         })

         if(!martialArt) {
            return;
         }

          this.state.selectedMANames.push(this.state.martialArtList[index]);

          this.state.editingUser.martialArts.push(martialArt);
          await this.setState({
            editingUser: this.state.editingUser,
            selectedMANames: this.state.selectedMANames
          })

      }

    removeMartialArt = async (index) => {
          console.log(index)
          this.state.editingUser.martialArts.splice(index, 1);
          this.state.selectedMANames.splice(index, 1);
          console.log(this.state.selectedMANames)
          this.setState({
            editingUser: this.state.editingUser,
            selectedMANames: this.state.selectedMANames,
            selectedMAIndex: 0
          })

      }

      async getData() {
        return Promise.all([
            this.props.getMartialArts(),
            this.props.getUser(this.props.loggedInUser._id)
        ])
      }

      async componentDidMount() {
        await this.getData();

        let martialArtList = this.props.martialArts && this.props.martialArts.map(ma => ma.name).sort()
        let user = this.props.user || {};
        let martialArts = user.martialArts || [];
        let martialArtNames = martialArts.map(ma => ma.name)
        this.setState({
            selectedMANames: martialArtNames,
            martialArtList,
            editingUser: user
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
                      placeholder="Alias"
                      style={styles.textInput}
                      value={this.state.editingUser.alias}
                      onChangeText={val => this.onChangeText('alias', val)}
                    />

                    {!!this.state.errors.aliasError &&
                        <Text style={{ fontSize: 12, color: 'red'}}>
                            {this.state.errors.aliasError}
                        </Text>
                    }

                    <TextInput
                      placeholder="First Name"
                      style={styles.textInput}
                      value={this.state.editingUser.firstName}
                      onChangeText={val => this.onChangeText('firstName', val)}
                    />

                    <TextInput
                      placeholder="Last Name"
                      style={styles.textInput}
                      value={this.state.editingUser.lastName}
                      onChangeText={val => this.onChangeText('lastName', val)}
                    />


                        <View style={styles.maHeader}>
                          <Dropdown
                              style={{ width: 200, alignSelf: 'flex-start', backgroundColor: colors.white }}
                              items={this.state.martialArtList}
                              selectedIndex={this.state.selectedIndex}
                              placeholder={'select a martial art'}
                              onSelect={(index) => {this.setState({selectedIndex: index});}}
                          />

                        <MatComIcon
                          name="plus-circle"
                          style={{
                            fontSize: 35,
                          }}
                          onPress={() => this.addNewMartialArt(this.state.selectedIndex)}
                        />

                        </View>

                        {!!(this.state.editingUser.martialArts && this.state.editingUser.martialArts.length) &&
                            <View style={styles.maSection}>
                                    <RadioGroup
                                      underline
                                      style={styles.martialArtRadio}
                                      items={this.state.selectedMANames || []}
                                      selectedIndex={this.state.selectedMAIndex}
                                      onChange={index => this.setMartialArt(index)}
                                    />

                                <TextInput
                                  placeholder="Level"
                                  style={styles.textInput}
                                  value={this.state.editingUser.martialArts[this.state.selectedMAIndex].level}
                                  onChangeText={val => this.onChangeLevel(val)}
                                />

                                <TouchableOpacity onPress={() => this.showDatePicker()}>

                                <View style={styles.dateSection}>
                                      <Text style={styles.dateText}>
                                        {this.state.editingUser.martialArts[this.state.selectedMAIndex].startDate ? moment(this.state.editingUser.martialArts[this.state.selectedMAIndex].startDate).format('MMMM YYYY') : 'Start Date'}
                                      </Text>

                                          <Image
                                                  source={require('../../../assets/images/drawer/calendar.png')}
                                                  resizeMode="contain"
                                                  style={{
                                                    height: 40,
                                                  }}
                                                />
                                    </View>
                                </TouchableOpacity>

                                {this.state.datePickerVisible && (
                                              <MonthPicker
                                                onChange={this.handleDateSelected}
                                                value={this.state.datePickerValue}
                                                minimumDate={new Date(1900, 1)}
                                                maximumDate={new Date()}
                                                enableAutoDarkMode={false}
                                              />
                                            )}

                                <MatComIcon
                                  name="minus-circle"
                                  style={styles.removeButton}
                                  onPress={() => this.removeMartialArt(this.state.selectedMAIndex)}
                                />
                            </View>
                        }

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
  textInput: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
  logo: {
    height: 150,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
  },
  socialButtonCenter: {
    marginLeft: 10,
    marginRight: 10,
  },
  martialArtRadio: {
      backgroundColor: 'white'
  },
  maHeader: {
        marginTop: 40,
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'space-between'
  },
  headerTitle: {
      fontWeight: "bold",
      fontSize: 25,
      color: "white"
  },
  maSection: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch'
  },
  dateSection: {
    color: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'white',
    borderBottomWidth: 1
  },
  dateText: {
    paddingTop: 10,
    color: 'white'
  },
  removeButton: {
    fontSize: 35,
    alignSelf: 'flex-end'


  }
});
