import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Keyboard,
  Platform,
  LayoutAnimation,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import { fonts, colors } from '../../styles';
import { TextInput, Button } from '../../components';

import isEmail from 'validator/lib/isEmail';

export default class ForgotPasswordScreen extends React.Component {

  state = {
    anim: new Animated.Value(0),

    // Current visible form
    isKeyboardVisible: false,
    entity: {
                email: ''
            },
            errors: {
                emailError: ''
            },
            isValid: false,
            submitSuccess: false
  };

    onChangeText = async (key, val) => {
      this.state.entity[key] = val;

      if(this.state) {
         this.setState({
              entity: this.state.entity
         })
      }
    }

    validate = () => {
        this.state.isValid = true;

        if(!isEmail(this.state.entity.email)) {
            this.state.errors.emailError = 'You must provide a valid email';
            this.state.isValid = false;
        } else {
            this.state.errors.emailError = '';
        }

        this.setState({
            errors: this.state.errors
        })

        return this.state.isValid;
    }

  submit = async () => {
        if(this.validate()) {
            let response = await this.props.forgotPassword(this.state.entity);
                if(response.status === 200) {
                    this.state.submitSuccess = true;
                    this.setState({ submitSuccess: this.state.submitSuccess });
                } else {
                    this.state.errors.pageError = 'Could not reset password';
                }
        }
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      Platform.select({ android: 'keyboardDidShow', ios: 'keyboardWillShow' }),
      this._keyboardDidShow.bind(this),
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
          <View style={[styles.section, { paddingTop: 30 }]}>
            <Animated.Image
              resizeMode="contain"
              style={[
                styles.logo,
                this.state.isKeyboardVisible && { height: 90 },
                this.fadeIn(0),
              ]}
              source={require('../../../assets/images/white-logo.png')}
            />
          </View>

          <Animated.View
            style={[styles.section, styles.middle, this.fadeIn(700, -20)]}
          >
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={val => this.onChangeText('email', val)}
            />

            <Text style={{ fontSize: 12, color: 'red'}}>
                {this.state.errors.emailError}
            </Text>

            <Animated.View
              style={[styles.section, styles.bottom, this.fadeIn(700, -20)]}
            >
              {this.state.submitSuccess && (
                  <Text style={{ fontSize: 20, color: 'white'}}>
                       {'Please check your email for a new password'}
                  </Text>
              )}
              <Button
                bgColor="white"
                textColor={colors.primary}
                secondary
                rounded
                style={{ alignSelf: 'stretch', marginBottom: 10 }}
                caption={'Request new password'}
                onPress={this.submit}
              />
            </Animated.View>
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
  }
});
