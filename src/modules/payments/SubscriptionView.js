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
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { translate } from '../../translations/index.js';
import Spinner from 'react-native-loading-spinner-overlay';
import stripe from 'tipsi-stripe'
import Toast from 'react-native-simple-toast';

export default class NotificationListScreen extends React.Component {

  state = {
    anim: new Animated.Value(0),
    refreshing: false,
    cancelConfirmDialogVisible: false,
    spinner: false,
    academyIndex: 0,
    productIndex: 0,
    paymentMethodIndex: 0,
    academies: [],
    products: [],
    paymentMethods: []
  }

  async onRefresh() {
    this.setState({ refreshing: true })
    await this.getData(false);
    this.setState({ refreshing: false })
  }

  async getAcademy(index, fromCache = true) {
        let userAcademies = this.props.userAcademies[this.props.loggedInUser._id];
        if(userAcademies && userAcademies.owner && userAcademies.owner.length) {
            let academyId = userAcademies.owner[index]._id;
            await Promise.all([
                this.props.getAcademy(academyId, {}, fromCache),
                this.props.getUserAcademyPayment(academyId)
            ])
        }
  }

  async getData(fromCache = true) {
    let currentUser = this.props.loggedInUser;
    if(currentUser) {
        await Promise.all([
            this.props.getUserAcademies(currentUser._id, {}, fromCache),
            this.props.getProductsAndPricing(),
            this.props.listPaymentMethods()
        ])

        await this.getAcademy(this.state.academyIndex, fromCache)

        this.setState({
            academies: currentUser && this.props.userAcademies && this.props.userAcademies[currentUser._id] && this.props.userAcademies[currentUser._id].owner ? this.props.userAcademies[currentUser._id].owner : [],
            products: this.props.productsPricing,
            paymentMethods: this.props.paymentMethods,
        })

    }
  }

