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
import { translate, i18n } from '../../translations/index.js';
import stripe from 'tipsi-stripe'
import Toast from 'react-native-simple-toast';
import isEmail from 'validator/lib/isEmail';

import AcademyUserElement from './AcademyUserElement';

export default class NotificationListScreen extends React.Component {

  state = {
    anim: new Animated.Value(0),
    refreshing: false,
    addUserDialogVisible: false,
    entity: {
        email: '',
        alias: '',
        locale: i18n.locale
    },
    errors: {
        aliasError: '',
        emailError: ''
    },
    isValid: false,
    submitSuccess: false,
    memberToLink: {}
  }

    onChangeText = async (key, val) => {
      this.state.entity[key] = val;

      if(this.state) {
         this.setState({
              entity: this.state.entity
         })
      }
    }

    validate = (linkUser = false) => {
        this.state.isValid = true;

        if(linkUser) {
            if(!isEmail(this.state.entity.email)) {
                this.state.errors.emailError = translate('emailError');
                this.state.isValid = false;
            } else {
                this.state.errors.emailError = '';
            }
        } else {
            if(!this.state.entity.alias) {
                this.state.errors.aliasError = translate('aliasError');
                this.state.isValid = false;
            } else {
                this.state.errors.aliasError = '';
            }
        }

        this.setState({
            errors: this.state.errors
        })

        return this.state.isValid;
    }

  addUser = async () => {
           if(this.validate()) {
               this.setState({ refreshing: true });
               let entity = this.state.entity;
               if(entity.email) {
                   entity.academyId = this.props.route.params.id;
                   let response = await this.props.registerByAcademy(entity);
                   if(response.status === 201 || response.status === 200) {
                       this.state.errors.pageError = '';

                       await this.getData(false);
                       this.setState({ addUserDialogVisible: false })
                   } else {
                       this.state.errors.pageError = translate('registerError');
                   }
               } else {
                   let academyMember = {
                       member: {
                           alias: entity.alias
                       },
                       academy: {
                           _id: this.props.route.params.id
                       }
                   }
                   await this.props.createAcademyMembers(academyMember);

                   await this.getData(false);
                   this.setState({ addUserDialogVisible: false })
               }

               this.setState({ refreshing: false });
           }
     }

  linkUser = async () => {
        if(this.validate(true)) {
            this.setState({ refreshing: true });
            let entity = this.state.entity;

            let response = await this.props.linkUser(this.state.memberToLink._id, entity);

            if(response.status === 201 || response.status === 200) {
                this.state.errors.pageError = '';

                await this.getData(false);
                this.setState({ linkUserDialogVisible: false })
            } else {
                this.state.errors.pageError = translate('registerError');
            }

            this.setState({ refreshing: false });
        }
  }

  onLinkUser = async (academyMember) => {
    this.setState({ memberToLink: academyMember, linkUserDialogVisible: true });
  }

  async onRefresh() {
    this.setState({ refreshing: true })
    await this.getData(false);
    this.setState({ refreshing: false })
  }

  async getData(fromCache = true) {
    let currentUser = this.props.loggedInUser;
    if(currentUser) {
        await Promise.all([
            this.props.getAcademy(this.props.route.params.id, {}, fromCache),
            this.props.getAcademyMembers(this.props.route.params.id, { academyId: this.props.route.params.id, sort: 'member.alias' }, {}, fromCache)
        ])
    }
  }

