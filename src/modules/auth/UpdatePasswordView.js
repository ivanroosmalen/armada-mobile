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

export default class UpdatePasswordScreen extends React.Component {

  state = {
    anim: new Animated.Value(0),

    // Current visible form
    isKeyboardVisible: false,
    entity: {
                oldPassword: '',
                newPassword: ''
            },
            errors: {
                oldPasswordError: '',
                newPasswordError: ''
            },
            isValid: false
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

        if(!this.state.entity.oldPassword) {
            this.state.errors.oldPasswordError = 'You must provide a valid old password';
            this.state.isValid = false;
        } else {
            this.state.errors.oldPasswordError = '';
        }

        if(!this.state.entity.newPassword) {
            this.state.errors.newPasswordError = 'You must provide a valid new password';
            this.state.isValid = false;
        } else {
            this.state.errors.newPasswordError = '';
        }

        this.setState({
            errors: this.state.errors
        })

        return this.state.isValid;
    }

  submit = async () => {
        if(this.validate()) {
            let response = await this.props.updatePassword(this.props.loggedInUser._id, this.state.entity);
                if(response.status === 200) {
                    this.props.navigation.navigate('Home');
                } else {
                    this.state.errors.pageError = 'Could not update password';
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
              placeholder="Old password"
              secureTextEntry
              style={styles.textInput}
              onChangeText={val => this.onChangeText('oldPassword', val)}
            />

            <Text style={{ fontSize: 12, color: 'red'}}>
                {this.state.errors.oldPasswordError}
            </Text>

            <TextInput
              placeholder="New password"
              secureTextEntry
              style={styles.textInput}
              onChangeText={val => this.onChangeText('newPassword', val)}
            />

            <Text style={{ fontSize: 12, color: 'red'}}>
                {this.state.errors.newPasswordError}
            </Text>

            <Animated.View
              style={[styles.section, styles.bottom, this.fadeIn(700, -20)]}
            >
              <Text style={{ fontSize: 12, color: 'red'}}>
                    {this.state.errors.pageError}
              </Text>
              <Button
                bgColor="white"
                textColor={colors.primary}
                secondary
                rounded
                style={{ alignSelf: 'stretch', marginBottom: 10 }}
                caption={'Save'}
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
