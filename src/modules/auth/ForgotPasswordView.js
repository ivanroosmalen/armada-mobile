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
import { translate, i18n } from '../../translations/index.js';
import isEmail from 'validator/lib/isEmail';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ForgotPasswordScreen extends React.Component {

  state = {
    anim: new Animated.Value(0),
    spinner: false,
    // Current visible form
    isKeyboardVisible: false,
    entity: {
                email: '',
                locale: i18n.locale
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
            this.state.errors.emailError = translate('emailError');
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
            this.setState({ spinner: true });
            let response = await this.props.forgotPassword(this.state.entity);
                if(response.status === 200) {
                    this.state.submitSuccess = true;
                    this.setState({ submitSuccess: this.state.submitSuccess });
                } else {
                    this.state.errors.pageError = translate('resetPasswordError');
                }
            this.setState({ spinner: false });
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

    this.setState({ spinner: false });
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
      <View
        style={styles.background}
      >
        <Spinner
          visible={this.state.spinner}
          textContent={translate('loading')}
          textStyle={{color: colors.quaternaryText}}
        />
        <View style={styles.container}>
          <View style={[styles.section, { paddingTop: 30 }]}>
            <Animated.Image
              resizeMode="contain"
              style={[
                styles.logo,
                this.state.isKeyboardVisible && { height: 90 },
                this.fadeIn(0),
              ]}
              source={require('../../../assets/images/armada-logo-notext.png')}
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
                       { translate('newPasswordEmail') }
                  </Text>
              )}
              <Button
                bgColor={colors.secondaryBackground}
                textColor={colors.secondaryText}
                secondary
                rounded
                style={{ alignSelf: 'stretch', marginBottom: 10 }}
                caption={ translate('requestPassword') }
                onPress={this.submit}
              />
            </Animated.View>
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
    color: colors.primaryText
  },
  logo: {
    height: 150,
  }
});
