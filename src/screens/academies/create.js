// SignUp.js
import React from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Button
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNPickerSelect from 'react-native-picker-select';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as academyActions from '../../state/academies/actions';
import * as martialArtActions from '../../state/martialArts/actions';

class CreateAcademy extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        entity: {
            name: '',
            martialArts: [{
                _id: '',
                name: ''
            }],
            locations: [{
                address: '',
                address2: '',
                zipCode: '',
                city: '',
                stateRegion: '',
                country: ''
            }]
        },
        martialArts: [{label: 'test', value: 'test'}],
        errors: {
            nameError: ''
        },
        isValid: false
    }

    onChangeText = async (key, val) => {
      this.state.entity[key] = val;

      if(this.state) {
         this.setState({
              entity: this.state.entity
         })
      }

      await this.validate();
    }

    setMartialArt = async (value, index) => {
        this.state.entity.martialArts[index] = this.props.martialArts[value];

        if(this.state) {
           this.setState({
              entity: this.state.entity
           })
        }
    }

    setLocation = async (value, field, index) => {
        this.state.entity.locations[index][field] = value;

        if(this.state) {
           this.setState({
              entity: this.state.entity
           })
        }
    }

  validate = async() => {
        this.state.isValid = true;

        if(!this.state.entity.name) {
            this.state.errors.nameError = 'You must provide a valid name';
            this.state.isValid = false;
        } else {
            this.state.errors.nameError = '';
        }

        this.setState({
            errors: this.state.errors
        })
  }

    addMartialArt = async () => {
          this.state.entity.martialArts.push({
                _id: '',
                name: ''
          });

        if(this.state) {
            this.setState({
                entity: this.state.entity
            })
        }
    }

    addLocation = async () => {
          this.state.entity.locations.push({
                address: '',
                address2: '',
                zipCode: '',
                city: '',
                stateRegion: '',
                country: ''
          });
          if(this.state) {
                   this.setState({
                        entity: this.state.entity
                   })
                }
    }

    submit = async () => {
        if(this.state.isValid) {
            await this.props.academyActions.create(this.state.entity);
        }
    }

  componentWillMount = async () => {
    await this.props.martialArtActions.list();

    this.validate();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.martialArts !== this.props.martialArts) {
        this.state.martialArts = this.props.martialArts.map((ma, index) => {
            return { label: ma.name, value: index }
        })

        this.setState({
            martialArts: this.state.martialArts
        })
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
          >

        <View style={styles.container}>
        <Text>Create an Academy</Text>

        <TextInput
          label='name'
          style={styles.input}
          placeholder='Academy Name'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('name', val)}
        />
        <Text style={{ fontSize: 12, color: 'red'}}>
            {this.state.errors.nameError}
        </Text>

        {this.state.entity.martialArts.map((martialArt, index) => {
            return (
                <RNPickerSelect
                    key={index}
                    onValueChange={(value) => this.setMartialArt(value, index)}
                    items={this.state.martialArts}
                />
            );
        })}

        <Button
          title='Add Martial Art'
          onPress={this.addMartialArt}
        />

        {this.state.entity.locations.map((location, index) => {
            return (
            <View key={index} >
                <TextInput
                  label='Address'
                  style={styles.input}
                  placeholder='Address'
                  autoCapitalize="none"
                  placeholderTextColor='white'
                  onChangeText={(value) => this.setLocation(value, 'address', index)}
                />

                <TextInput
                  label='Address2'
                  style={styles.input}
                  placeholder='Address2'
                  autoCapitalize="none"
                  placeholderTextColor='white'
                  value={location.Address2}
                  onChangeText={(value) => this.setLocation(value, 'address2', index)}
                />

                <TextInput
                  label='Zipcode'
                  style={styles.input}
                  placeholder='ZipCode'
                  autoCapitalize="none"
                  placeholderTextColor='white'
                  onChangeText={(value) => this.setLocation(value, 'zipCode', index)}
                />

                <TextInput
                  label='City'
                  style={styles.input}
                  placeholder='City'
                  autoCapitalize="none"
                  placeholderTextColor='white'
                  onChangeText={(value) => this.setLocation(value, 'city', index)}
                />

                <TextInput
                  label='State / Region'
                  style={styles.input}
                  placeholder='State / Region'
                  autoCapitalize="none"
                  placeholderTextColor='white'
                  onChangeText={(value) => this.setLocation(value, 'stateRegion', index)}
                />

                <TextInput
                  label='Country'
                  style={styles.input}
                  placeholder='Country'
                  autoCapitalize="none"
                  placeholderTextColor='white'
                  onChangeText={(value) => this.setLocation(value, 'country', index)}
                />

            </View>
            );
        })}

        <Button
          title='Add Location'
          onPress={this.addLocation}
        />

        <Button
          title='Submit'
          onPress={this.submit}
        />

        </View>
      </KeyboardAwareScrollView>
    )
  }
}

function mapStateToProps(state, props) {
    return {
        martialArts: state.martialArtReducer.martialArts
    }
}

function mapDispatchToProps(dispatch) {

    return {
        academyActions: bindActionCreators(academyActions, dispatch),
        martialArtActions: bindActionCreators(martialArtActions, dispatch),
    }
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(CreateAcademy);

const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 55,
    backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})