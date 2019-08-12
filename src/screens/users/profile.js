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
    constructor(props) {
        super(props);
    }

     componentDidMount() {
            this.props.get(); //call our action
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