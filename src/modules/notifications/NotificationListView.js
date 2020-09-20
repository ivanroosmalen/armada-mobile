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
import LinearGradient from 'react-native-linear-gradient';
import { colors, fonts } from '../../styles';
import { TextInput, Button, KeyboardInputWrapper } from '../../components';
import settings from '../../settings.js';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NotificationElement from './NotificationElement';
import { translate } from '../../translations/index.js';
import Spinner from 'react-native-loading-spinner-overlay';

export default class NotificationListScreen extends React.Component {

  state = {
    anim: new Animated.Value(0),
    refreshing: false,
    academyDialogVisible: false,
    notificationDialogVisible: false,
    deleteNotificationDialogVisible: false,
    academyId: '',
    notification: {},
    spinner: false
  }

  async onRefresh() {
    this.setState({ refreshing: true })
    await this.getData();
    this.setState({ refreshing: false })
  }

  async getData() {
    await this.props.getUserAcademies(this.props.loggedInUser._id);
    let academies = [];
    this.props.userAcademies && this.props.userAcademies.owner && this.props.userAcademies.owner && academies.push.apply(academies, this.props.userAcademies.owner);
    this.props.userAcademies && this.props.userAcademies.student && this.props.userAcademies.student && academies.push.apply(academies, this.props.userAcademies.student)
    this.props.userAcademies && this.props.userAcademies.instructor && this.props.userAcademies.instructor && academies.push.apply(academies, this.props.userAcademies.instructor)
    if(academies.length) {
        await this.props.getNotifications({academyIds: academies.map(ua => ua._id).join(',')})
    }
  }

  async componentDidMount() {
    await this.getData();

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    async componentDidUpdate(prevProps, prevState) {
      if (prevProps.notifications.length !== this.props.notifications.length) {
        await this.getData()
      }
    }

  addNotification(ownerAcademies) {
     if(ownerAcademies.length === 1) {
        this.broadcast({ academy: { _id: ownerAcademies[0]._id, name: ownerAcademies[0].name } });
     } else if(ownerAcademies.length > 1) {
        this.setState({ academyDialogVisible: true });
     }
  }

        onChangeNotification = async (val) => {
          this.state.notification.message = val;
          this.setState({
              notification: this.state.notification
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

  broadcast = (notification = {}) => {
    this.setState({
        academyDialogVisible: false,
        notificationDialogVisible: true,
        notification
    });
  }

  async sendMessage() {
    this.setState({spinner: true})
    let notification = this.state.notification;
    if(notification._id) {
        await this.props.updateNotification(notification._id, notification);
    } else {
        await this.props.createNotification(notification);
    }

    await this.getData();

    this.setState({
        notificationDialogVisible: false,
        spinner: false
    });
  }

  deleteNotification = async () => {
    this.setState({spinner: true})
    await this.props.deleteNotification(this.state.notification._id)
    await this.getData();

    this.setState({
        deleteNotificationDialogVisible: false,
        spinner: false
    });
  }

  deleteMessageRequested = async (notification) => {
    this.setState({
        deleteNotificationDialogVisible: true,
        notification
    });
  }

  _getRenderItemFunction = ({ item }, ownerAcademies, broadcast, deleteMessage) => {
    return (
       <NotificationElement
            notification={item}
            broadcast={broadcast}
            deleteMessage={deleteMessage}
            key={item._id}
            isOwner={!!ownerAcademies.find(oa => (oa._id === item.academy._id))}
       />

    );
  };

    FlatListItemSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: colors.terciaryText,

          }}
        />
      );
    }

