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
  Linking
} from 'react-native';

import { fonts, colors } from '../../styles';
import { TextInput, Button } from '../../components';
import { translate, i18n } from '../../translations/index.js';
import isEmail from 'validator/lib/isEmail';
import Spinner from 'react-native-loading-spinner-overlay';
import CheckBox from 'react-native-check-box'

const FORM_STATES = {
  LOGIN: 0,
  REGISTER: 1,
};

export default class AuthScreen extends React.Component {

  state = {
    anim: new Animated.Value(0),
    spinner: false,
    agree: false,
    // Current visible form
    formState: FORM_STATES.LOGIN,
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

    onCheckboxUpdate = () => {
        let agree = !this.state.agree;
        this.setState({ agree });
    }

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
            if(this.state.formState === FORM_STATES.REGISTER) {
                let response = await this.props.register(this.state.entity);
                if(response.status === 201) {
                    this.state.errors.pageError = '';

                    this.setState({
                        formState: FORM_STATES.LOGIN,
                        submitSuccess: true,
                        errors: this.state.errors
                    });

                } else {
                    this.state.errors.pageError = translate('registerError');
                }
            } else {
                let response = await this.props.login(this.state.entity);

                if(response.status === 200) {
                    this.props.navigation.navigate('Home');
                } else {
                    this.state.errors.pageError = translate('loginError');
                }
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
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
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
    const isRegister = this.state.formState === FORM_STATES.REGISTER;

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

            {this.state.formState === FORM_STATES.LOGIN && (
                <View style={{alignSelf: 'stretch'}}>
                    <TextInput
                      placeholder={ translate('password') }
                      secureTextEntry
                      style={styles.textInput}
                      onChangeText={val => this.onChangeText('password', val)}
                    />

                    <Text style={{ fontSize: 12, color: 'red'}}>
                        {this.state.errors.passwordError}
                    </Text>
                </View>
            )}

            {(this.state.formState === FORM_STATES.LOGIN && this.state.submitSuccess) && (
                        <Text style={{ fontSize: 16, color: 'white'}}>
                            { translate('checkEmail') }
                        </Text>
                )}

            {this.state.formState === FORM_STATES.REGISTER && (
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                <CheckBox
                                    onClick={this.onCheckboxUpdate}
                                    isChecked={!!this.state.agree}
                                    checkBoxColor={colors.primaryText}
                                />

                            <Text style={{color: colors.primaryText, marginLeft: 30 }}> { translate('agree') } </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'stretch'}}>
                        <Text style={{fontSize: 20, color: 'white', textDecorationLine: 'underline',}}
                            onPress={() => Linking.openURL('http://armada-app.com/privacy-policy')}>
                            {translate('privacyPolicy')}
                        </Text>
                        <Text style={{fontSize: 20, color: 'white', textDecorationLine: 'underline',}}
                            onPress={() => Linking.openURL('http://armada-app.com/terms-and-conditions')}>
                            {translate('tac')}
                        </Text>
                    </View>
                </View>
            )}

            <Animated.View
              style={[styles.section, styles.bottom, this.fadeIn(700, -20)]}
            >
                  <Text style={{ fontSize: 12, color: 'red'}}>
                        {this.state.errors.pageError}
                  </Text>

              <Button
                bgColor={ colors.secondaryBackground }
                textColor={ colors.secondaryText }
                secondary
                rounded
                style={{ alignSelf: 'stretch', marginBottom: 10 }}
                disabled={this.state.formState === FORM_STATES.REGISTER && !this.state.agree}
                caption={
                  this.state.formState === FORM_STATES.LOGIN
                    ? translate('login')
                    : translate('register')
                }
                onPress={this.submit}
              />



              {!this.state.isKeyboardVisible && (
                <TouchableOpacity
                  onPress={() => {
                    LayoutAnimation.spring();
                    this.setState({
                      formState: isRegister
                        ? FORM_STATES.LOGIN
                        : FORM_STATES.REGISTER,
                    });
                  }}
                  style={{ paddingTop: 30, flexDirection: 'row' }}
                >
                  <Text
                    style={{
                      color: colors.primaryText,
                      fontFamily: fonts.primaryRegular,
                    }}
                  >
                    {isRegister
                      ? translate('alreadyAccount')
                      : translate('noAccount')}
                  </Text>
                  <Text
                    style={{
                      color: colors.primaryText,
                      fontFamily: fonts.primaryBold,
                      marginLeft: 5,
                    }}
                  >
                    {isRegister ? translate('login') : translate('register')}
                  </Text>
                </TouchableOpacity>
              )}

              {this.state.formState === FORM_STATES.LOGIN && (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('ForgotPassword')}
                  style={{ paddingTop: 30, flexDirection: 'row' }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: fonts.primaryBold,
                      marginLeft: 5,
                    }}
                  >
                    {translate('forgotPassword')}
                  </Text>
                </TouchableOpacity>
              )}
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
