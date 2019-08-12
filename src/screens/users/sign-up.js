// SignUp.js
import React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'

import { Input, Button } from 'react-native-elements';
import isEmail from 'validator/lib/isEmail';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import * as userActions from '../../state/users/actions';

class SignUp extends React.Component {
    constructor() {
        super();
        this.validate();
    }

    state = {
        entity: {
            password: '',
            email: '',
            alias: '',
            firstName: '',
            lastName: ''
        },
        errors: {
            passwordError: '',
            emailError: '',
            aliasError: '',
            firstNameError: '',
            lastNameError: ''
        },
        isValid: false
    }

    onChangeText = async (key, val) => {
      this.state.entity[key] = val;

      await this.validate();
    }

  validate = async() => {
        this.state.isValid = true;

        if(!isEmail(this.state.entity.email)) {
            this.state.errors.emailError = 'You must provide a valid email';
            this.state.isValid = false;
        } else {
            this.state.errors.emailError = '';
        }

        if(!this.state.entity.password) {
            this.state.errors.passwordError = 'You must provide a valid password';
            this.state.isValid = false;
        } else {
            this.state.errors.passwordError = '';
        }

        if(!this.state.entity.alias) {
            this.state.errors.aliasError = 'You must provide a valid alias';
            this.state.isValid = false;
        } else {
            this.state.errors.aliasError = '';
        }

        if(!this.state.entity.firstName) {
            this.state.errors.firstNameError = 'You must provide a valid First Name';
            this.state.isValid = false;
        } else {
            this.state.errors.firstNameError = '';
        }

        if(!this.state.entity.lastName) {
            this.state.errors.lastNameError = 'You must provide a valid Last Name';
            this.state.isValid = false;
        } else {
            this.state.errors.lastNameError = '';
        }
  }

  submit = async () => {
        if(this.state.isValid) {
            await this.props.create(this.state.entity);
        }
  }

  render() {
    return (
      <View style={styles.container}>

        <Input
          label='Email'
          style={styles.input}
          placeholder='Email'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('email', val)}
          errorMessage={this.state.errors.emailError}
        />
        <Input
          label='Password'
          style={styles.input}
          placeholder='Password'
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('password', val)}
          errorMessage={this.state.errors.passwordError}
        />

        <Input
          label='First Name'
          style={styles.input}
          placeholder='First name'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('firstName', val)}
          errorMessage={this.state.errors.firstNameError}
        />

        <Input
          label='Last Name'
          style={styles.input}
          placeholder='Last name'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('lastName', val)}
          errorMessage={this.state.errors.lastNameError}
        />

        <Input
          label='Alias'
          style={styles.input}
          placeholder='Alias'
          autoCapitalize="none"
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('alias', val)}
          errorStyle={{ color: 'red' }}
          errorMessage={this.state.errors.aliasError}
        />

        <Button
          title='Sign Up'
          onPress={this.submit}
        />
      </View>
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