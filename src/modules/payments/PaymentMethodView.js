import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  NavigationEvents,
  Animated,
  RefreshControl,
  ScrollView
} from 'react-native';
import { colors, fonts } from '../../styles';
import { TextInput, Button, KeyboardInputWrapper, Dropdown } from '../../components';
import settings from '../../settings.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { translate } from '../../translations/index.js';
import stripe from 'tipsi-stripe'
stripe.setOptions({publishableKey: 'pk_test_51HW8PNFxab6j0Gj1FwpN7mKjBNGWnPvPP6Ej4mlR7A0uWSqYxawoeNieLh4JgSEufFSwgITu4ilj9JrleScrEYPq00LDOkH9Tn'})

export default class NotificationListScreen extends React.Component {

  state = {
    anim: new Animated.Value(0),

  }

  async componentDidMount() {
    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

  handleFieldParamsChange = async (valid, params) => {
    console.log(`
      Valid: ${valid}
      Number: ${params.number || '-'}
      Month: ${params.expMonth || '-'}
      Year: ${params.expYear || '-'}
      CVC: ${params.cvc || '-'}
    `)

    if(valid) {
    console.log('set options')
        setOptions({publishableKey: 'pk_test_51HW8PNFxab6j0Gj1FwpN7mKjBNGWnPvPP6Ej4mlR7A0uWSqYxawoeNieLh4JgSEufFSwgITu4ilj9JrleScrEYPq00LDOkH9Tn'})
        console.log('get token')
        const token = await stripe.paymentRequestWithCardForm(params);
        console.log(token)
    }
  }

  isPaymentCardTextFieldFocused = () => this.paymentCardInput.isFocused()

  focusPaymentCardTextField = () => this.paymentCardInput.focus()

  blurPaymentCardTextField = () => this.paymentCardInput.blur()

  resetPaymentCardTextField = () => this.paymentCardInput.setParams({})

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
    return (
      <Animated.View style={[styles.container, this.fadeIn(0, 0)]}>
            <Text style={styles.headerTitle}>{translate('createPaymentMethod')}</Text>

              <PaymentCardTextField
                ref={ (ref) => {
                    this.paymentCardInput = ref;
                }}
                style={styles.field}
                disabled={false}
                onParamsChange={this.handleFieldParamsChange}
              />

      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: colors.secondaryBackground,
      flex: 1
  },
  headerTitle: {
      fontSize: 25,
      color: colors.terciaryText,
      textAlign: 'left',
      marginTop: 10,
      textAlign: 'center'
  },
  field: {
  }
});