  render() {
    let notifications = (this.props && this.props.notifications) || [];
    let isLoggedIn = this.props.loggedInUser;
    let ownerAcademies = this.props.userAcademies && this.props.userAcademies.owner || [];

    return (
      <Animated.View style={[styles.container, this.fadeIn(0, 0)]}>
            <Spinner
              visible={this.state.spinner}
              textContent={translate('loading')}
              textStyle={{color: colors.quaternaryText}}
            />
                { !notifications.length && (
                    <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}>
                        <Text style={styles.noNotifications}>{ translate('noNotifications') }</Text>
                    </ScrollView>
                )}

                { !!notifications.length && (
                <View>
                    <FlatList
                      keyExtractor={item => item._id }
                      style={{ backgroundColor: colors.terciaryBackground, paddingHorizontal: 15 }}
                      data={this.props.notifications || []}
                      renderItem={(data) => this._getRenderItemFunction(data, ownerAcademies, this.broadcast, this.deleteMessageRequested)}
                      refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
                      ItemSeparatorComponent = { this.FlatListItemSeparator }
                    />

                    <View
                      style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: colors.terciaryText,
                      }}
                    />
                    </View>
                )}

        {!!ownerAcademies.length && (
            <TouchableOpacity
                onPress={() => this.addNotification(ownerAcademies)}
                style={ styles.addButton } >
              <Icon
                  name="plus-circle"
                  style={styles.addIcon}
                />
            </TouchableOpacity>
        )}

                        <Modal isVisible={this.state.academyDialogVisible} onBackdropPress={() => this.setState({ academyDialogVisible: false })}>
                            <View>
                        {!!ownerAcademies.length && ownerAcademies.map(oa =>
                                  <Button
                                    secondary
                                    rounded
                                    small
                                    bgColor={ colors.primaryBackground }
                                    textColor={ colors.primaryText }
                                    style={ styles.editDetailsButton }
                                    caption={ oa.name }
                                    onPress={() => this.broadcast({ academy: { _id: oa._id, name: oa.name } })}
                                  />
                        )}

                          </View>
                        </Modal>

                        <Modal isVisible={this.state.notificationDialogVisible} onBackdropPress={() => this.setState({ notificationDialogVisible: false })}>
                            <KeyboardInputWrapper>
                            <View>
                                <Text style={styles.academyName}>{ this.state.notification.academy && this.state.notification.academy.name }</Text>
                                <Text style={styles.sendTitle}>{ translate('sendMessage') }</Text>
                                <TextInput
                                  placeholder={ translate('writeMessage') }
                                  style={styles.textAreaInput}
                                  value={this.state.notification.message || ''}
                                  onChangeText={val => this.onChangeNotification(val)}
                                  multiline
                                  numberOfLines={10}
                                />

                            <Button
                                bgColor={colors.secondaryBackground}
                                textColor={colors.secondaryText}
                                secondary
                                rounded
                                style={{
                                 zIndex: 100
                                 }}
                                caption={ translate('send') }
                                onPress={() => this.sendMessage()}
                              />
                          </View>
                          </KeyboardInputWrapper>
                        </Modal>

                        <Modal isVisible={this.state.deleteNotificationDialogVisible} onBackdropPress={() => (this.setState({ deleteNotificationDialogVisible: false }))}>
                            <View>
                              <Button
                                secondary
                                rounded
                                small
                                bgColor={ colors.primaryBackground }
                                textColor={ colors.primaryText }
                                style={ styles.editDetailsButton }
                                caption={ translate('confirmDelete') }
                                onPress={() => this.deleteNotification()}
                              />

                              <Button
                                secondary
                                rounded
                                small
                                bgColor={ colors.primaryBackground }
                                textColor={ colors.primaryText }
                                style={ styles.editDetailsButton }
                                caption={ translate('cancel') }
                                onPress={() => this.setState({ deleteNotificationDialogVisible: false })}
                              />
                          </View>
                        </Modal>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondaryBackground,
        flex: 1
    },
    noNotifications: {
        fontSize: 20,
        textAlign: 'center',
        color: colors.terciaryText
    },
  addIcon: {
        fontSize: 35,
        backgroundColor: colors.iconBackground,
        color: colors.secondaryIcon,
        borderRadius: 20
      },
  addButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        borderRadius: 20,
        overflow: 'hidden'
  },
  editDetailsButton: {
      width: 300,
      alignSelf: 'center',
      marginTop: 20
    },
  textAreaInput: {
    alignSelf: 'stretch',
    height:200
  },
  sendTitle: {
    fontSize: 20,
    color: colors.primaryText
  },
  academyName: {
    fontSize: 25,
    color: colors.primaryText,
    fontWeight: 'bold'
  },
});