  async componentDidMount() {
    await this.getData();

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    async componentDidUpdate(prevProps, prevState) {
      if(prevProps.paymentMethods !== this.props.paymentMethods) {
        this.setState({ paymentMethods: this.props.paymentMethods })
      }

      if(prevProps.loggedInUser !== this.props.loggedInUser && this.props.loggedInUser) {
        this.setState({
            academyIndex: 0,
            productIndex: 0,
            paymentMethodIndex: 0
        })
        await this.getData(false);
      }
    }

  async onAcademySelected(index) {
    await this.getAcademy(index);
    this.setState({ academyIndex: index })
  }

  async onProductSelected(index) {
    this.setState({ productIndex: index })
  }

  async onPaymentMethodSelected(index) {
    this.setState({ paymentMethodIndex: index })
  }

  async createPaymentMethod() {
       const token = await stripe.paymentRequestWithCardForm({});

       if(token) {
           this.setState({ spinner: true })
           await this.props.createPaymentMethod(token);
           this.setState({ spinner: false })
       }
     }

  async createSubscription(create = true) {
    this.setState({ spinner: true })
    let requestBody = {
        priceId: this.state.products[this.state.productIndex].price.id,
        academyId: this.state.academies[this.state.academyIndex]._id,
        paymentMethodId: this.state.paymentMethods[this.state.paymentMethodIndex].id
    }

    if(parseInt(this.state.products[this.state.productIndex].product.metadata.members) < this.state.academies[this.state.academyIndex].memberLimit) {
        Toast.showWithGravity(translate('tooManyMembers'), Toast.LONG, Toast.BOTTOM);
        this.setState({ spinner: false })
        return;
    }

    if(create) {
        await this.props.createSubscription(requestBody);
    } else {
        await this.props.updateSubscription(requestBody);
    }

    await this.getData(false);
    this.setState({ spinner: false })
  }

  async cancelSubscription() {
    this.setState({ cancelConfirmDialogVisible: true })
  }

  async confirmCancel() {
    this.setState({ spinner: true })
    let requestBody = {
        academyId: this.state.academies[this.state.academyIndex]._id,
    }

    try {
        await this.props.cancelSubscription(requestBody);
    } catch(e) {
    }

    await this.getData(false);
    this.setState({
        spinner: false,
        cancelConfirmDialogVisible: false
    })
  }

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
    let currentUser = this.props.loggedInUser;
    let academies = this.state.academies || [];
    let academyNames = academies.map(academy => academy.name);
    let academy = academies.length && this.props.academy[academies[this.state.academyIndex]._id] || {};
    let products = this.state.products && this.state.products.map(product => product.product && product.product.description) || [];
    let paymentMethods = this.state.paymentMethods && this.state.paymentMethods.map(pm => pm.card && `****-****-****-${pm.card.last4}`) || [];

    return (
      <Animated.View style={[styles.container, this.fadeIn(0, 0)]}>
            <Spinner
              visible={this.state.spinner}
              textContent={translate('loading')}
              textStyle={{color: colors.quaternaryText}}
            />
            <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}>
            <Text style={styles.headerTitle}>{translate('subscriptions')}</Text>

                <View>
                        <Dropdown
                            color={colors.terciaryText}
                            listBackgroundColor={colors.primaryBackground}
                            listTextColor={colors.primaryText}
                            fontSize={20}
                            style={ styles.dropdown }
                            items={academyNames}
                            selectedIndex={this.state.academyIndex}
                            onSelect={(index) => { this.onAcademySelected(index) }}
                        />
                </View>

                <View style={styles.currentSubscription}>
                        <Text style={styles.limitDescriptionText}>
                             {translate('yourMemberLimit')}:
                        </Text>
                        <Text style={styles.limitText}>
                            {academy.memberLimit === 10000 ? 'Unlimited' : academy.memberLimit}
                        </Text>
                </View>

                <View style={styles.updateSubscription}>
                    {!!(this.props.userAcademyPayment && this.props.userAcademyPayment[academy._id]) && (
                        <Text style={styles.updateSubscriptionText}>
                             {translate('updateSubscription')}
                        </Text>
                    )}

                    {!(this.props.userAcademyPayment && this.props.userAcademyPayment[academy._id]) && (
                        <Text style={styles.updateSubscriptionText}>
                             {translate('createSubscription')}
                        </Text>
                    )}
                </View>

                <View>
                        <Dropdown
                            color={colors.terciaryText}
                            borderColor={colors.secondaryText}
                            listBackgroundColor={colors.primaryBackground}
                            listTextColor={colors.primaryText}
                            fontSize={18}
                            style={ styles.dropdown }
                            items={products}
                            selectedIndex={this.state.productIndex}
                            onSelect={(index) => { this.onProductSelected(index) }}
                        />
                </View>

                {!!(paymentMethods && paymentMethods.length) && (
                <View>
                    <View style={styles.selectPM}>
                            <Text style={styles.limitDescriptionText}>
                                 {translate('selectPaymentMethod')}
                            </Text>
                    </View>

                    <View>
                            <Dropdown
                                color={colors.terciaryText}
                                borderColor={colors.secondaryText}
                                listBackgroundColor={colors.primaryBackground}
                                listTextColor={colors.primaryText}
                                fontSize={18}
                                style={ styles.dropdown }
                                items={paymentMethods}
                                selectedIndex={this.state.paymentMethodIndex}
                                onSelect={(index) => { this.onPaymentMethodSelected(index) }}
                            />
                    </View>

                    <View style={styles.createPaymentMethod}>
                        <Button
                                        secondary
                                        rounded
                                        small
                                        bgColor={ colors.primaryBackground }
                                        textColor={colors.primaryText}
                                        style={{width: 250}}
                                        caption={translate('createNewPaymentMethod')}
                                        onPress={() => this.createPaymentMethod()}
                                      />
                    </View>

                    {!(this.props.userAcademyPayment && this.props.userAcademyPayment[academy._id]) && (
                    <View style={styles.createSubscription}>
                        <Button
                                        secondary
                                        rounded
                                        small
                                        bgColor={ colors.primaryBackground }
                                        textColor={colors.primaryText}
                                        style={{ }}
                                        caption={translate('createSubscription')}
                                        onPress={() => this.createSubscription()}
                                      />
                    </View>
                    )}

                    {!!(this.props.userAcademyPayment && this.props.userAcademyPayment[academy._id]) && (
                    <View style={styles.createSubscription}>
                        <Button
                                        secondary
                                        rounded
                                        small
                                        bgColor={ colors.primaryBackground }
                                        textColor={colors.primaryText}
                                        style={{ }}
                                        caption={translate('updateSubscription')}
                                        onPress={() => this.createSubscription(false)}
                                      />

                        <Button
                                        secondary
                                        rounded
                                        small
                                        bgColor={ colors.primaryBackground }
                                        textColor={colors.primaryText}
                                        style={{ marginTop: 30 }}
                                        caption={translate('cancelSubscription')}
                                        onPress={() => this.cancelSubscription()}
                                      />
                    </View>
                    )}
                </View>
                )}

                {!(paymentMethods && paymentMethods.length) && (
                    <View style={styles.createPaymentMethod}>
                        <Button
                                        secondary
                                        rounded
                                        small
                                        bgColor={ colors.primaryBackground }
                                        textColor={colors.primaryText}
                                        style={{ }}
                                        caption={translate('createPaymentMethod')}
                                        onPress={() => this.createPaymentMethod()}
                                      />
                    </View>
                )}


                        <Modal isVisible={this.state.cancelConfirmDialogVisible} onBackdropPress={() => this.setState({ cancelConfirmDialogVisible: false })}>
                            <View>
                                  <Button
                                    secondary
                                    rounded
                                    small
                                    bgColor={ colors.primaryBackground }
                                    textColor={ colors.primaryText }
                                    style={ styles.cancelButton }
                                    caption={ translate('confirm') }
                                    onPress={() => this.confirmCancel()}
                                  />

                                  <Button
                                    secondary
                                    rounded
                                    small
                                    bgColor={ colors.primaryBackground }
                                    textColor={ colors.primaryText }
                                    style={ styles.cancelButton }
                                    caption={ translate('cancel') }
                                    onPress={() => this.setState({ cancelConfirmDialogVisible: false })}
                                  />
                          </View>
                        </Modal>
            </ScrollView>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: colors.secondaryBackground,
      flex: 1
  },
  dropdown: {
    fontSize: 25,
    paddingHorizontal: 20
  },
  headerTitle: {
      fontSize: 25,
      color: colors.terciaryText,
      textAlign: 'left',
      marginTop: 10,
      textAlign: 'center'
  },
  currentSubscription: {
    paddingHorizontal: 20,
    marginTop: 30
  },
  updateSubscription: {
    paddingHorizontal: 20,
    marginTop: 80
  },
  createSubscription: {
    paddingHorizontal: 20,
    marginTop: 80
  },
  selectPM: {
      paddingHorizontal: 20,
      marginTop: 40
  },
  limitDescriptionText: {
    fontSize: 18,
    textAlign: 'center'
  },
  limitText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  updateSubscriptionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  createPaymentMethod:{
    marginTop: 40,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center'
  },
    cancelButton: {
        width: 300,
        alignSelf: 'center',
        marginTop: 20
      },
});
