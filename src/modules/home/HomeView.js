import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList
} from 'react-native';

import { fonts, colors } from '../../styles';
import { Text } from '../../components/StyledText';
import { translate } from '../../translations/index.js';
import GetLocation from 'react-native-get-location'
import { Button } from '../../components';

import AcademyElement from '../academies/AcademyElement';
import AcademyRequestElement from '../academies/AcademyRequestElement';

export default class HomeScreen extends React.Component {

    state = {
        displayedAcademies: [],
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
    })
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
             <View style={styles.container}>
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
                  <View style={styles.section}>
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
                <View style={styles.section}>
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
                            caption={ translate('createAcademy') }
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
                            caption={ translate('createAcademy') }
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

             </View>
           );
         }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
  },
  section: {
    flex: 0.5
  },
  quarterSection: {
    flex: 0.25
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
    marginTop: 30,
    alignSelf: 'center'
  }
});
