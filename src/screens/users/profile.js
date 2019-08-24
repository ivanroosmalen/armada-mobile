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

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as martialArtsActions from '../../state/martialArts/actions';

class SignUp extends React.Component {
    constructor() {
        super();
    }

    state = {
        entity: {
            martialArt: ''
        },
        errors: {
            martialArtError: ''
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

  validate = async() => {
        this.state.isValid = true;

        if(!isEmail(this.state.entity.martialArt)) {
            this.state.errors.emailError = 'You must select a martial art';
            this.state.isValid = false;
        } else {
            this.state.errors.emailError = '';
        }

        this.setState({
            errors: this.state.errors
        })
  }

  submit = async () => {
        if(this.state.isValid) {
            await this.props.create(this.state.entity);
        }
  }

  componentDidMount() {
    this.validate();
  }

  render() {
    return (
      <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
          >

        <View style={styles.container}>
        <TextInput
          label='Email'
          style={styles.input}
          placeholder='Email'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('martialArt', val)}
        />
        <Text style={{ fontSize: 12, color: 'red'}}>
            {this.state.errors.martialArtError}
        </Text>

        <Button
          title='Sign Up'
          onPress={this.submit}
        />

        </View>
      </KeyboardAwareScrollView>
    )
  }
}

function mapStateToProps(state, props) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(userActions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

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