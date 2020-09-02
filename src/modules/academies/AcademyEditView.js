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
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import MonthPicker from 'react-native-month-year-picker';
import moment from 'moment';
import { RadioGroup, Dropdown, Cards } from '../../components';
import Spinner from 'react-native-loading-spinner-overlay';
import { fonts, colors } from '../../styles';
import { TextInput, Button } from '../../components';
import MultiSelect from 'react-native-multiple-select';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { translate, i18n } from '../../translations/index.js';

export default class AcademyEditScreen extends React.Component {

    state = {
        anim: new Animated.Value(0),
        spinner: false,
        // Current visible form
        isKeyboardVisible: false,
        errors: {
           nameError: ''
        },
        isValid: false,
        martialArtList: [],
        editingAcademy: {}
      };

        onChangeText = async (key, val) => {
          this.state.editingAcademy[key] = val;

          this.setState({
              editingAcademy: this.state.editingAcademy
          })
        }

        onSelectedMAs = selectedMAs => {
            this.state.editingAcademy.martialArts = selectedMAs.map(selectedMA => ({ name: selectedMA }))
            this.setState({
                editingAcademy: this.state.editingAcademy
            });
          };

          onSelectedInstructors = selectedInstructors => {
            let instructors = this.state.editingAcademy.students && this.state.editingAcademy.students.filter(student => selectedInstructors.indexOf(student._id) !== -1);

            if(!instructors) {
                if(selectedInstructors[0] === this.props.loggedInUser._id) {
                    instructors = [ this.props.loggedInUser ];
                }
            }
            this.state.editingAcademy.instructors = instructors;
            this.setState({
                editingAcademy: this.state.editingAcademy
            });
          };

         onAddressSelect = address => {
            let location = {
                placeId: address.place_id,
                address: address.formatted_address,
                url: address.url,
                geo: {
                    type: 'Point',
                    coordinates: [ parseFloat(address.geometry.location.lng), parseFloat(address.geometry.location.lat) ]
                }
            }

            this.state.editingAcademy.locations = this.state.editingAcademy.locations || [];
            this.state.editingAcademy.locations.push(location);

            this.setState({
                editingAcademy: this.state.editingAcademy
            })

         }

         onLocationRemoved = locations => {
            this.state.editingAcademy.locations = locations;
            this.setState({
                editingAcademy: this.state.editingAcademy
            })
         }

        validate = () => {
            this.state.isValid = true;

            if(!this.state.editingAcademy.name) {
                this.state.errors.nameError = translate('nameError');
                this.state.isValid = false;
            } else {
                this.state.errors.nameError = '';
            }

            this.setState({
                errors: this.state.errors
            })

            return this.state.isValid;
        }

      submit = async () => {
            if(this.validate()) {
                this.setState({ spinner: true });

                let academyId = '';
                if(this.props.route.params && this.props.route.params.id) {
                    await this.props.updateAcademy(this.props.academy._id, this.state.editingAcademy);
                    academyId = this.props.academy._id

                    this.props.navigation.goBack();
                } else {
                    let entity = await this.props.createAcademy(this.state.editingAcademy);
                    academyId = entity._id

                    this.props.navigation.goBack();
                    this.props.navigation.navigate('Academy', {id: academyId})
                }

                this.setState({ spinner: false });
            }
      }

      async getData() {
        let dataRequests = [
            this.props.getMartialArts()
        ];

        if(this.props.route.params && this.props.route.params.id) {
            dataRequests.push(this.props.getAcademy(this.props.route.params.id))
        }

        return Promise.all(dataRequests);
      }

