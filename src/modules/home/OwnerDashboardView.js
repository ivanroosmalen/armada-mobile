import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Dimensions,
  Animated,
  RefreshControl,
  ScrollView
} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import { fonts, colors } from '../../styles';
import { Text } from '../../components/StyledText';
import { translate } from '../../translations/index.js';
import { Button, Dropdown } from '../../components';
import settings from '../../settings.js'
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AcademyElement from '../academies/AcademyElement';
import AcademyRequestElement from '../academies/AcademyRequestElement';
import UserElement from '../profile/UserElement';

import { LineChart } from "react-native-chart-kit";

export default class OwnerDashboardScreen extends React.Component {

    state = {
        academies: [],
        anim: new Animated.Value(0),
        refreshing: false,
        academyIndex: 0
      }

    async onRefresh() {
      this.setState({ refreshing: true })
      await this.getData(false);
      this.setState({ refreshing: false })
    }

    async getAssociatedData(academyId, fromCache = true) {
        if(!academyId) {
            return;
        }
        await Promise.all([
            this.props.getAcademyMembers(academyId, { academyId: academyId }, {}, fromCache)
        ])
    }

  async getData(fromCache = true) {
    let dataRequests = [];
    if(this.props.loggedInUser) {
        dataRequests.push(this.props.getUserAcademies(this.props.loggedInUser._id, {}, fromCache))
        dataRequests.push(this.props.getAcademyRequests({ complete: false }))
    }
    await Promise.all(dataRequests, fromCache);

    let academies = this.props.loggedInUser && this.props.userAcademies && this.props.userAcademies[this.props.loggedInUser._id] && this.props.userAcademies[this.props.loggedInUser._id]['owner'] || [];
    let currentAcademy = academies[this.state.academyIndex] && academies[this.state.academyIndex] || {};
    await this.getAssociatedData(currentAcademy._id);
    this.setState({
        academies: academies
    });
  }

  async componentDidMount() {
    await this.getData();

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    async componentDidUpdate(prevProps, prevState) {
      if (prevProps.academyListUpdate !== this.props.academyListUpdate) {
        this.getData(false);
      }

      if(prevProps.loggedInUser !== this.props.loggedInUser) {
        this.getData(false);
      }
    }

  async onAcademySelected(index) {
    let academyId = this.state.academies && this.state.academies[index] && this.state.academies[index]._id;
    this.getAssociatedData(academyId);
    this.setState({ academyIndex: index});
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

    _getRenderItemFunction = ({ item }) => {
        return (
               <AcademyElement
                    academy={item}
                    key={item._id}
                    style={{flex: 1}}
               />
        );
      };

  _getRenderAcademyRequestFunction = ({ item }) => {
    return (
       <AcademyRequestElement
            academyRequest={item}
            approveAcademyRequest={this.props.approveAcademyRequest}
            key={item._id}
       />
    );
  };

  _getRenderMembersFunction = ({ item }) => {

    return (
       <UserElement
            user={item}
       />

    );
  };


    render() {
           let currentUser = this.props.loggedInUser;
           let academies = this.state.academies;
           let academyNames = academies && academies.map(academy => academy.name);
           let currentAcademy = academies && academies[this.state.academyIndex] || null;
           let hasAcademies = !!(academies && academies.length);
           let academyRequests = currentAcademy && this.props.academyRequests && this.props.academyRequests.filter(ar => ar.academy._id === currentAcademy._id) || [];
           let academyMembers = currentAcademy && this.props.academyMembers && this.props.academyMembers[currentAcademy._id] || [];
          academyMembers = academyMembers.sort((a,b) => {
              if(!a.member.alias) {
                a.member.alias = 'Unknown'
              }
              if(!b.member.alias) {
                b.member.alias = 'Unknown'
              }

              return a.member.alias.trim().toLowerCase() > b.member.alias.trim().toLowerCase()
          })

           return (
             <Animated.View
                style={[,this.fadeIn(0, 0)]}
                contentContainerStyle={styles.container}
                >
                <ScrollView style={styles.section}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
                    >

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

                {currentUser && currentAcademy && (
                  <View>
                      <View style={styles.academySection}>
                        <AcademyElement
                                academy={currentAcademy}
                                style={{flex: 1}}
                           />
                      </View>

                    <View style={{marginVertical: 20}}>
                      <TouchableOpacity style={styles.headerContainer}
                            onPress={() => {this.props.navigation.navigate('AcademyUsers', { id: currentAcademy._id })}}>
                         <Text style={styles.header}>{ translate('members') } ({currentAcademy.memberCount || 0})</Text>
                          <Icon
                            name="menu-right"
                            size={25}
                            color={colors.secondaryIcon}
                          />
                      </TouchableOpacity>
                      <View style={ styles.imageContainer }>
                          <FlatList
                                horizontal
                                keyExtractor={item => item._id }
                                data={academyMembers}
                                renderItem={this._getRenderMembersFunction}
                            />
                      </View>
                    </View>

                {!!(academyRequests && academyRequests.length) && (
                    <View style={{marginVertical: 20}}>
                     <TouchableOpacity style={styles.headerContainer}
                        onPress={() => {this.props.navigation.navigate('AcademyRequestList')}}>
                         <Text style={styles.header}>
                             {translate('academyRequests')} ({academyRequests.length})
                         </Text>
                      <Icon
                        name="menu-right"
                        size={25}
                        color={colors.secondaryIcon}
                      />
                     </TouchableOpacity>
                        <FlatList
                          keyExtractor={item => item._id }
                          style={{ backgroundColor: colors.terciaryBackground, paddingHorizontal: 15 }}
                          data={academyRequests}
                          renderItem={this._getRenderAcademyRequestFunction}
                        />
                    </View>
                 )}

                  </View>
              )}

              </ScrollView>

             </Animated.View>
           );
         }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'space-between'
  },
  section: {
    flexShrink: 1
  },
  academySection: {
    flexShrink: 0,
    justifyContent: 'flex-end'
  },
  quarterSection: {
    justifyContent: 'flex-end',
    paddingBottom: 20
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    color: colors.terciaryText
  },
  content: {
    paddingTop: 20,
    fontSize: 20,
    paddingHorizontal: 15
  },
  loginRegisterButton: {
    width: 200,
    marginTop: 50,
    alignSelf: 'center'
  },
  createAcademyButton: {
    width: 250,
    marginTop: 20,
    alignSelf: 'center'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10
  },
  imageContainer: {
    backgroundColor: colors.white,
    marginTop: 20,
    paddingLeft: 20
  },
  itemLabel: {
    width: 200,
    fontWeight: 'bold',
    top: 10,
    paddingHorizontal: 20,
    color: colors.terciaryText
  }
});
