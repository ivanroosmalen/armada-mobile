import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Dimensions,
  Animated,
  RefreshControl
} from 'react-native';

import { fonts, colors } from '../../styles';
import { Text } from '../../components/StyledText';
import { translate } from '../../translations/index.js';
import GetLocation from 'react-native-get-location'
import { Button } from '../../components';
import settings from '../../settings.js'

import AcademyElement from '../academies/AcademyElement';
import AcademyRequestElement from '../academies/AcademyRequestElement';

export default class HomeScreen extends React.Component {

    state = {
        displayedAcademies: [],
        anim: new Animated.Value(0),
        refreshing: false
      }

    async onRefresh() {
      this.setState({ refreshing: true })
        let dataRequests = [
            this.props.getAcademies()
        ];
        if(this.props.loggedInUser) {
             dataRequests.push(this.props.getUserAcademies(this.props.loggedInUser._id))
             dataRequests.push(this.props.getAcademyRequests({ complete: false }))
        }
             await Promise.all(dataRequests);

             let academyTypeObjs = ['student', 'instructor', 'owner']
             let userAcademiesById = {};
                 academyTypeObjs.forEach(academyTypeObj => {
                     if(this.props.userAcademies && this.props.userAcademies[academyTypeObj] && this.props.userAcademies[academyTypeObj].length) {
                         this.props.userAcademies[academyTypeObj].forEach(academy => {
                             userAcademiesById[academy._id] = academy;
                         })
                     }
                 })

              let userAcademies = Object.values(userAcademiesById);

             this.setState({
                 allUserAcademies: userAcademies
             });
      this.setState({ refreshing: false })
    }

  async componentDidMount() {
    let location = {};
    try {
        location = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 1000,
        })
    } catch(e) {
    }

    location.latitude = location.latitude || settings.defaultLat;
    location.longitude = location.longitude  || settings.defaultLng

    let params = {
      currentLat: location.latitude,
      currentLng: location.longitude
    }

    let dataRequests = [
        this.props.getAcademies(params)
    ];

    if(this.props.loggedInUser) {
        dataRequests.push(this.props.getUserAcademies(this.props.loggedInUser._id))
        dataRequests.push(this.props.getAcademyRequests({ complete: false }))
    }
    await Promise.all(dataRequests);

    let academyTypeObjs = ['student', 'instructor', 'owner']
    let userAcademiesById = {};
        academyTypeObjs.forEach(academyTypeObj => {
            if(this.props.userAcademies && this.props.userAcademies[academyTypeObj] && this.props.userAcademies[academyTypeObj].length) {
                this.props.userAcademies[academyTypeObj].forEach(academy => {
                    userAcademiesById[academy._id] = academy;
                })
            }
        })

     let userAcademies = Object.values(userAcademiesById);

    this.setState({
        location,
        allUserAcademies: userAcademies
    });

    Animated.timing(this.state.anim, { toValue: 1000, duration: 1000 }).start();
  }

    async componentDidUpdate(prevProps, prevState) {
      if (prevProps.userAcademies !== this.props.userAcademies || prevProps.academies !== this.props.academies) {

            let academyTypeObjs = ['student', 'instructor', 'owner']
            let userAcademiesById = {};
                academyTypeObjs.forEach(academyTypeObj => {
                    if(this.props.userAcademies && this.props.userAcademies[academyTypeObj] && this.props.userAcademies[academyTypeObj].length) {
                        this.props.userAcademies[academyTypeObj].forEach(academy => {
                            userAcademiesById[academy._id] = academy;
                        })
                    }
                })

             let userAcademies = Object.values(userAcademiesById);

            this.setState({
                allUserAcademies: userAcademies
            })
      }
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

    render() {
           let hasAcademies = this.props.userAcademies && (this.props.userAcademies['student'] || this.props.userAcademies['instructor'] || this.props.userAcademies['instructor']);
           let displayedAcademies = hasAcademies ? this.state.allUserAcademies : this.props.academies;
           let academyRequests = (this.props && this.props.academyRequests) || [];

           return (
             <Animated.ScrollView
                style={[this.fadeIn(0, 0)]}
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
                >
                <View style={styles.section}>
                {!academyRequests || !academyRequests.length && (
                    <View>
                     <Text style={styles.header}>
                         {translate('welcome')}
                     </Text>
                     <Text style={styles.content}>
                        {translate('howToUse')}
                     </Text>
                    </View>
                 )}

                {!!academyRequests && !!academyRequests.length && (
                    <View>
                     <Text style={styles.header}>
                         {translate('academyRequests')}
                     </Text>
                        <FlatList
                          keyExtractor={item => item._id }
                          style={{ backgroundColor: colors.terciaryBackground, paddingHorizontal: 15 }}
                          data={this.props.academyRequests || []}
                          renderItem={this._getRenderAcademyRequestFunction}
                        />
                    </View>
                 )}

                {!this.props.loggedInUser && (
                <Button
                        secondary
                        rounded
                        small
                        bgColor={ colors.primaryBackground }
                        textColor={ colors.primaryText }
                        style={ styles.loginRegisterButton }
                        caption={ translate('loginRegister') }
                        onPress={() => this.props.navigation.navigate('Auth')}
                      />
                )}
              </View>

              {!!(displayedAcademies && displayedAcademies.length) && (
                  <View style={styles.academySection}>
                     <Text style={styles.header}>
                         {hasAcademies ? translate('yourAcademies') : translate('academiesNearYou')}
                     </Text>
                             <FlatList
                               horizontal
                               keyExtractor={item => item._id }
                               style={{ backgroundColor: colors.white, paddingHorizontal: 15 }}
                               data={displayedAcademies}
                               renderItem={this._getRenderItemFunction}
                               contentContainerStyle={{ paddingRight: 30 }}
                             />
                  </View>
              )}

              {!(displayedAcademies && displayedAcademies.length) && (
                <View style={styles.academySection}>
                  <View>
                     <Text style={styles.content}>
                         {translate('noAcademiesNear')}
                     </Text>

                    {!this.props.loggedInUser && (
                        <Button
                            secondary
                            rounded
                            small
                            bgColor={ colors.primaryBackground }
                            textColor={ colors.primaryText }
                            style={ styles.createAcademyButton }
                            caption={ translate('createYourAcademy') }
                            onPress={() => this.props.navigation.navigate('Auth')}
                          />
                    )}

                    {!!this.props.loggedInUser && (
                        <Button
                            secondary
                            rounded
                            small
                            bgColor={ colors.primaryBackground }
                            textColor={ colors.primaryText }
                            style={ styles.createAcademyButton }
                            caption={ translate('createYourAcademy') }
                            onPress={() => this.props.navigation.navigate('AcademyCreate')}
                          />
                    )}
                  </View>

                  <View style={styles.quarterSection}>
                     <Text style={styles.content}>
                         {translate('browse')}
                     </Text>

                        <Button
                            secondary
                            rounded
                            small
                            bgColor={ colors.primaryBackground }
                            textColor={ colors.primaryText }
                            style={ styles.createAcademyButton }
                            caption={ translate('academies') }
                            onPress={() => this.props.navigation.navigate('Academies')}
                          />
                  </View>
                </View>
              )}

             </Animated.ScrollView>
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
  },
  academySection: {
    justifyContent: 'flex-end'
  },
  quarterSection: {
    justifyContent: 'flex-end',
    paddingBottom: 20
  },
  header: {
    marginTop: 5,
    fontSize: 20,
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
  }
});