  async componentDidMount() {
    await this.getData();

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    async componentDidUpdate(prevProps, prevState) {
      if(prevProps.loggedInUser !== this.props.loggedInUser && this.props.loggedInUser) {
        await this.getData(false);
      }
    }

    updateMember = async (id, academyMember) => {
        await this.props.updateAcademyMembers(id, academyMember);
    }

    removeMember = async (id) => {
        await this.props.removeAcademyMembers(id);
        await this.getData(false);
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

  _getRenderItemFunction = ({ item }, academy, currentUser, userIsOwner, updateAcademyMembers, removeAcademyMembers) => {
    let ownerIsCurrent = currentUser && item.member._id === currentUser._id && userIsOwner;

    return (
       <AcademyUserElement
            academyMember={item}
            academy={academy}
            isOwner={userIsOwner}
            ownerIsCurrent={ownerIsCurrent}
            updateAcademyMembers={updateAcademyMembers}
            removeAcademyMembers={removeAcademyMembers}
            onLinkUser={this.onLinkUser}
            key={item._id+item.member._id+item.member.alias}
       />
    );
  };

  render() {
    let currentUser = this.props.loggedInUser;
    let academy = this.props.academy && this.props.academy[this.props.route.params.id] || {};
    let academyMembers = this.props.academyMembers && this.props.academyMembers[this.props.route.params.id] || [];
    academyMembers = academyMembers.sort((a,b) => {
          if(!a.member.alias) {
            a.member.alias = 'Unknown'
          }
          if(!b.member.alias) {
            b.member.alias = 'Unknown'
          }

          return a.member.alias.trim().toLowerCase() > b.member.alias.trim().toLowerCase()
      })
    let userIsOwner = !!(currentUser && academyMembers && academyMembers.find(academyMember => (academyMember.member._id === this.props.loggedInUser._id && academyMember.isOwner)))

    console.log(academyMembers)

    return (
      <Animated.View style={[styles.container, this.fadeIn(0, 0)]} >
            <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}>
                <Text style={styles.headerTitle}>{translate('members')} - {academy.name}</Text>

                { !academyMembers && (
                    <Text style={styles.noMembers}>{ translate('noMembers') }</Text>
                )}

                { !!academyMembers && (
                    <FlatList
                      keyExtractor={item => item._id }
                      style={{ backgroundColor: colors.secondaryBackground, paddingHorizontal: 15, flex: 1 }}
                      data={academyMembers}
                      renderItem={(obj) => this._getRenderItemFunction(obj, academy, currentUser, userIsOwner, this.updateMember, this.removeMember)}
                    />
                )}

            </ScrollView>
                {userIsOwner && (
                <TouchableOpacity style={ styles.addButton } onPress={() => this.setState({ addUserDialogVisible: true })}>
                  <Icon
                      name="plus-circle"
                      style={styles.addIcon}
                    />
                </TouchableOpacity>
                )}

                        <Modal isVisible={this.state.addUserDialogVisible} onBackdropPress={() => this.setState({ addUserDialogVisible: false })}>
                            <KeyboardInputWrapper>
                            <View style={{ backgroundColor: colors.primaryBackground, paddingVertical: 50, borderRadius: 15 }}>
                                <TextInput
                                  placeholder={ translate('alias') }
                                  style={styles.textAreaInput}
                                  onChangeText={val => this.onChangeText('alias', val)}
                                />
                                <Text style={{ fontSize: 12, color: 'red'}}>
                                    {this.state.errors.aliasError}
                                </Text>

                                <TextInput
                                  placeholder={ 'email'}
                                  style={styles.textAreaInput}
                                  onChangeText={val => this.onChangeText('email', val)}
                                />
                                <Text style={{ fontSize: 12, color: 'red'}}>
                                    {this.state.errors.emailError}
                                </Text>

                              <Text style={{ fontSize: 12, color: 'red'}}>
                                    {this.state.errors.pageError}
                              </Text>

                            <Button
                                bgColor={colors.secondaryBackground}
                                textColor={colors.secondaryText}
                                secondary
                                rounded
                                style={{
                                 zIndex: 100
                                 }}
                                caption={ this.state.entity.email ? translate('addUserSendEmail') : translate('addUser') }
                                onPress={() => this.addUser()}
                              />
                          </View>
                          </KeyboardInputWrapper>
                        </Modal>

                        <Modal isVisible={this.state.linkUserDialogVisible} onBackdropPress={() => this.setState({ linkUserDialogVisible: false })}>
                            <KeyboardInputWrapper>
                            <View style={{ backgroundColor: colors.primaryBackground, paddingVertical: 50, borderRadius: 15 }}>
                                <TextInput
                                  placeholder={ 'email'}
                                  style={styles.textAreaInput}
                                  onChangeText={val => this.onChangeText('email', val)}
                                />
                                <Text style={{ fontSize: 12, color: 'red'}}>
                                    {this.state.errors.emailError}
                                </Text>

                              <Text style={{ fontSize: 12, color: 'red'}}>
                                    {this.state.errors.pageError}
                              </Text>

                            <Button
                                bgColor={colors.secondaryBackground}
                                textColor={colors.secondaryText}
                                secondary
                                rounded
                                style={{
                                 zIndex: 100
                                 }}
                                caption={ translate('linkUser') }
                                onPress={() => this.linkUser()}
                              />
                          </View>
                          </KeyboardInputWrapper>
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
  headerTitle: {
      fontSize: 25,
      color: colors.terciaryText,
      textAlign: 'left',
      marginTop: 10,
      textAlign: 'center'
  },
  addIcon: {
        fontSize: 35,
        backgroundColor: colors.iconBackground,
        color: colors.secondaryIcon,
        borderRadius: 20
      },
  addButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        borderRadius: 20,
        overflow: 'hidden'
  }
});
