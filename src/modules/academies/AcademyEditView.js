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
import { RadioGroup, Dropdown, Cards } from '../../components';

import { fonts, colors } from '../../styles';
import { TextInput, Button } from '../../components';
import MultiSelect from 'react-native-multiple-select';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { translate, i18n } from '../../translations/index.js';

export default class AcademyEditScreen extends React.Component {

    state = {
        anim: new Animated.Value(0),

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
            this.state.editingAcademy.instructors = this.state.editingAcademy.students.filter(student => selectedInstructors.indexOf(student._id) !== -1);
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
                let academyId = '';
                if(this.props.route.params && this.props.route.params.id) {
                    await this.props.updateAcademy(this.props.academy._id, this.state.editingAcademy);
                    academyId = this.props.academy._id
                } else {
                    let entity = await this.props.createAcademy(this.state.editingAcademy);
                    academyId = entity._id
                }

                this.props.navigation.goBack();
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
            martialArtList: this.props.martialArts && this.props.martialArts.map(ma => ({ name: ma.name })).sort()
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
      const { martialArtList, editingAcademy } = this.state;
      let selectedMAs = editingAcademy.martialArts && editingAcademy.martialArts.map(ma => ma.name);
      let selectedInstructors = editingAcademy.instructors && editingAcademy.instructors.map(instructor => instructor._id) || [];
      let selectedLocations = editingAcademy.locations;
      autocompleteMinHeight = 50;
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
                      tagRemoveIconColor="#CCC"
                      tagBorderColor="#CCC"
                      tagTextColor="#CCC"
                      selectedItemTextColor="#CCC"
                      selectedItemIconColor="#CCC"
                      itemTextColor="#000"
                      displayKey="name"
                      searchInputStyle={{ color: '#CCC' }}
                      submitButtonColor="#CCC"
                      submitButtonText={ translate('submit') }
                      styleMainWrapper={ styles.textInput }
                    />

                    <MultiSelect
                      items={editingAcademy.students}
                      uniqueKey="_id"
                      ref={(component) => { this.multiSelect = component }}
                      onSelectedItemsChange={ this.onSelectedInstructors }
                      selectedItems={ selectedInstructors }
                      selectText={ translate('selectInstructors') }
                      searchInputPlaceholderText={ translate('searchMembers') }
                      tagRemoveIconColor="#CCC"
                      tagBorderColor="#CCC"
                      tagTextColor="#CCC"
                      selectedItemTextColor="#CCC"
                      selectedItemIconColor="#CCC"
                      itemTextColor="#000"
                      displayKey="alias"
                      searchInputStyle={{ color: '#CCC' }}
                      submitButtonColor="#CCC"
                      submitButtonText={ translate('submit') }
                      styleMainWrapper={ styles.textInput }
                    />

                    <View style={ styles.mapElement }>
                        <View style={{position: 'absolute', width: '100%'}}>
                            <GooglePlacesAutocomplete
                              placeholder={ translate('enterAddress') }
                              minLength={2}
                              autoFocus={false}
                              returnKeyType={'default'}
                              fetchDetails={true}
                              onPress={(data, details = null) => {
                                // 'details' is provided when fetchDetails = true
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
                                    height: 40,
                                    zIndex: 10,
                                    elevation: 10,
                                    height:200
                                },
                                listView: {
                                    backgroundColor: 'rgba(255,255,255,1)'
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
                                tagRemoveIconColor="#CCC"
                                tagBorderColor="#CCC"
                                tagTextColor="#CCC"
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
                             }}
                            caption={ translate('save') }
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
  }
});