      async componentDidMount() {
        await this.getData();

        this.setState({
            editingAcademy: this.props.academy || { martialArts: [] },
            martialArtList: this.props.martialArts && this.props.martialArts.map(ma => ({ name: ma.name })).sort(),
            spinner: false
        });

        this.keyboardDidShowListener = Keyboard.addListener(
          Platform.select({ android: 'keyboardDidShow', ios: 'keyboardWillShow' }),
          this._keyboardDidShow.bind(this)
        );
        this.keyboardDidHideListener = Keyboard.addListener(
          Platform.select({ android: 'keyboardDidHide', ios: 'keyboardWillHide' }),
          this._keyboardDidHide.bind(this),
        );

        Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
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
      const { martialArtList, editingAcademy } = this.state;
      let selectedMAs = editingAcademy.martialArts && editingAcademy.martialArts.map(ma => ma.name);
      let selectedInstructors = editingAcademy.instructors && editingAcademy.instructors.map(instructor => instructor._id) || [];
      let selectedLocations = editingAcademy.locations;
      autocompleteMinHeight = 50;

      return (

        <View style={styles.background} >
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
                      value={this.state.editingAcademy.name}
                      onChangeText={val => this.onChangeText('name', val)}
                    />

                    {!!this.state.errors.nameError &&
                        <Text style={{ fontSize: 12, color: 'red'}}>
                            {this.state.errors.nameError}
                        </Text>
                    }

                    <MultiSelect
                      items={martialArtList}
                      uniqueKey="name"
                      ref={(component) => { this.multiSelect = component }}
                      onSelectedItemsChange={this.onSelectedMAs}
                      selectedItems={selectedMAs}
                      selectText={ translate('selectMartialArts') }
                      searchInputPlaceholderText={ translate('searchMartialArts') }
                      selectedItemTextColor={colors.quaternaryText}
                      selectedItemIconColor={colors.quaternaryText}
                      styleMainWrapper={{zIndex: 100}}
                      itemTextColor={colors.terciaryText}
                      searchInputStyle={{ color: colors.terciaryText }}
                      submitButtonColor={colors.terciaryText}
                      textColor={colors.primaryText}
                      styleMainWrapper={ styles.maMultiSelect }
                      styleListContainer={{height: 200}}
                      styleDropdownMenuSubsection={{ backgroundColor: colors.primaryBackground, borderBottomColor: colors.primaryText }}
                      tagRemoveIconColor={ colors.primaryText }
                      tagBorderColor={ colors.primaryText }
                      tagTextColor={ colors.primaryText }
                      displayKey="name"
                      submitButtonText={ translate('submit') }
                    />

                    <MultiSelect
                      items={(editingAcademy && editingAcademy.students) ? editingAcademy.students : [this.props.loggedInUser]}
                      uniqueKey="_id"
                      ref={(component) => { this.multiSelect = component }}
                      onSelectedItemsChange={ this.onSelectedInstructors }
                      selectedItems={ selectedInstructors }
                      selectText={ translate('selectInstructors') }
                      searchInputPlaceholderText={ translate('searchMembers') }
                      selectedItemTextColor={colors.quaternaryText}
                      selectedItemIconColor={colors.quaternaryText}
                      itemTextColor={colors.terciaryText}
                      searchInputStyle={{ color: colors.terciaryText }}
                      submitButtonColor={colors.terciaryText}
                      textColor={colors.primaryText}
                      styleMainWrapper={ styles.instructorMultiSelect }
                      styleListContainer={{height: 200}}
                      styleDropdownMenuSubsection={{ backgroundColor: colors.primaryBackground, borderBottomColor: colors.primaryText }}
                      tagRemoveIconColor={ colors.primaryText }
                      tagBorderColor={ colors.primaryText }
                      tagTextColor={ colors.primaryText }
                      displayKey="alias"
                      submitButtonText={ translate('submit') }
                    />

                    <View style={ styles.mapElement }>
                        <View style={{minHeight: 200}}>
                            <GooglePlacesAutocomplete
                              placeholder={ translate('enterAddress') }
                              minLength={2}
                              autoFocus={false}
                              returnKeyType={'default'}
                              fetchDetails={true}
                              listViewDisplayed={true}
                              onPress={(data, details = null) => {
                                this.onAddressSelect(details);
                              }}
                              query={{
                                key: 'AIzaSyCLkz2qsPEvcoajtNSTyEBQcAl-X3f5Fr0',
                                language: i18n.locale,
                              }}
                              styles={{
                                container: {
                                    alignSelf: 'stretch',
                                    width: '100%',
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    color: colors.terciaryText,
                                    elevation: 10,
                                    minHeight:0,
                                    zIndex: 999
                                },
                                listView: {
                                    backgroundColor: 'rgba(255,255,255,1)',
                                    height:300
                                },
                                row: {
                                    backgroundColor: 'rgba(255,255,255,1)'
                                },
                                  textInputContainer: {
                                    backgroundColor: 'rgba(0,0,0,0)',
                                          borderTopWidth: 0,
                                          borderBottomWidth: 0,
                                          width: '100%',
                                          height: 50,
                                          zIndex:1
                                  },
                                textInput: {
                                  marginLeft: 0,
                                  marginRight: 0,
                                  height: 38,
                                  color: '#5d5d5d',
                                  fontSize: 16,
                                },
                                predefinedPlacesDescription: {
                                  color: '#1faadb',
                                }
                                }}
                            />
                         </View>
                        <View style={ styles.locations }>
                            <Cards
                                items={selectedLocations}
                                uniqueKey="address"
                                displayKey="address"
                                onItemsUpdated={this.onLocationRemoved}
                                tagRemoveIconColor={ colors.primaryText }
                                tagBorderColor={ colors.primaryText }
                                tagTextColor={ colors.primaryText }
                            />
                        </View>
                      </View>

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
                             zIndex: 100
                             }}
                            caption={ translate('save') }
                            onPress={this.submit}
                          />
                  </Animated.View>
                </View>
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
  textInput: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
  instructorMultiSelect: {
    alignSelf: 'stretch',
    marginTop: 20,
    zIndex:100
  },
  maMultiSelect: {
      alignSelf: 'stretch',
      marginTop: 20,
      zIndex:1000
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
      width: '100%'
  }
});
